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
