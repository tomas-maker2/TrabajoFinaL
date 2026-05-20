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
