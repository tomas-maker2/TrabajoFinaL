import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ─────────────────────────────────────────────
// 2.1 PRUEBA DE COMPONENTES – LoginComponent
// ─────────────────────────────────────────────
describe('LoginComponent – Prueba de Componentes', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar username y password vacíos', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('debería inicializar errorMessage vacío', () => {
    expect(component.errorMessage).toBe('');
  });

  it('debería llamar a AuthService.login con las credenciales ingresadas', () => {
    authSpy.login.and.returnValue(true);
    component.username = 'admin';
    component.password = '1234';
    component.onLogin();
    expect(authSpy.login).toHaveBeenCalledWith('admin', '1234');
  });

  it('debería navegar a /tasks tras login exitoso', () => {
    authSpy.login.and.returnValue(true);
    component.username = 'admin';
    component.password = '1234';
    component.onLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('debería mostrar error con credenciales incorrectas', () => {
    authSpy.login.and.returnValue(false);
    component.username = 'admin';
    component.password = 'wrongpass';
    component.onLogin();
    expect(component.errorMessage).toBeTruthy();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería alternar showPassword al llamar togglePassword()', () => {
    expect(component.showPassword).toBeFalsy();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
    component.togglePassword();
    expect(component.showPassword).toBeFalse();
  });
});

// ─────────────────────────────────────────────
// 2.3 PRUEBA DE CAJA NEGRA – LoginComponent
// ─────────────────────────────────────────────
describe('LoginComponent – Prueba de Caja Negra', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('[CB] credenciales correctas → redirige a /tasks', () => {
    authSpy.login.and.returnValue(true);
    component.username = 'alumno';
    component.password = 'testing';
    component.onLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('[CB] contraseña incorrecta → muestra error, no navega', () => {
    authSpy.login.and.returnValue(false);
    component.username = 'alumno';
    component.password = 'incorrecta';
    component.onLogin();
    expect(component.errorMessage).toBeTruthy();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('[CB] campos vacíos → no llama a AuthService.login', () => {
    component.username = '';
    component.password = '';
    component.onLogin();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('[CB] solo username sin password → muestra error', () => {
    component.username = 'admin';
    component.password = '';
    component.onLogin();
    expect(component.errorMessage).toBeTruthy();
  });

  it('[CB] solo password sin username → muestra error', () => {
    component.username = '';
    component.password = '1234';
    component.onLogin();
    expect(component.errorMessage).toBeTruthy();
  });
});

// ─────────────────────────────────────────────
// 2.6 PRUEBA DE CAMINO – LoginComponent
// ─────────────────────────────────────────────
describe('LoginComponent – Prueba de Camino', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Camino 1: campos vacíos → retorno temprano sin llamar al servicio
  it('[Camino 1] campos vacíos → retorna sin llamar servicio', () => {
    component.username = '';
    component.password = '';
    component.onLogin();
    expect(authSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.errorMessage).toBeTruthy();
  });

  // Camino 2: validación ok → servicio retorna false → error, sin navegar
  it('[Camino 2] credenciales incorrectas → errorMessage, sin navegación', () => {
    authSpy.login.and.returnValue(false);
    component.username = 'admin';
    component.password = 'mal';
    component.onLogin();
    expect(component.errorMessage).toBeTruthy();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // Camino 3: validación ok → servicio retorna true → navega, sin error
  it('[Camino 3] credenciales correctas → navega a /tasks sin error', () => {
    authSpy.login.and.returnValue(true);
    component.username = 'admin';
    component.password = '1234';
    component.onLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
    expect(component.errorMessage).toBeFalsy();
  });
});
