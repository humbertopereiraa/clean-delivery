import { CommonModule } from '@angular/common'
import { Component, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup
  public isLoading = signal(false)
  public showPassword = signal(false)

  constructor(private formBuilder: FormBuilder) {
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
      this.isLoading.set(true)
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((value: boolean) => !value)
  }
}
