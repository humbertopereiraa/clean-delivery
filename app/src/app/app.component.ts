import { Component } from '@angular/core'
import { LayoutComponent } from './shared/components/layout/layout.component'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-root',
    imports: [LayoutComponent, RouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Clean Delivery'
}
