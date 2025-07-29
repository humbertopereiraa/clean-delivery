import { CommonModule } from '@angular/common'
import { Component, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService, ICredenciaisLogin } from '../../core/services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup
  public isLoading: boolean = false
  public showPassword = signal(false)

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() { }

  get email() {
    return this.loginForm.get("email")
  }

  get password() {
    return this.loginForm.get("password")
  }

  public async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true

      const credentials: ICredenciaisLogin = this.loginForm.value

      this.authService.logar(credentials).subscribe({
        next: (response) => {
          this.isLoading = false

          if (!response.sucesso) {
            return
          }

          this.authService.redirecionarParaDashboard()
        },
        error: (error) => {
          console.error("Erro no login:", error)
          this.isLoading = false
        }
      })
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((value: boolean) => !value)
  }
}
