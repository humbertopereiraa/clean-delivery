import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ClienteComponent } from './cliente.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { ClienteRoutingModule } from './cliente-routing.module'
import { DashboardHeaderComponent } from '../../shared/components/dashboard-header/dashboard-header.component'
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component'

@NgModule({
  imports: [
    CommonModule,
    ClienteRoutingModule,
    DashboardHeaderComponent,
    StatCardComponent
  ],
  declarations: [ClienteComponent, DashboardComponent],
  exports: [DashboardComponent]
})
export class ClienteModule { }
