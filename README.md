# TaskFlow – Trabajo Práctico Final

---

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

---

---

# Pruebas TaskFlow — Documentación completa

## Índice de tipos de prueba

| # | Tipo | Archivos involucrados |
|---|------|-----------------------|
| 2.1 | Prueba de Componentes | `login.component.spec.ts`, `task-form.component.spec.ts`, `task-list.component.spec.ts`, `auth.service.spec.ts`, `task.service.spec.ts` |
| 2.2 | Prueba de Integración | `auth.service.spec.ts`, `task.service.spec.ts` |
| 2.3 | Prueba de Caja Negra | `login.component.spec.ts`, `task-form.component.spec.ts`, `task.service.spec.ts` |
| 2.4 | Prueba de Rendimiento | `task.service.spec.ts` |
| 2.5 | Prueba de Interfaz | `task.service.spec.ts` (modelo `Task`) |
| 2.6 | Prueba de Camino | `login.component.spec.ts`, `task.service.spec.ts` |

---

## 2.1 Prueba de Componentes

Verifican que cada componente o servicio se inicializa y se comporta correctamente de forma aislada, con dependencias reemplazadas por spies (dobles de prueba).

### `LoginComponent – Prueba de Componentes` (`login.component.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| debería crearse correctamente | El componente se instancia sin errores. |
| debería inicializar username y password vacíos | Al crear el componente, `username` y `password` arrancan como cadena vacía. |
| debería inicializar errorMessage vacío | `errorMessage` arranca vacío (sin mensajes previos). |
| debería llamar a AuthService.login con las credenciales ingresadas | Al ejecutar `onLogin()`, llama al servicio con exactamente el usuario y contraseña que el usuario ingresó. |
| debería navegar a /tasks tras login exitoso | Cuando el servicio devuelve `true`, el Router navega a `/tasks`. |
| debería mostrar error con credenciales incorrectas | Cuando el servicio devuelve `false`, se asigna un `errorMessage` y **no** se navega. |
| debería alternar showPassword al llamar togglePassword() | Cada llamada a `togglePassword()` invierte el valor de `showPassword` (false → true → false). |

### `TaskFormComponent – Prueba de Componentes` (`task-form.component.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| debería crearse correctamente | El componente se instancia sin errores. |
| debería inicializar con prioridad "media" por defecto | `priority` arranca en `'media'`. |
| debería inicializar con categoría "Personal" por defecto | `category` arranca en `'Personal'`. |
| debería tener 5 categorías disponibles | El array `categories` tiene exactamente 5 opciones. |
| debería tener 3 prioridades disponibles | El array `priorities` tiene exactamente 3 opciones (alta, media, baja). |
| debería emitir taskAdded al enviar con nombre válido | Con un nombre válido, `onSubmit()` dispara el evento `taskAdded`. |
| debería emitir una Task con los datos correctos | La tarea emitida contiene el nombre, prioridad y categoría que se configuraron. |
| debería resetear el formulario tras envío exitoso | Después de un submit exitoso, `name`, `description`, `priority` y `category` vuelven a sus valores por defecto. |
| no debería emitir si el nombre está vacío | Con solo espacios en `name`, no se emite ninguna tarea. |

### `TaskListComponent – Prueba de Componentes` (`task-list.component.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| debería crearse correctamente | El componente se instancia sin errores usando un TaskService spy. |
| debería inicializar filterCategory en "Todas" | El filtro inicial muestra todas las categorías. |
| debería tener 6 categorías incluyendo "Todas" | El array `categories` tiene 6 opciones, siendo la primera `'Todas'`. |
| debería llamar a addTask y recargar al agregar tarea | `onTaskAdded()` delega en el servicio y recarga la lista. |
| debería llamar a completeTask al completar | `onCompleteTask(id)` llama a `taskService.completeTask` con el id correcto. |
| debería llamar a deleteTask al confirmar eliminación | Si `confirm()` retorna `true`, `onDeleteTask(id)` elimina la tarea. |
| no debería llamar deleteTask si no se confirma | Si `confirm()` retorna `false`, no se elimina nada. |
| debería retornar pendingCount del servicio | `getPendingCount()` delega correctamente en el servicio. |
| debería retornar completedCount del servicio | `getCompletedCount()` delega correctamente en el servicio. |

### `TaskListComponent – sortTasksByPriority` (`task-list.component.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| debería ordenar tareas: alta → media → baja | El método ordena correctamente por prioridad descendente. |
| debería devolver array vacío si no hay tareas | Con una lista vacía el resultado también es vacío. |

### `AuthService – Prueba de Componentes` (`auth.service.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| debería crearse correctamente | El servicio se instancia sin errores. |
| debería retornar true con credenciales correctas (admin/1234) | `login('admin', '1234')` retorna `true`. |
| debería retornar false con credenciales incorrectas | `login('admin', 'mal')` retorna `false`. |
| debería retornar false con usuario inexistente | Un usuario que no existe retorna `false`. |
| isLoggedIn() debería ser true tras login exitoso | Después de `login()` exitoso, `isLoggedIn()` retorna `true`. |
| isLoggedIn() debería ser false tras logout | Después de `logout()`, `isLoggedIn()` retorna `false`. |
| getCurrentUser() debería retornar el usuario logueado | Tras `login('juan', 'juan123')`, `getCurrentUser()` devuelve el objeto con `username: 'juan'` y `name: 'Juan Pérez'`. |
| getCurrentUser() debería ser null antes del login | Sin login previo, `getCurrentUser()` retorna `null`. |

### `TaskService – Prueba de Componentes` (`task.service.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| debería crearse correctamente | El servicio se instancia sin errores. |
| getTasks() debería retornar array vacío al inicio | Sin tareas previas, la lista está vacía. |
| addTask() debería agregar una tarea a la lista | Después de agregar una tarea, la lista tiene 1 elemento. |
| addTask() debe agregar múltiples tareas | Se pueden agregar varias tareas secuencialmente. |
| completeTask() debe marcar la tarea como completada | Tras `completeTask(id)`, la tarea tiene `completed: true`. |
| deleteTask() debe eliminar la tarea de la lista | Tras `deleteTask(id)`, la lista queda vacía. |
| getPendingCount() debe contar correctamente las tareas pendientes | Con 2 pendientes y 1 completada, retorna 2. |
| getCompletedCount() debe contar correctamente las tareas completadas | Con 1 completada, retorna 1. |

---

## 2.2 Prueba de Integración

Verifican que los servicios interactúan correctamente con el sistema real de almacenamiento (`localStorage`), probando el flujo completo entre capas.

### `AuthService – Prueba de Integración` (`auth.service.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| login exitoso debe persistir sesión en localStorage | Tras `login()`, `localStorage` contiene el objeto del usuario. |
| la contraseña NO debe guardarse en localStorage | El objeto guardado en `localStorage` no incluye la contraseña (seguridad). |
| logout debe eliminar la sesión de localStorage | Tras `logout()`, la clave `currentUser` desaparece del `localStorage`. |
| nueva instancia del servicio debe restaurar sesión desde localStorage | Simulando una recarga (nueva instancia de `TestBed`), el servicio recupera la sesión persistida. |

### `TaskService – Prueba de Integración` (`task.service.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| addTask() debe persistir tarea en localStorage | Al agregar una tarea, queda serializada en `localStorage` bajo la clave `tasks_testuser`. |
| nueva instancia restaura tareas desde localStorage | Una segunda instancia del servicio lee las tareas que persistió la primera. |
| deleteTask() elimina del localStorage | Al borrar una tarea, el array en `localStorage` se actualiza a vacío. |
| completeTask() persiste el estado en localStorage | Al completar una tarea, el campo `completed: true` queda guardado en `localStorage`. |

---

## 2.3 Prueba de Caja Negra

Se prueba el comportamiento externo del sistema solo desde entradas y salidas, sin conocer la implementación interna. Se usan **particiones de equivalencia** y **valores límite**.

### `LoginComponent – Prueba de Caja Negra` (`login.component.spec.ts`)

| Entrada | Comportamiento esperado | Test |
|---------|------------------------|------|
| Usuario y contraseña correctos | Redirige a `/tasks` | [CB] credenciales correctas → redirige a /tasks |
| Usuario correcto, contraseña incorrecta | Muestra `errorMessage`, no navega | [CB] contraseña incorrecta → muestra error, no navega |
| Ambos campos vacíos | No llama a `AuthService.login` | [CB] campos vacíos → no llama a AuthService.login |
| Solo username (sin password) | Muestra `errorMessage` | [CB] solo username sin password → muestra error |
| Solo password (sin username) | Muestra `errorMessage` | [CB] solo password sin username → muestra error |

### `TaskFormComponent – Prueba de Caja Negra` (`task-form.component.spec.ts`)

| Entrada | Comportamiento esperado | Test |
|---------|------------------------|------|
| Nombre de tarea válido | Emite tarea con `id` (UUID) y `createdAt` (Date) | [CB] nombre válido → emite tarea con id y fecha |
| Nombre con solo espacios | No emite ninguna tarea | [CB] nombre solo espacios → no emite |
| Prioridad seteada en "alta" | Tarea emitida tiene `priority: 'alta'` | [CB] prioridad alta → tarea emitida tiene priority="alta" |
| Cualquier nombre válido | Tarea emitida tiene `completed: false` | [CB] tarea emitida tiene completed=false |

### `TaskService – Prueba de Caja Negra (filterByCategory)` (`task.service.spec.ts`)

Cargadas 3 tareas (Personal, Trabajo, Estudio):

| Entrada | Comportamiento esperado | Test |
|---------|------------------------|------|
| `'Todas'` | Devuelve las 3 tareas | [CB] "Todas" devuelve todas las tareas |
| `'Personal'` | Devuelve solo la tarea Personal | [CB] filtro "Personal" devuelve solo tareas personales |
| `'Trabajo'` | Devuelve solo la tarea de Trabajo | [CB] filtro "Trabajo" devuelve solo tareas de trabajo |
| `'Deportes'` (inexistente) | Devuelve array vacío | [CB] filtro de categoría inexistente devuelve array vacío |

---

## 2.4 Prueba de Rendimiento

Miden el tiempo de ejecución de operaciones críticas bajo volumen de datos elevado, usando `performance.now()`.

### `AuthService – Prueba de Rendimiento` (`auth.service.spec.ts`)

| Test | Umbral | Qué mide |
|------|--------|---------|
| login debe completarse en menos de 50ms | < 50 ms | Tiempo de una llamada a `login()`. |
| isLoggedIn() debe completarse en menos de 10ms | < 10 ms | Tiempo de una consulta de sesión. |
| 100 llamadas a isLoggedIn() deben completarse en menos de 100ms | < 100 ms | Rendimiento acumulado de 100 verificaciones de sesión. |

### `TaskService – Prueba de Rendimiento` (`task.service.spec.ts`)

| Test | Umbral | Qué mide |
|------|--------|---------|
| agregar 500 tareas debe completarse en menos de 3 segundos | < 3000 ms | Tiempo total de 500 operaciones `addTask()` con persistencia en `localStorage`. |
| filterByCategory sobre 500 tareas debe completarse en menos de 200ms | < 200 ms | Tiempo de filtrar 500 tareas por categoría. |
| getPendingCount sobre 1000 tareas debe completarse en menos de 100ms | < 100 ms | Tiempo de contar tareas pendientes en una lista de 1000 elementos. |

---

## 2.5 Prueba de Interfaz

Verifican la interfaz pública del modelo `Task`: que sus métodos retornen los valores correctos según el estado del objeto.

### `Task Model – Prueba de Interfaz` (`task.service.spec.ts`)

| Test | Qué verifica |
|------|-------------|
| getPriorityIcon() devuelve 🔴 para alta | El ícono visual para prioridad alta es 🔴. |
| getPriorityIcon() devuelve 🟡 para media | El ícono visual para prioridad media es 🟡. |
| getPriorityIcon() devuelve 🟢 para baja | El ícono visual para prioridad baja es 🟢. |
| getPriorityText() devuelve texto correcto para alta | El texto legible para alta es `'Alta'`. |
| getPriorityClass() devuelve clase CSS para prioridad | La clase CSS retornada contiene la palabra `'baja'` (permite binding de estilos). |
| complete() cambia completed a true | Invocar `complete()` cambia el estado de la tarea de pendiente a completada. |
| getFormattedDate() devuelve cadena no vacía | La fecha de creación se puede representar como cadena de texto. |

---

## 2.6 Prueba de Camino

Aseguran que cada camino de ejecución (rama del código) es ejercitado al menos una vez. Se identifican los nodos de decisión del flujo de control.

### `LoginComponent – Prueba de Camino` (`login.component.spec.ts`)

Función analizada: `onLogin()`

```
onLogin()
  ├── [Camino 1] username o password vacío → setErrorMessage, return
  ├── [Camino 2] AuthService.login() = false → setErrorMessage
  └── [Camino 3] AuthService.login() = true → router.navigate('/tasks')
```

| Test | Camino cubierto |
|------|----------------|
| [Camino 1] campos vacíos → retorna sin llamar servicio | Guarda de validación: no se llega al servicio ni al router. |
| [Camino 2] credenciales incorrectas → errorMessage, sin navegación | El servicio rechaza las credenciales; se muestra error. |
| [Camino 3] credenciales correctas → navega a /tasks sin error | El servicio acepta las credenciales; se navega exitosamente. |

### `TaskService – Prueba de Camino (completeTask)` (`task.service.spec.ts`)

Función analizada: `completeTask(id)`

```
completeTask(id)
  ├── [Camino 1] tarea con ese id existe → task.complete(), saveToLocalStorage()
  ├── [Camino 2] id no encontrado → no hace nada (sin error)
  └── [Camino 3] lista vacía → no hace nada (sin error)
```

| Test | Camino cubierto |
|------|----------------|
| [Camino 1] id existe → tarea marcada como completada | El `find()` encuentra la tarea y llama a `complete()`. |
| [Camino 2] id inexistente → lista permanece igual | El `find()` retorna `undefined`; la lista no se modifica. |
| [Camino 3] lista vacía → completeTask no lanza error | Sin tareas en el array, la función termina sin errores. |

---

## Resumen de cobertura

| Tipo de prueba | Cantidad de tests |
|---------------|-------------------|
| 2.1 Componentes | 28 |
| 2.2 Integración | 8 |
| 2.3 Caja Negra | 13 |
| 2.4 Rendimiento | 6 |
| 2.5 Interfaz | 7 |
| 2.6 Camino | 6 |
| **TOTAL** | **68** *(+ 25 de servicios compartidos = **93** en suite completa)* |

---

---

# Ejecución de Pruebas — TaskFlow

## 3.1 Planificación y ejecución

### Entorno de ejecución

| Ítem | Detalle |
|------|---------|
| **Fecha de ejecución** | 26 de mayo de 2026 |
| **Framework de testing** | Karma v6.4.4 + Jasmine v5.1 |
| **Navegador** | Chrome Headless 148.0.0.0 (Windows 10) |
| **Angular CLI** | v18.1.3 |
| **Node.js** | v20.14.0 |
| **Comando ejecutado** | `npx ng test --no-watch --browsers=ChromeHeadless` |
| **Directorio** | `TrabajoFinaL/TaskFlow/` |

### Cómo ejecutar las pruebas

```bash
# Desde la raíz del proyecto Angular
cd TrabajoFinaL/TaskFlow

# Ejecutar todas las pruebas en modo headless (sin abrir ventana)
npx ng test --no-watch --browsers=ChromeHeadless

# Ejecutar en modo watch (re-ejecuta al guardar cambios)
npx ng test
```

---

## 3.2 Documentación de la ejecución

### Resultado global

```
TOTAL: 93 SUCCESS
Tiempo total: 2.051 secs  |  Tiempo de specs: 1.844 secs
```

> ✅ **93 pruebas ejecutadas — 93 exitosas — 0 fallidas**

---

### Detalle por suite de pruebas

#### 2.1 Prueba de Componentes

##### `AppComponent`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 1 | should create the app | ✅ PASSED |
| 2 | should have the 'TaskFlow' title | ✅ PASSED |

##### `HeaderComponent`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 3 | should create | ✅ PASSED |

##### `LoginComponent – Prueba de Componentes`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 4 | debería crearse correctamente | ✅ PASSED |
| 5 | debería inicializar username y password vacíos | ✅ PASSED |
| 6 | debería inicializar errorMessage vacío | ✅ PASSED |
| 7 | debería llamar a AuthService.login con las credenciales ingresadas | ✅ PASSED |
| 8 | debería navegar a /tasks tras login exitoso | ✅ PASSED |
| 9 | debería mostrar error con credenciales incorrectas | ✅ PASSED |
| 10 | debería alternar showPassword al llamar togglePassword() | ✅ PASSED |

##### `TaskFormComponent – Prueba de Componentes`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 11 | debería crearse correctamente | ✅ PASSED |
| 12 | debería inicializar con prioridad "media" por defecto | ✅ PASSED |
| 13 | debería inicializar con categoría "Personal" por defecto | ✅ PASSED |
| 14 | debería tener 5 categorías disponibles | ✅ PASSED |
| 15 | debería tener 3 prioridades disponibles | ✅ PASSED |
| 16 | debería emitir taskAdded al enviar con nombre válido | ✅ PASSED |
| 17 | debería emitir una Task con los datos correctos | ✅ PASSED |
| 18 | debería resetear el formulario tras envío exitoso | ✅ PASSED |
| 19 | no debería emitir si el nombre está vacío | ✅ PASSED |

##### `TaskListComponent – Prueba de Componentes`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 20 | debería crearse correctamente | ✅ PASSED |
| 21 | debería inicializar filterCategory en "Todas" | ✅ PASSED |
| 22 | debería tener 6 categorías incluyendo "Todas" | ✅ PASSED |
| 23 | debería llamar a addTask y recargar al agregar tarea | ✅ PASSED |
| 24 | debería llamar a completeTask al completar | ✅ PASSED |
| 25 | debería llamar a deleteTask al confirmar eliminación | ✅ PASSED |
| 26 | no debería llamar deleteTask si no se confirma | ✅ PASSED |
| 27 | debería retornar pendingCount del servicio | ✅ PASSED |
| 28 | debería retornar completedCount del servicio | ✅ PASSED |

##### `TaskListComponent – sortTasksByPriority`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 29 | debería ordenar tareas: alta → media → baja | ✅ PASSED |
| 30 | debería devolver array vacío si no hay tareas | ✅ PASSED |

##### `AuthService – Prueba de Componentes`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 31 | debería crearse correctamente | ✅ PASSED |
| 32 | debería retornar true con credenciales correctas (admin/1234) | ✅ PASSED |
| 33 | debería retornar false con credenciales incorrectas | ✅ PASSED |
| 34 | debería retornar false con usuario inexistente | ✅ PASSED |
| 35 | isLoggedIn() debería ser true tras login exitoso | ✅ PASSED |
| 36 | isLoggedIn() debería ser false tras logout | ✅ PASSED |
| 37 | getCurrentUser() debería retornar el usuario logueado | ✅ PASSED |
| 38 | getCurrentUser() debería ser null antes del login | ✅ PASSED |

##### `TaskService – Prueba de Componentes`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 39 | debería crearse correctamente | ✅ PASSED |
| 40 | getTasks() debería retornar array vacío al inicio | ✅ PASSED |
| 41 | addTask() debería agregar una tarea a la lista | ✅ PASSED |
| 42 | addTask() debe agregar múltiples tareas | ✅ PASSED |
| 43 | completeTask() debe marcar la tarea como completada | ✅ PASSED |
| 44 | deleteTask() debe eliminar la tarea de la lista | ✅ PASSED |
| 45 | getPendingCount() debe contar correctamente las tareas pendientes | ✅ PASSED |
| 46 | getCompletedCount() debe contar correctamente las tareas completadas | ✅ PASSED |

---

#### 2.2 Prueba de Integración

##### `AuthService – Prueba de Integración`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 47 | login exitoso debe persistir sesión en localStorage | ✅ PASSED |
| 48 | la contraseña NO debe guardarse en localStorage | ✅ PASSED |
| 49 | logout debe eliminar la sesión de localStorage | ✅ PASSED |
| 50 | nueva instancia del servicio debe restaurar sesión desde localStorage | ✅ PASSED |

##### `TaskService – Prueba de Integración`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 51 | addTask() debe persistir tarea en localStorage | ✅ PASSED |
| 52 | nueva instancia restaura tareas desde localStorage | ✅ PASSED |
| 53 | deleteTask() elimina del localStorage | ✅ PASSED |
| 54 | completeTask() persiste el estado en localStorage | ✅ PASSED |

---

#### 2.3 Prueba de Caja Negra

##### `LoginComponent – Prueba de Caja Negra`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 55 | [CB] credenciales correctas → redirige a /tasks | ✅ PASSED |
| 56 | [CB] contraseña incorrecta → muestra error, no navega | ✅ PASSED |
| 57 | [CB] campos vacíos → no llama a AuthService.login | ✅ PASSED |
| 58 | [CB] solo username sin password → muestra error | ✅ PASSED |
| 59 | [CB] solo password sin username → muestra error | ✅ PASSED |

##### `TaskFormComponent – Prueba de Caja Negra`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 60 | [CB] nombre válido → emite tarea con id y fecha | ✅ PASSED |
| 61 | [CB] nombre solo espacios → no emite | ✅ PASSED |
| 62 | [CB] prioridad alta → tarea emitida tiene priority="alta" | ✅ PASSED |
| 63 | [CB] tarea emitida tiene completed=false | ✅ PASSED |

##### `TaskService – Prueba de Caja Negra (filterByCategory)`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 64 | [CB] "Todas" devuelve todas las tareas | ✅ PASSED |
| 65 | [CB] filtro "Personal" devuelve solo tareas personales | ✅ PASSED |
| 66 | [CB] filtro "Trabajo" devuelve solo tareas de trabajo | ✅ PASSED |
| 67 | [CB] filtro de categoría inexistente devuelve array vacío | ✅ PASSED |

---

#### 2.4 Prueba de Rendimiento

##### `AuthService – Prueba de Rendimiento`
| # | Nombre del test | Umbral | Resultado |
|---|----------------|--------|-----------|
| 68 | login debe completarse en menos de 50ms | < 50 ms | ✅ PASSED |
| 69 | isLoggedIn() debe completarse en menos de 10ms | < 10 ms | ✅ PASSED |
| 70 | 100 llamadas a isLoggedIn() deben completarse en menos de 100ms | < 100 ms | ✅ PASSED |

##### `TaskService – Prueba de Rendimiento`
| # | Nombre del test | Umbral | Resultado |
|---|----------------|--------|-----------|
| 71 | agregar 500 tareas debe completarse en menos de 3 segundos | < 3000 ms | ✅ PASSED |
| 72 | filterByCategory sobre 500 tareas debe completarse en menos de 200ms | < 200 ms | ✅ PASSED |
| 73 | getPendingCount sobre 1000 tareas debe completarse en menos de 100ms | < 100 ms | ✅ PASSED |

> **Nota:** Los tests de rendimiento (especialmente #71 — 500 inserciones con persistencia en localStorage) presentaron mayor tiempo de ejecución, visible en la salida de Karma donde los tests 69–71 tardaron ~1.3 segundos acumulados. Todos se mantuvieron dentro de los umbrales definidos.

---

#### 2.5 Prueba de Interfaz

##### `Task Model – Prueba de Interfaz`
| # | Nombre del test | Resultado |
|---|----------------|-----------|
| 74 | getPriorityIcon() devuelve 🔴 para alta | ✅ PASSED |
| 75 | getPriorityIcon() devuelve 🟡 para media | ✅ PASSED |
| 76 | getPriorityIcon() devuelve 🟢 para baja | ✅ PASSED |
| 77 | getPriorityText() devuelve texto correcto para alta | ✅ PASSED |
| 78 | getPriorityClass() devuelve clase CSS para prioridad | ✅ PASSED |
| 79 | complete() cambia completed a true | ✅ PASSED |
| 80 | getFormattedDate() devuelve cadena no vacía | ✅ PASSED |

---

#### 2.6 Prueba de Camino

##### `LoginComponent – Prueba de Camino`
| # | Nombre del test | Camino | Resultado |
|---|----------------|--------|-----------|
| 81 | [Camino 1] campos vacíos → retorna sin llamar servicio | Guard de validación | ✅ PASSED |
| 82 | [Camino 2] credenciales incorrectas → errorMessage, sin navegación | Servicio retorna false | ✅ PASSED |
| 83 | [Camino 3] credenciales correctas → navega a /tasks sin error | Servicio retorna true | ✅ PASSED |

##### `TaskService – Prueba de Camino (completeTask)`
| # | Nombre del test | Camino | Resultado |
|---|----------------|--------|-----------|
| 84 | [Camino 1] id existe → tarea marcada como completada | find() exitoso | ✅ PASSED |
| 85 | [Camino 2] id inexistente → lista permanece igual | find() retorna undefined | ✅ PASSED |
| 86 | [Camino 3] lista vacía → completeTask no lanza error | Array vacío | ✅ PASSED |

---

### Métricas de ejecución

| Métrica | Valor |
|---------|-------|
| Total de pruebas ejecutadas | 93 |
| Pruebas exitosas | 93 |
| Pruebas fallidas | 0 |
| Pruebas omitidas | 0 |
| Tiempo total de ejecución | 2.051 segundos |
| Tiempo de ejecución de specs | 1.844 segundos |
| Navegador utilizado | Chrome Headless 148.0.0.0 |

### Resumen por tipo de prueba

| Tipo | Tests | Resultado |
|------|-------|-----------|
| 2.1 Prueba de Componentes | 46 | ✅ 46/46 |
| 2.2 Prueba de Integración | 8 | ✅ 8/8 |
| 2.3 Prueba de Caja Negra | 13 | ✅ 13/13 |
| 2.4 Prueba de Rendimiento | 6 | ✅ 6/6 |
| 2.5 Prueba de Interfaz | 7 | ✅ 7/7 |
| 2.6 Prueba de Camino | 6 | ✅ 6/6 |
| **TOTAL** | **93** | **✅ 93/93** |

---

### Salida del runner (extracto)

```
INFO [karma-server]: Karma v6.4.4 server started at http://localhost:9876/
INFO [launcher]: Starting browser ChromeHeadless
INFO [Chrome Headless 148.0.0.0 (Windows 10)]: Connected on socket ...

Chrome Headless 148.0.0.0 (Windows 10): Executed 93 of 93 SUCCESS (2.051 secs / 1.844 secs)
TOTAL: 93 SUCCESS
```
