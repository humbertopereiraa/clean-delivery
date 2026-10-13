import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { HttpErrorResponse, type HttpClient } from '@angular/common/http'
import { type Router } from '@angular/router'
import { firstValueFrom, of, throwError, type Observable } from 'rxjs'
import { AuthService } from './auth.service'
import { ETipoUsuario } from '../enums/tipo-usuario.enum'
import { environment } from '../../../environments/environment'
import { type IUsuario } from '../../models/usuario.model'

interface RespostaAuthApi {
  id: string
  nome: string
  email: string
  cpf: string
  role: ETipoUsuario
  token: string
}

interface CorpoLogin {
  email: string
  senha: string
}

interface RouterMock {
  navigate: Mock<(comandos: readonly string[]) => Promise<boolean>>
}

interface HttpLoginMock {
  post: Mock<(url: string, corpo: CorpoLogin) => Observable<RespostaAuthApi>>
}

const MENSAGEM_CREDENCIAIS_INVALIDAS = 'Falha na autenticação. Verifique seu email e senha.'

function criarRespostaApi(
  dados: Pick<RespostaAuthApi, 'email' | 'role'> & Partial<Omit<RespostaAuthApi, 'email' | 'role'>>,
): RespostaAuthApi {
  return {
    id: 'usr-1',
    nome: 'Usuário Teste',
    cpf: '12345678901',
    token: `jwt-${dados.role}`,
    ...dados,
  }
}

describe('AuthService', () => {
  let service: AuthService
  let router: RouterMock
  let http: HttpLoginMock

  beforeEach(() => {
    localStorage.clear()

    router = {
      navigate: vi.fn<(comandos: readonly string[]) => Promise<boolean>>(() => Promise.resolve(true)),
    }

    http = {
      post: vi.fn<(url: string, corpo: CorpoLogin) => Observable<RespostaAuthApi>>(),
    }

    service = new AuthService(router as unknown as Router, http as unknown as HttpClient)
  })

  async function autenticar(resposta: RespostaAuthApi, senha = '123456'): Promise<void> {
    http.post.mockReturnValue(of(resposta))
    await firstValueFrom(service.logar({ email: resposta.email, password: senha }))
  }

  it('deve realizar login com sucesso', async () => {
    const resposta = criarRespostaApi({
      id: 'usr-cliente',
      nome: 'Maria Cliente',
      email: 'cliente@email.com',
      cpf: '12345678901',
      role: ETipoUsuario.CLIENTE,
      token: 'jwt-cliente',
    })
    http.post.mockReturnValue(of(resposta))

    const resultado = await firstValueFrom(service.logar({
      email: 'cliente@email.com',
      password: '123456',
    }))

    const usuario: IUsuario = {
      id: 'usr-cliente',
      nome: 'Maria Cliente',
      email: 'cliente@email.com',
      cpf: '12345678901',
      role: ETipoUsuario.CLIENTE,
    }

    expect(http.post).toHaveBeenCalledWith(`${environment.apiAuthUrl}/login`, {
      email: 'cliente@email.com',
      senha: '123456',
    })
    expect(resultado).toEqual({
      sucesso: true,
      usuario,
      token: 'jwt-cliente',
    })
    expect(service.isAutenticado()).toBe(true)
    expect(service.obterToken()).toBe('jwt-cliente')
    expect(service.obterUsuarioAtual()).toEqual(usuario)
    expect(localStorage.getItem('delivery-app-token')).toBe('jwt-cliente')
    expect(JSON.parse(localStorage.getItem('delivery-app-usuario') ?? '')).toEqual(usuario)
  })

  it('deve falhar login com senha incorreta', async () => {
    http.post.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 401,
      error: { erro: MENSAGEM_CREDENCIAIS_INVALIDAS },
    })))

    const resultado = await firstValueFrom(service.logar({
      email: 'cliente@email.com',
      password: 'senha-errada',
    }))

    expect(http.post).toHaveBeenCalledWith(`${environment.apiAuthUrl}/login`, {
      email: 'cliente@email.com',
      senha: 'senha-errada',
    })
    expect(resultado).toEqual({
      sucesso: false,
      mensagem: MENSAGEM_CREDENCIAIS_INVALIDAS,
    })
    expect(service.isAutenticado()).toBe(false)
    expect(service.obterUsuarioAtual()).toBeNull()
    expect(service.obterToken()).toBeNull()
    expect(localStorage.getItem('delivery-app-usuario')).toBeNull()
  })

  it('deve deslogar corretamente', async () => {
    await autenticar(criarRespostaApi({
      email: 'cliente@email.com',
      role: ETipoUsuario.CLIENTE,
      token: 'jwt-cliente',
    }))

    service.deslogar()

    expect(service.isAutenticado()).toBe(false)
    expect(service.obterUsuarioAtual()).toBeNull()
    expect(localStorage.getItem('delivery-app-token')).toBeNull()
    expect(localStorage.getItem('delivery-app-usuario')).toBeNull()
    expect(router.navigate).toHaveBeenCalledWith(['/login'])
  })

  it('deve redirecionar cliente para dashboard correto', async () => {
    await autenticar(criarRespostaApi({
      email: 'cliente@email.com',
      role: ETipoUsuario.CLIENTE,
    }))

    service.redirecionarParaDashboard()

    expect(router.navigate).toHaveBeenCalledWith(['cliente/dashboard'])
  })

  it('deve redirecionar entregador para dashboard correto', async () => {
    await autenticar(criarRespostaApi({
      email: 'entregador@email.com',
      role: ETipoUsuario.ENTREGADORES,
    }))

    service.redirecionarParaDashboard()

    expect(router.navigate).toHaveBeenCalledWith(['entregador/dashboard'])
  })

  it('deve redirecionar admin para dashboard correto', async () => {
    await autenticar(criarRespostaApi({
      email: 'admin@email.com',
      role: ETipoUsuario.ADMIN,
    }))

    service.redirecionarParaDashboard()

    expect(router.navigate).toHaveBeenCalledWith(['admin/dashboard'])
  })

  it('deve redirecionar para login se não houver usuário', () => {
    service.redirecionarParaDashboard()

    expect(router.navigate).toHaveBeenCalledWith(['/login'])
    expect(http.post).not.toHaveBeenCalled()
  })

  it('deve restaurar autenticação se houver token no localStorage', () => {
    const usuario: IUsuario = {
      id: '1',
      nome: 'Teste',
      email: 'teste@email.com',
      role: ETipoUsuario.CLIENTE,
      cpf: '12345678901',
    }

    localStorage.setItem('delivery-app-token', 'token')
    localStorage.setItem('delivery-app-usuario', JSON.stringify(usuario))

    const restaurado = new AuthService(
      router as unknown as Router,
      http as unknown as HttpClient,
    )

    expect(restaurado.isAutenticado()).toBe(true)
    expect(restaurado.obterUsuarioAtual()).toEqual(usuario)
    expect(http.post).not.toHaveBeenCalled()
  })
})
