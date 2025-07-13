import { bootstrapApplication } from "@angular/platform-browser"
import { AppComponent } from "./app/app.component"
import { appConfig } from './app/app.config'

import 'bootstrap/dist/js/bootstrap.bundle.min'

bootstrapApplication(AppComponent, appConfig)
  .catch((erro) => console.error(erro))