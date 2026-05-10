import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filterCategory = 'Todas';
  categories = ['Todas', 'Personal', 'Trabajo', 'Estudio', 'Hogar', 'Otros'];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.filterByCategory(this.filterCategory);
  }

  onTaskAdded(task: Task): void {
    this.taskService.addTask(task);
    this.loadTasks();
  }

  onCompleteTask(id: string): void {
    this.taskService.completeTask(id);
    this.loadTasks();
  }

  onDeleteTask(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(id);
      this.loadTasks();
    }
  }

  onFilterChange(): void {
    this.loadTasks();
  }

  getPendingCount(): number {
    return this.taskService.getPendingCount();
  }

  getCompletedCount(): number {
    return this.taskService.getCompletedCount();
  }

  getTotalCount(): number {
    return this.tasks.length;
  }
}