import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../model/task.model';


@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  
  name = '';
  description = '';
  category = 'Personal';
  
  categories = ['Personal', 'Trabajo', 'Estudio', 'Hogar', 'Otros'];
   priority: 'alta' | 'media' | 'baja' = 'media';

  priorities: { value: 'alta' | 'media' | 'baja', label: string, color: string }[] = [
    { value: 'alta', label: '🔴 Alta', color: '#dc3545' },
    { value: 'media', label: '🟡 Media', color: '#ffc107' },
    { value: 'baja', label: '🟢 Baja', color: '#28a745' }
  ];

  onSubmit(): void {
    if (!this.name.trim()) {
      alert('El nombre de la tarea es obligatorio');
      return;
    }

    const newTask = new Task(this.name, this.description, this.category,  this.priority);
    this.taskAdded.emit(newTask);
    
    // Reset form
    this.name = '';
    this.description = '';
    this.category = 'Personal';
    this.priority = 'media';
  }
}