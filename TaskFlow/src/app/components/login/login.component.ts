import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Complete todos los campos';
      return;
    }

    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/tasks']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
      this.password = '';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}