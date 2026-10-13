import { Injectable } from '@angular/core'
import { IUsuario } from '../../models/usuario.model'
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs'
import { ETipoUsuario } from '../enums/tipo-usuario.enum'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

export interface ICredenciaisLogin {
  email: string
  password: string
}

export interface IRespostaLogin {
  sucesso: boolean
  usuario?: IUsuario
  token?: string
  mensagem?: string
}

interface IRespostaAuthApi {
  id: string
  nome: string
  email: string
  cpf: string
  role: ETipoUsuario
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly CHAVE_TOKEN = "delivery-app-token"
  private readonly CHAVE_USUARIO = "delivery-app-usuario"

  private subjectAutenticado = new BehaviorSubject<boolean>(false)
  private subjectUsuarioAtual = new BehaviorSubject<IUsuario | null>(null)

  public isAutenticado$ = this.subjectAutenticado.asObservable()
  public usuarioAtual$ = this.subjectUsuarioAtual.asObservable()

  constructor(private router: Router, private http: HttpClient) {
    this.inicializarAutenticacao()
  }

  public logar(credenciais: ICredenciaisLogin): Observable<IRespostaLogin> {
    const url = `${environment.apiAuthUrl}/login`

    return this.http.post<IRespostaAuthApi>(url, {
      email: credenciais.email,
      senha: credenciais.password,
    }).pipe(
      map((resposta) => {
        const usuario: IUsuario = {
          id: resposta.id,
          nome: resposta.nome,
          email: resposta.email,
          cpf: resposta.cpf,
          role: resposta.role,
        }

        localStorage.setItem(this.CHAVE_TOKEN, resposta.token)
        localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(usuario))

        this.subjectUsuarioAtual.next(usuario)
        this.subjectAutenticado.next(true)

        return {
          sucesso: true,
          usuario,
          token: resposta.token,
        }
      }),
      catchError((erro) => of({
        sucesso: false,
        mensagem: erro?.error?.erro || erro?.error?.message || 'Erro no login',
      }))
    )
  }

  public deslogar(): void {
    localStorage.removeItem(this.CHAVE_TOKEN)
    localStorage.removeItem(this.CHAVE_USUARIO)

    this.subjectUsuarioAtual.next(null)
    this.subjectAutenticado.next(false)

    this.router.navigate(["/login"])
  }

  public obterUsuarioAtual(): IUsuario | null {
    return this.subjectUsuarioAtual.value
  }

  public obterToken(): string | null {
    return localStorage.getItem(this.CHAVE_TOKEN)
  }

  public isAutenticado(): boolean {
    return this.subjectAutenticado.value
  }

  public redirecionarParaDashboard(): void {
    const usuario = this.obterUsuarioAtual()

    if (!usuario) {
      this.router.navigate(["/login"])
      return
    }

    switch (usuario.role) {
      case ETipoUsuario.CLIENTE:
        this.router.navigate(["cliente/dashboard"])
        break
      case ETipoUsuario.ENTREGADORES:
        this.router.navigate(["entregador/dashboard"])
        break
      case ETipoUsuario.ADMIN:
        this.router.navigate(["admin/dashboard"])
        break
      default: //TODO: Criar uma página Perfil não encontrado
        this.router.navigate(["cliente/dashboard"])
    }
  }

  private inicializarAutenticacao(): void {
    const token = localStorage.getItem(this.CHAVE_TOKEN)
    const stringUsuario = localStorage.getItem(this.CHAVE_USUARIO)

    if (token && stringUsuario) {
      try {
        const usuario = JSON.parse(stringUsuario) as IUsuario
        this.subjectUsuarioAtual.next(usuario)
        this.subjectAutenticado.next(true)
      } catch (erro) {
        console.error("Erro ao carregar dados do usuário:", erro)
        this.deslogar()
      }
    }
  }
}
