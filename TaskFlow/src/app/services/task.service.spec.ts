import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { Task } from '../model/task.model';

function makeTask(name: string, category = 'Personal', priority: 'alta' | 'media' | 'baja' = 'media'): Task {
  return new Task(name, '', category, priority);
}

// Usuario falso para los tests
const MOCK_USER = { username: 'testuser', password: 'pass', name: 'Test User' };

function buildAuthSpy(): jasmine.SpyObj<AuthService> {
  const spy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isLoggedIn']);
  spy.getCurrentUser.and.returnValue(MOCK_USER);
  return spy;
}

// ─────────────────────────────────────────────
// 2.1 PRUEBA DE COMPONENTES (Servicio) – TaskService
// ─────────────────────────────────────────────
describe('TaskService – Prueba de Componentes', () => {
  let service: TaskService;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    localStorage.clear();
    authSpy = buildAuthSpy();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    service = TestBed.inject(TaskService);
  });

  afterEach(() => localStorage.clear());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('getTasks() debería retornar array vacío al inicio', () => {
    expect(service.getTasks()).toEqual([]);
  });

  it('addTask() debería agregar una tarea a la lista', () => {
    service.addTask(makeTask('Tarea 1'));
    expect(service.getTasks().length).toBe(1);
  });

  it('addTask() debe agregar múltiples tareas', () => {
    service.addTask(makeTask('T1'));
    service.addTask(makeTask('T2'));
    service.addTask(makeTask('T3'));
    expect(service.getTasks().length).toBe(3);
  });

  it('completeTask() debe marcar la tarea como completada', () => {
    const task = makeTask('Completar');
    service.addTask(task);
    service.completeTask(task.id);
    expect(service.getTasks()[0].completed).toBeTrue();
  });

  it('deleteTask() debe eliminar la tarea de la lista', () => {
    const task = makeTask('Borrar');
    service.addTask(task);
    service.deleteTask(task.id);
    expect(service.getTasks().length).toBe(0);
  });

  it('getPendingCount() debe contar correctamente las tareas pendientes', () => {
    service.addTask(makeTask('P1'));
    service.addTask(makeTask('P2'));
    const t3 = makeTask('C1');
    service.addTask(t3);
    service.completeTask(t3.id);
    expect(service.getPendingCount()).toBe(2);
  });

  it('getCompletedCount() debe contar correctamente las tareas completadas', () => {
    const t1 = makeTask('T1');
    service.addTask(t1);
    service.completeTask(t1.id);
    expect(service.getCompletedCount()).toBe(1);
  });
});

// ─────────────────────────────────────────────
// 2.2 PRUEBA DE INTEGRACIÓN – TaskService + localStorage
// ─────────────────────────────────────────────
describe('TaskService – Prueba de Integración', () => {
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    localStorage.clear();
    authSpy = buildAuthSpy();
  });

  afterEach(() => localStorage.clear());

  it('addTask() debe persistir tarea en localStorage', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    const service = TestBed.inject(TaskService);
    service.addTask(makeTask('Persistida'));
    const raw = localStorage.getItem('tasks_testuser');
    expect(raw).not.toBeNull();
    const saved = JSON.parse(raw!);
    expect(saved.length).toBe(1);
    expect(saved[0].name).toBe('Persistida');
  });

  it('nueva instancia restaura tareas desde localStorage', () => {
    // Primera instancia: agrega tarea
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    const svc1 = TestBed.inject(TaskService);
    svc1.addTask(makeTask('Tarea persistida'));

    // Segunda instancia: debe leer localStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    const svc2 = TestBed.inject(TaskService);
    expect(svc2.getTasks().length).toBe(1);
    expect(svc2.getTasks()[0].name).toBe('Tarea persistida');
  });

  it('deleteTask() elimina del localStorage', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    const service = TestBed.inject(TaskService);
    const t = makeTask('Borrar');
    service.addTask(t);
    service.deleteTask(t.id);
    const raw = localStorage.getItem('tasks_testuser');
    const saved = JSON.parse(raw!);
    expect(saved.length).toBe(0);
  });

  it('completeTask() persiste el estado en localStorage', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    const service = TestBed.inject(TaskService);
    const t = makeTask('Completar');
    service.addTask(t);
    service.completeTask(t.id);
    const raw = localStorage.getItem('tasks_testuser');
    const saved = JSON.parse(raw!);
    expect(saved[0].completed).toBeTrue();
  });
});

// ─────────────────────────────────────────────
// 2.3 PRUEBA DE CAJA NEGRA – TaskService.filterByCategory
// ─────────────────────────────────────────────
describe('TaskService – Prueba de Caja Negra (filterByCategory)', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    const authSpy = buildAuthSpy();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    service = TestBed.inject(TaskService);
    service.addTask(makeTask('T-Personal', 'Personal'));
    service.addTask(makeTask('T-Trabajo',  'Trabajo'));
    service.addTask(makeTask('T-Estudio',  'Estudio'));
  });

  afterEach(() => localStorage.clear());

  it('[CB] "Todas" devuelve todas las tareas', () => {
    expect(service.filterByCategory('Todas').length).toBe(3);
  });

  it('[CB] filtro "Personal" devuelve solo tareas personales', () => {
    const result = service.filterByCategory('Personal');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('T-Personal');
  });

  it('[CB] filtro "Trabajo" devuelve solo tareas de trabajo', () => {
    const result = service.filterByCategory('Trabajo');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Trabajo');
  });

  it('[CB] filtro de categoría inexistente devuelve array vacío', () => {
    expect(service.filterByCategory('Deportes').length).toBe(0);
  });
});

// ─────────────────────────────────────────────
// 2.4 PRUEBA DE RENDIMIENTO – TaskService
// ─────────────────────────────────────────────
describe('TaskService – Prueba de Rendimiento', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    const authSpy = buildAuthSpy();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    service = TestBed.inject(TaskService);
  });

  afterEach(() => localStorage.clear());

  it('agregar 500 tareas debe completarse en menos de 3 segundos', () => {
    const start = performance.now();
    for (let i = 0; i < 500; i++) {
      service.addTask(makeTask(`Tarea ${i}`));
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  it('filterByCategory sobre 500 tareas debe completarse en menos de 200ms', () => {
    for (let i = 0; i < 500; i++) {
      const cat = i % 2 === 0 ? 'Personal' : 'Trabajo';
      service.addTask(makeTask(`Tarea ${i}`, cat));
    }
    const start = performance.now();
    service.filterByCategory('Personal');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it('getPendingCount sobre 1000 tareas debe completarse en menos de 100ms', () => {
    for (let i = 0; i < 1000; i++) {
      service.addTask(makeTask(`T${i}`));
    }
    const start = performance.now();
    service.getPendingCount();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });
});

// ─────────────────────────────────────────────
// 2.5 PRUEBA DE INTERFAZ – Task.model métodos públicos
// ─────────────────────────────────────────────
describe('Task Model – Prueba de Interfaz', () => {
  it('getPriorityIcon() devuelve 🔴 para alta', () => {
    const t = makeTask('T', 'Personal', 'alta');
    expect(t.getPriorityIcon()).toBe('🔴');
  });

  it('getPriorityIcon() devuelve 🟡 para media', () => {
    const t = makeTask('T', 'Personal', 'media');
    expect(t.getPriorityIcon()).toBe('🟡');
  });

  it('getPriorityIcon() devuelve 🟢 para baja', () => {
    const t = makeTask('T', 'Personal', 'baja');
    expect(t.getPriorityIcon()).toBe('🟢');
  });

  it('getPriorityText() devuelve texto correcto para alta', () => {
    const t = makeTask('T', 'Personal', 'alta');
    expect(t.getPriorityText()).toBe('Alta');
  });

  it('getPriorityClass() devuelve clase CSS para prioridad', () => {
    const t = makeTask('T', 'Personal', 'baja');
    expect(t.getPriorityClass()).toContain('baja');
  });

  it('complete() cambia completed a true', () => {
    const t = makeTask('T');
    expect(t.completed).toBeFalse();
    t.complete();
    expect(t.completed).toBeTrue();
  });

  it('getFormattedDate() devuelve cadena no vacía', () => {
    const t = makeTask('T');
    expect(t.getFormattedDate().length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// 2.6 PRUEBA DE CAMINO – TaskService.completeTask
// ─────────────────────────────────────────────
describe('TaskService – Prueba de Camino (completeTask)', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    const authSpy = buildAuthSpy();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authSpy }]
    });
    service = TestBed.inject(TaskService);
  });

  afterEach(() => localStorage.clear());

  // Camino 1: id existe → task.complete() se llama → localStorage actualizado
  it('[Camino 1] id existe → tarea marcada como completada', () => {
    const t = makeTask('Existente');
    service.addTask(t);
    service.completeTask(t.id);
    expect(service.getTasks()[0].completed).toBeTrue();
  });

  // Camino 2: id no existe → no lanza error, lista intacta
  it('[Camino 2] id inexistente → lista permanece igual', () => {
    const t = makeTask('Intacta');
    service.addTask(t);
    expect(() => service.completeTask('id-falso')).not.toThrow();
    expect(service.getTasks().length).toBe(1);
    expect(service.getTasks()[0].completed).toBeFalse();
  });

  // Camino 3: lista vacía → no lanza error
  it('[Camino 3] lista vacía → completeTask no lanza error', () => {
    expect(() => service.completeTask('cualquier-id')).not.toThrow();
  });
});
