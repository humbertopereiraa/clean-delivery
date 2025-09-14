import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { MenuService } from '../../../core/services/menu.service'
import { filter, Subject, takeUntil } from 'rxjs'
import { IUsuario } from '../../../models/usuario.model'
import { IItemMenu } from '../../../core/models/menu.model'
import { ETipoUsuario } from '../../../core/enums/tipo-usuario.enum'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

  public usuarioAtual: IUsuario | null = null
  public itensMenu: IItemMenu[] = []
  public tituloAtual: string = "Dashboard"
  public sidebarCollapsed: boolean = false
  public isLogado: boolean = false

  private destroy$ = new Subject<void>()

  constructor(private authService: AuthService, private menuService: MenuService, private router: Router) { }

  ngOnInit(): void {
    this.inicializarUsuario()
    this.escutarMudancasRota()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public alternarSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }

  public realizarLogout(): void {
    this.authService.deslogar()
    this.router.navigate(["/login"])
  }

  private inicializarUsuario(): void {
    this.authService.usuarioAtual$.pipe(takeUntil(this.destroy$)).subscribe((usuario) => {
      if (usuario) {
        usuario.avatar = this.getAvatarUsuario(usuario.role)
        this.itensMenu = this.menuService.obterMenu(usuario.role)
      }
      this.usuarioAtual = usuario
      this.atualizarStatusLogin()
    })
  }

  private getAvatarUsuario(tipoUsuario: ETipoUsuario): string {
    const caminhoAvatar = {
      [ETipoUsuario.ADMIN]: '../../../../assets/images/avatar-admin.png',
      [ETipoUsuario.ENTREGADORES]: '../../../../assets/images/avatar-entregador.png',
      [ETipoUsuario.CLIENTE]: '../../../../assets/images/avatar-cliente.png',
    }
    return caminhoAvatar[tipoUsuario] ?? ''
  }

  private escutarMudancasRota(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.atualizarTitulo(event.url);
        this.atualizarStatusLogin()
      });
  }

  private atualizarStatusLogin(): void {
    this.isLogado = !!this.usuarioAtual && this.router.url !== '/login';
  }

  private atualizarTitulo(url: string): void {
    const encontrarItem = (items: IItemMenu[]): IItemMenu | undefined => {
      for (const item of items) {
        if (url.includes(item.rota)) {
          return item
        }
        if (item.subItens) {
          const subItem = encontrarItem(item.subItens)
          if (subItem) return subItem
        }
      }
      return undefined
    }

    const itemAtivo = encontrarItem(this.itensMenu)
    this.tituloAtual = itemAtivo ? itemAtivo.titulo : "Dashboard"
  }
}
