import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { NgWizardConfig, NgWizardModule, THEME } from 'ng-wizard'

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default,
  lang: {
    next: 'Próximo',
    previous: 'Voltar'
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      NgWizardModule.forRoot(ngWizardConfig)
    )
  ]
}
