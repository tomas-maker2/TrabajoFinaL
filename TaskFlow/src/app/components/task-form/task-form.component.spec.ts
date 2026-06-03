import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { FormsModule } from '@angular/forms';
import { Task } from '../../model/task.model';

// ─────────────────────────────────────────────
// 2.1 PRUEBA DE COMPONENTES – TaskFormComponent
// ─────────────────────────────────────────────
describe('TaskFormComponent – Prueba de Componentes', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con prioridad "media" por defecto', () => {
    expect(component.priority).toBe('media');
  });

  it('debería inicializar con categoría "Personal" por defecto', () => {
    expect(component.category).toBe('Personal');
  });

  it('debería tener 5 categorías disponibles', () => {
    expect(component.categories.length).toBe(5);
  });

  it('debería tener 3 prioridades disponibles', () => {
    expect(component.priorities.length).toBe(3);
  });

  it('debería emitir taskAdded al enviar con nombre válido', () => {
    spyOn(component.taskAdded, 'emit');
    component.name = 'Tarea válida';
    component.description = 'Descripción';
    component.category = 'Trabajo';
    component.priority = 'alta';
    component.onSubmit();
    expect(component.taskAdded.emit).toHaveBeenCalled();
  });

  it('debería emitir una Task con los datos correctos', () => {
    let emittedTask: Task | undefined;
    component.taskAdded.subscribe((t: Task) => emittedTask = t);
    component.name = 'Mi tarea';
    component.description = 'Desc';
    component.category = 'Estudio';
    component.priority = 'baja';
    component.onSubmit();
    expect(emittedTask).toBeDefined();
    expect(emittedTask!.name).toBe('Mi tarea');
    expect(emittedTask!.priority).toBe('baja');
    expect(emittedTask!.category).toBe('Estudio');
  });

  it('debería resetear el formulario tras envío exitoso', () => {
    component.name = 'Tarea';
    component.description = 'Desc';
    component.priority = 'alta';
    component.onSubmit();
    expect(component.name).toBe('');
    expect(component.description).toBe('');
    expect(component.priority).toBe('media');
    expect(component.category).toBe('Personal');
  });

  it('no debería emitir si el nombre está vacío', () => {
    spyOn(component.taskAdded, 'emit');
    spyOn(window, 'alert');
    component.name = '   ';
    component.onSubmit();
    expect(component.taskAdded.emit).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// 2.3 PRUEBA DE CAJA NEGRA – TaskFormComponent
// ─────────────────────────────────────────────
describe('TaskFormComponent – Prueba de Caja Negra', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('[CB] nombre válido → emite tarea con id y fecha', () => {
    let emittedTask: Task | undefined;
    component.taskAdded.subscribe((t: Task) => emittedTask = t);
    component.name = 'Comprar leche';
    component.onSubmit();
    expect(emittedTask).toBeDefined();
    expect(emittedTask!.id).toBeTruthy();
    expect(emittedTask!.createdAt).toBeInstanceOf(Date);
  });

  it('[CB] nombre solo espacios → no emite', () => {
    spyOn(component.taskAdded, 'emit');
    spyOn(window, 'alert');
    component.name = '     ';
    component.onSubmit();
    expect(component.taskAdded.emit).not.toHaveBeenCalled();
  });

  it('[CB] prioridad alta → tarea emitida tiene priority="alta"', () => {
    let emittedTask: Task | undefined;
    component.taskAdded.subscribe((t: Task) => emittedTask = t);
    component.name = 'Urgente';
    component.priority = 'alta';
    component.onSubmit();
    expect(emittedTask!.priority).toBe('alta');
  });

  it('[CB] tarea emitida tiene completed=false', () => {
    let emittedTask: Task | undefined;
    component.taskAdded.subscribe((t: Task) => emittedTask = t);
    component.name = 'Nueva';
    component.onSubmit();
    expect(emittedTask!.completed).toBeFalse();
  });
});
