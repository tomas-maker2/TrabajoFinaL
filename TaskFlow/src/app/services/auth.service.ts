import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    new User('admin', '1234', 'Administrador'),
    new User('alumno', 'testing', 'Alumno TP Final'),
    new User('juan', 'juan123', 'Juan Pérez'),
    new User('maria', 'maria456', 'María Gómez')
  ];
  
  private currentUser: User | null = null;

  constructor() {
    this.loadFromLocalStorage();
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        name: user.name
      }));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    if (this.currentUser) return true;
    const stored = localStorage.getItem('currentUser');
    return stored !== null;
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const userData = JSON.parse(stored);
        this.currentUser = new User(userData.username, '', userData.name);
      }
    }
    return this.currentUser;
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const userData = JSON.parse(stored);
      this.currentUser = new User(userData.username, '', userData.name);
    }
  }
}