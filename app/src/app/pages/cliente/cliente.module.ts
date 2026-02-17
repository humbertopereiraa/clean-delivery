import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ClienteComponent } from './cliente.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { ClienteRoutingModule } from './cliente-routing.module'
import { DashboardHeaderComponent } from '../../shared/components/dashboard-header/dashboard-header.component'
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component'
import { CadastroPedidoComponent } from './components/cadastro-pedido/cadastro-pedido.component'
import { PopupComponent } from '../../shared/components/popup/popup.component'
import { ReactiveFormsModule } from '@angular/forms'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

@NgModule({
    declarations: [ClienteComponent, DashboardComponent, CadastroPedidoComponent],
    exports: [DashboardComponent],
    imports: [
        CommonModule,
        ClienteRoutingModule,
        DashboardHeaderComponent,
        StatCardComponent,
        PopupComponent,
        ReactiveFormsModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class ClienteModule { }
