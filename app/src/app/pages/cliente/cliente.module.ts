import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ClienteComponent } from './cliente.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { ClienteRoutingModule } from './cliente-routing.module'

@NgModule({
  imports: [
    CommonModule,
    ClienteRoutingModule
  ],
  declarations: [ClienteComponent, DashboardComponent],
  exports: [DashboardComponent]
})
export class ClienteModule { }
