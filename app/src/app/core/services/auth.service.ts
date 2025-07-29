import { Injectable } from '@angular/core'
import { IUsuario } from '../../models/usuario.model'
import { BehaviorSubject, Observable, of, switchMap, timer } from 'rxjs'
import { ETipoUsuario } from '../enums/tipo-usuario.enum'
import { Router } from '@angular/router'

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

const usuariosMock: IUsuario[] = [
  {
    id: '3b880d0f-a498-4d1b-a731-1bbcf32fff75',
    nome: "João Silva",
    email: "cliente@email.com",
    role: ETipoUsuario.CLIENTE,
    cpf: '83458321560'
  },
  {
    id: '07407f96-016d-43eb-b690-4e0ae4c9a40d',
    nome: "Maria Santos",
    email: "entregador@email.com",
    role: ETipoUsuario.ENTREGADORES,
    cpf: '76674967300'
  },
  {
    id: '45b9bc25-2a19-4f94-8a09-38032f16a98f',
    nome: "Admin Sistema",
    email: "admin@email.com",
    role: ETipoUsuario.ADMIN,
    cpf: '91081667141'
  },
]

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

  constructor(private router: Router) {
    this.inicializarAutenticacao()
  }

  public logar(credenciais: ICredenciaisLogin): Observable<IRespostaLogin> {// TODO: Intergrar com API Auth-service
    return timer(1000).pipe( // simula atraso de 1 segundo
      switchMap(() => {
        const usuario = usuariosMock.find((u) => u.email === credenciais.email);

        if (!(usuario && credenciais.password === "123456")) {
          return of({
            sucesso: false,
            mensagem: "Email ou senha inválidos"
          });
        }

        const token = `mock-jwt-token-${usuario.id}-${Date.now()}`;

        localStorage.setItem(this.CHAVE_TOKEN, token);
        localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(usuario));

        this.subjectUsuarioAtual.next(usuario);
        this.subjectAutenticado.next(true);

        return of({
          sucesso: true,
          usuario,
          token,
          mensagem: "Login realizado com sucesso!"
        });
      })
    );
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
