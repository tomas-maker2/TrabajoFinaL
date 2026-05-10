# TaskFlow – Descriptivo del Software

---

## 1. Objetivo del Software

**TaskFlow** es una aplicación web de gestión de tareas personales desarrollada con **Angular**. Su objetivo es permitir a múltiples usuarios autenticados crear, organizar, priorizar y hacer seguimiento de sus tareas diarias de forma sencilla e intuitiva.

Cada usuario dispone de un espacio privado donde sus tareas se almacenan de forma persistente en el navegador mediante `localStorage`, garantizando que la información se mantenga entre sesiones y esté aislada por usuario.

---

## 2. Requerimientos Implementados

### 2.1 Requerimientos Funcionales

| ID | Requerimiento | Implementación |
|----|--------------|----------------|
| RF-01 | El sistema debe permitir el inicio de sesión con usuario y contraseña | `LoginComponent` + `AuthService.login()` |
| RF-02 | El sistema debe impedir el acceso a las rutas protegidas sin autenticación | `AuthGuard` sobre la ruta `/tasks` |
| RF-03 | El usuario autenticado debe poder cerrar sesión | `HeaderComponent` + `AuthService.logout()` |
| RF-04 | El usuario debe poder crear nuevas tareas con nombre, descripción, categoría y prioridad | `TaskFormComponent` + `TaskService.addTask()` |
| RF-05 | El nombre de la tarea debe ser obligatorio al momento de crearla | Validación en `TaskFormComponent.onSubmit()` |
| RF-06 | El usuario debe poder marcar una tarea como completada | `TaskListComponent` + `TaskService.completeTask()` |
| RF-07 | El usuario debe poder eliminar una tarea | `TaskListComponent` + `TaskService.deleteTask()` |
| RF-08 | El sistema debe mostrar estadísticas: total, pendientes y completadas | `TaskListComponent` + `TaskService.getPendingCount()` / `getCompletedCount()` |
| RF-09 | El usuario debe poder filtrar tareas por categoría | `TaskService.filterByCategory()` |
| RF-10 | Cada usuario debe ver únicamente sus propias tareas | Aislamiento por clave `tasks_${username}` en `localStorage` |
| RF-11 | La sesión del usuario debe persistir ante recargas del navegador | `AuthService.loadFromLocalStorage()` |
| RF-12 | El sistema debe soportar múltiples usuarios registrados | Lista de usuarios en `AuthService` (admin, alumno, juan, maria) |

### 2.2 Requerimientos No Funcionales

| ID | Requerimiento | Implementación |
|----|--------------|----------------|
| RNF-01 | La interfaz debe estar en idioma español | Toda la UI está en español; fechas formateadas en `es-ES` |
| RNF-02 | La aplicación debe ser una SPA (Single Page Application) | Implementado con Angular Router sin recargas de página |
| RNF-03 | Los datos deben persistir sin necesidad de backend | Uso de `localStorage` para tareas y sesión |
| RNF-04 | La aplicación debe ser responsiva y de uso intuitivo | CSS por componente, indicadores visuales de prioridad con colores y emojis |
| RNF-05 | El tipo del campo `priority` debe estar fuertemente tipado | Tipo `'alta' | 'media' | 'baja'` en modelo y componente |
| RNF-06 | La arquitectura debe separar responsabilidades en capas | Capas: Componentes / Servicios / Modelos / Guards |
| RNF-07 | Las contraseñas no deben persistirse en almacenamiento local | `localStorage` solo guarda `username` y `name`, no la contraseña |

---

## 3. Artefactos UML

### 3.1 Diagrama de Casos de Uso

```
                        ┌─────────────────────────────────────────┐
                        │              Sistema TaskFlow            │
                        │                                          │
  ┌──────────┐          │  ┌────────────────────┐                 │
  │          │          │  │  Iniciar Sesión     │                 │
  │ Usuario  │─────────►│  └────────────────────┘                 │
  │  No      │          │                                          │
  │  Auth.   │          │  ┌────────────────────┐                 │
  └──────────┘          │  │  Cerrar Sesión      │◄────────────┐  │
                        │  └────────────────────┘             │  │
                        │                                      │  │
  ┌──────────┐          │  ┌────────────────────┐             │  │
  │          │──────────►  │  Crear Tarea        │             │  │
  │ Usuario  │          │  └────────────────────┘             │  │
  │  Auth.   │──────────►  ┌────────────────────┐             │  │
  │          │          │  │  Completar Tarea    │             │  │
  │          │──────────►  └────────────────────┘             │  │
  │          │          │  ┌────────────────────┐             │  │
  │          │──────────►  │  Eliminar Tarea     │             │  │
  │          │          │  └────────────────────┘             │  │
  │          │──────────►  ┌────────────────────┐             │  │
  │          │          │  │  Filtrar por Cat.   │             │  │
  │          │──────────►  └────────────────────┘             │  │
  └──────────┘          │  ┌────────────────────┐             │  │
       │                │  │  Ver Estadísticas   │             │  │
       └────────────────►  └────────────────────┘             │  │
                        │                                      │  │
                        │  ┌────────────────────┐             │  │
                        │  │  Cerrar Sesión      │─────────────┘  │
                        │  └────────────────────┘                 │
                        └─────────────────────────────────────────┘
```

---

### 3.2 Diagrama de Clases

```
┌──────────────────────────────┐
│           <<Model>>          │
│             User             │
├──────────────────────────────┤
│ + username: string           │
│ + password: string           │
│ + name: string               │
└──────────────────────────────┘

┌──────────────────────────────────────────────┐
│                  <<Model>>                   │
│                    Task                      │
├──────────────────────────────────────────────┤
│ + id: string                                 │
│ + name: string                               │
│ + description: string                        │
│ + category: string                           │
│ + priority: 'alta' | 'media' | 'baja'        │
│ + completed: boolean                         │
│ + createdAt: Date                            │
├──────────────────────────────────────────────┤
│ + complete(): void                           │
│ + getFormattedDate(): string                 │
│ + getPriorityIcon(): string                  │
│ + getPriorityText(): string                  │
│ + getPriorityClass(): string                 │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│               <<Service>>                    │
│               AuthService                   │
├──────────────────────────────────────────────┤
│ - users: User[]                              │
│ - currentUser: User | null                   │
├──────────────────────────────────────────────┤
│ + login(username, password): boolean         │
│ + logout(): void                             │
│ + isLoggedIn(): boolean                      │
│ + getCurrentUser(): User | null              │
│ - loadFromLocalStorage(): void               │
└──────────────────────────┬───────────────────┘
                           │ usa
                           ▼
                    ┌─────────────┐
                    │    User     │
                    └─────────────┘

┌──────────────────────────────────────────────┐
│               <<Service>>                    │
│               TaskService                   │
├──────────────────────────────────────────────┤
│ - tasks: Map<string, Task[]>                 │
├──────────────────────────────────────────────┤
│ + getTasks(): Task[]                         │
│ + addTask(task: Task): void                  │
│ + completeTask(id: string): void             │
│ + deleteTask(id: string): void               │
│ + getPendingCount(): number                  │
│ + getCompletedCount(): number                │
│ + filterByCategory(category): Task[]         │
│ - getStorageKey(): string                    │
│ - loadFromLocalStorage(): void               │
│ - saveToLocalStorage(): void                 │
└──────────────────────────┬───────────────────┘
                           │ usa
                           ▼
                    ┌─────────────┐
                    │    Task     │
                    └─────────────┘

┌─────────────────────────┐        ┌──────────────────────────┐
│    <<Component>>        │        │      <<Component>>        │
│    LoginComponent       │        │    HeaderComponent        │
├─────────────────────────┤        ├──────────────────────────┤
│ - username: string      │        │                          │
│ - password: string      │        ├──────────────────────────┤
│ - showPassword: boolean │        │ + logout(): void         │
│ - errorMessage: string  │        └──────────────────────────┘
├─────────────────────────┤
│ + onLogin(): void       │
│ + togglePassword(): void│
└─────────────────────────┘

┌─────────────────────────────────────┐
│           <<Component>>             │
│          TaskListComponent          │
├─────────────────────────────────────┤
│ - tasks: Task[]                     │
│ - selectedCategory: string          │
├─────────────────────────────────────┤
│ + onTaskAdded(task: Task): void     │
│ + onComplete(id: string): void      │
│ + onDelete(id: string): void        │
│ + onFilterChange(cat: string): void │
└──────────────┬──────────────────────┘
               │ contiene
               ▼
┌─────────────────────────────────────┐
│           <<Component>>             │
│          TaskFormComponent          │
├─────────────────────────────────────┤
│ - name: string                      │
│ - description: string               │
│ - category: string                  │
│ - priority: 'alta'|'media'|'baja'   │
│ @Output() taskAdded: EventEmitter   │
├─────────────────────────────────────┤
│ + onSubmit(): void                  │
└─────────────────────────────────────┘

┌──────────────────────────┐
│        <<Guard>>         │
│        AuthGuard         │
├──────────────────────────┤
│ + canActivate(): boolean │
└──────────────────────────┘
```

---

### 3.3 Diagrama de Secuencia – Inicio de Sesión

```
Usuario       LoginComponent      AuthService        Router
  │                  │                 │                │
  │── ingresa ───────►                 │                │
  │   credenciales   │                 │                │
  │                  │── login() ─────►│                │
  │                  │                 │                │
  │                  │  (verifica      │                │
  │                  │   usuarios[])   │                │
  │                  │                 │                │
  │                  │◄── true/false ──│                │
  │                  │                 │                │
  │           [Si válido]              │                │
  │                  │── navigate() ──────────────────►│
  │                  │   '/tasks'      │                │
  │◄─ muestra ───────────────────────────────────────── │
  │   TaskList       │                 │                │
  │                  │                 │                │
  │           [Si inválido]            │                │
  │◄── errorMessage ─│                 │                │
```

---

### 3.4 Diagrama de Secuencia – Crear Tarea

```
Usuario     TaskFormComponent    TaskListComponent     TaskService     localStorage
  │                │                    │                   │               │
  │── completa ───►│                    │                   │               │
  │   formulario   │                    │                   │               │
  │                │                    │                   │               │
  │── submit ─────►│                    │                   │               │
  │                │ (valida nombre)    │                   │               │
  │                │── emit taskAdded ─►│                   │               │
  │                │   (Task obj)       │                   │               │
  │                │                    │── addTask(task) ──►               │
  │                │                    │                   │── save() ────►│
  │                │                    │                   │   (JSON)      │
  │◄── lista ──────────────────────────│                   │               │
  │    actualizada │                    │                   │               │
```

---

### 3.5 Diagrama de Secuencia – Autenticación y Acceso Protegido

```
Usuario         Router         AuthGuard        AuthService     TaskListComponent
  │                │               │                  │                │
  │── navega a ───►│               │                  │                │
  │   '/tasks'     │               │                  │                │
  │                │── canActivate►│                  │                │
  │                │               │── isLoggedIn() ─►│                │
  │                │               │◄── true/false ───│                │
  │                │               │                  │                │
  │          [No autenticado]      │                  │                │
  │                │◄── redirect ──│                  │                │
  │                │   '/login'    │                  │                │
  │                │               │                  │                │
  │          [Autenticado]         │                  │                │
  │                │◄── true ──────│                  │                │
  │                │─────────────────────────────────────────────────►│
  │◄── muestra ────────────────────────────────────────────────────── │
  │    dashboard   │               │                  │                │
```

---

*Documento generado para el Trabajo Práctico Final – Programación 3*
