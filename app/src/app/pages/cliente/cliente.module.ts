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
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  imports: [
    CommonModule,
    ClienteRoutingModule,
    DashboardHeaderComponent,
    StatCardComponent,
    PopupComponent,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [ClienteComponent, DashboardComponent, CadastroPedidoComponent],
  exports: [DashboardComponent]
})
export class ClienteModule { }
