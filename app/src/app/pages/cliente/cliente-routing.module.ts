import { RouterModule, Routes } from "@angular/router"
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { NgModule } from "@angular/core"

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }