import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

// ─────────────────────────────────────────────
// 2.1 PRUEBA DE COMPONENTES (Servicio) – AuthService
// ─────────────────────────────────────────────
describe('AuthService – Prueba de Componentes', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar true con credenciales correctas (admin/1234)', () => {
    expect(service.login('admin', '1234')).toBeTrue();
  });

  it('debería retornar false con credenciales incorrectas', () => {
    expect(service.login('admin', 'mal')).toBeFalse();
  });

  it('debería retornar false con usuario inexistente', () => {
    expect(service.login('noexiste', '1234')).toBeFalse();
  });

  it('isLoggedIn() debería ser true tras login exitoso', () => {
    service.login('admin', '1234');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('isLoggedIn() debería ser false tras logout', () => {
    service.login('admin', '1234');
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('getCurrentUser() debería retornar el usuario logueado', () => {
    service.login('juan', 'juan123');
    const user = service.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user!.username).toBe('juan');
    expect(user!.name).toBe('Juan Pérez');
  });

  it('getCurrentUser() debería ser null antes del login', () => {
    expect(service.getCurrentUser()).toBeNull();
  });
});

// ─────────────────────────────────────────────
// 2.2 PRUEBA DE INTEGRACIÓN – AuthService + localStorage
// ─────────────────────────────────────────────
describe('AuthService – Prueba de Integración', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('login exitoso debe persistir sesión en localStorage', () => {
    service.login('alumno', 'testing');
    const stored = localStorage.getItem('currentUser');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.username).toBe('alumno');
  });

  it('la contraseña NO debe guardarse en localStorage', () => {
    service.login('alumno', 'testing');
    const stored = localStorage.getItem('currentUser');
    const parsed = JSON.parse(stored!);
    expect(parsed.password).toBeUndefined();
  });

  it('logout debe eliminar la sesión de localStorage', () => {
    service.login('admin', '1234');
    service.logout();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('nueva instancia del servicio debe restaurar sesión desde localStorage', () => {
    service.login('maria', 'maria456');
    // Simular recarga: nueva instancia lee el localStorage existente
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(AuthService);
    expect(newService.isLoggedIn()).toBeTrue();
    expect(newService.getCurrentUser()!.username).toBe('maria');
  });
});

// ─────────────────────────────────────────────
// 2.3 PRUEBA DE CAJA NEGRA – AuthService
// ─────────────────────────────────────────────
describe('AuthService – Prueba de Caja Negra', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  const validCredentials = [
    { username: 'admin',  password: '1234',     name: 'Administrador' },
    { username: 'alumno', password: 'testing',  name: 'Alumno TP Final' },
    { username: 'juan',   password: 'juan123',  name: 'Juan Pérez' },
    { username: 'maria',  password: 'maria456', name: 'María Gómez' }
  ];

  validCredentials.forEach(({ username, password, name }) => {
    it(`[CB] ${username}/${password} → login exitoso, nombre="${name}"`, () => {
      expect(service.login(username, password)).toBeTrue();
      expect(service.getCurrentUser()!.name).toBe(name);
    });
  });

  it('[CB] usuario correcto, contraseña incorrecta → false', () => {
    expect(service.login('admin', 'wrongpass')).toBeFalse();
  });

  it('[CB] usuario inexistente → false', () => {
    expect(service.login('ghost', 'ghost123')).toBeFalse();
  });

  it('[CB] credenciales vacías → false', () => {
    expect(service.login('', '')).toBeFalse();
  });
});

// ─────────────────────────────────────────────
// 2.4 PRUEBA DE RENDIMIENTO – AuthService
// ─────────────────────────────────────────────
describe('AuthService – Prueba de Rendimiento', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('login debe completarse en menos de 50ms', () => {
    const start = performance.now();
    service.login('admin', '1234');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it('isLoggedIn() debe completarse en menos de 10ms', () => {
    service.login('admin', '1234');
    const start = performance.now();
    service.isLoggedIn();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(10);
  });

  it('100 llamadas a isLoggedIn() deben completarse en menos de 100ms', () => {
    service.login('admin', '1234');
    const start = performance.now();
    for (let i = 0; i < 100; i++) service.isLoggedIn();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });
});
