import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (result) => {
        this.loading = false;
        // Redirect based on role
        if (result.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (result.role === 'Employee') {
          this.router.navigate(['/employee']);
        } else {
          this.error = 'Unknown user role.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Login failed.';
      }
    });
  }
}
