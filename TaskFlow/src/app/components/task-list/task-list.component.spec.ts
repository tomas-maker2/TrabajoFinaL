import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

function makeTask(name: string, priority: 'alta' | 'media' | 'baja' = 'media'): Task {
  return new Task(name, '', 'Personal', priority);
}

// ─────────────────────────────────────────────
// 2.1 PRUEBA DE COMPONENTES – TaskListComponent
// ─────────────────────────────────────────────
describe('TaskListComponent – Prueba de Componentes', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks', 'addTask', 'completeTask', 'deleteTask',
      'getPendingCount', 'getCompletedCount', 'filterByCategory'
    ]);
    taskServiceSpy.filterByCategory.and.returnValue([]);
    taskServiceSpy.getPendingCount.and.returnValue(0);
    taskServiceSpy.getCompletedCount.and.returnValue(0);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar filterCategory en "Todas"', () => {
    expect(component.filterCategory).toBe('Todas');
  });

  it('debería tener 6 categorías incluyendo "Todas"', () => {
    expect(component.categories.length).toBe(6);
    expect(component.categories[0]).toBe('Todas');
  });

  it('debería llamar a addTask y recargar al agregar tarea', () => {
    const task = makeTask('Nueva');
    component.onTaskAdded(task);
    expect(taskServiceSpy.addTask).toHaveBeenCalledWith(task);
    expect(taskServiceSpy.filterByCategory).toHaveBeenCalled();
  });

  it('debería llamar a completeTask al completar', () => {
    component.onCompleteTask('id-123');
    expect(taskServiceSpy.completeTask).toHaveBeenCalledWith('id-123');
  });

  it('debería llamar a deleteTask al confirmar eliminación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.onDeleteTask('id-456');
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('id-456');
  });

  it('no debería llamar deleteTask si no se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDeleteTask('id-789');
    expect(taskServiceSpy.deleteTask).not.toHaveBeenCalled();
  });

  it('debería retornar pendingCount del servicio', () => {
    taskServiceSpy.getPendingCount.and.returnValue(3);
    expect(component.getPendingCount()).toBe(3);
  });

  it('debería retornar completedCount del servicio', () => {
    taskServiceSpy.getCompletedCount.and.returnValue(2);
    expect(component.getCompletedCount()).toBe(2);
  });
});

// ─────────────────────────────────────────────
// 2.1 PRUEBA DE COMPONENTES – sortTasksByPriority
// ─────────────────────────────────────────────
describe('TaskListComponent – sortTasksByPriority', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'filterByCategory', 'getPendingCount', 'getCompletedCount'
    ]);
    taskServiceSpy.filterByCategory.and.returnValue([]);
    taskServiceSpy.getPendingCount.and.returnValue(0);
    taskServiceSpy.getCompletedCount.and.returnValue(0);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ordenar tareas: alta → media → baja', () => {
    const tasks = [
      makeTask('Baja', 'baja'),
      makeTask('Alta', 'alta'),
      makeTask('Media', 'media')
    ];
    const sorted = component.sortTasksByPriority(tasks);
    expect(sorted[0].priority).toBe('alta');
    expect(sorted[1].priority).toBe('media');
    expect(sorted[2].priority).toBe('baja');
  });

  it('debería devolver array vacío si no hay tareas', () => {
    expect(component.sortTasksByPriority([])).toEqual([]);
  });
});
