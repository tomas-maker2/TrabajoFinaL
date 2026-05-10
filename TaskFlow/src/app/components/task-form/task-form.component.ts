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

  onSubmit(): void {
    if (!this.name.trim()) {
      alert('El nombre de la tarea es obligatorio');
      return;
    }

    const newTask = new Task(this.name, this.description, this.category);
    this.taskAdded.emit(newTask);
    
    // Reset form
    this.name = '';
    this.description = '';
    this.category = 'Personal';
  }
}