export class Task {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  createdAt: Date;

  constructor(name: string, description: string, category: string,priority: 'alta' | 'media' | 'baja' = 'media') {
    this.id = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.completed = false;
    this.createdAt = new Date();
    
  }

  complete(): void {
    this.completed = true;
  }

  getFormattedDate(): string {
    return this.createdAt.toLocaleDateString('es-ES');
  }

  // NUEVO: Obtener ícono según prioridad
  getPriorityIcon(): string {
    switch(this.priority) {
      case 'alta': return '🔴';
      case 'media': return '🟡';
      case 'baja': return '🟢';
      default: return '⚪';
    }
  }

  // NUEVO: Obtener texto de prioridad
  getPriorityText(): string {
    switch(this.priority) {
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return '';
    }
  }

  // NUEVO: Obtener clase CSS para prioridad
  getPriorityClass(): string {
    return `priority-${this.priority}`;
  }
}