import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Map<string, Task[]> = new Map();

  constructor(private authService: AuthService) {
    this.loadFromLocalStorage();
  }

  private getStorageKey(): string {
    const user = this.authService.getCurrentUser();
    return `tasks_${user?.username || 'anonymous'}`;
  }

  private loadFromLocalStorage(): void {
    const key = this.getStorageKey();
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const tasksData = JSON.parse(stored);
      const tasks = tasksData.map((t: any) => {
        const task = new Task(t.name, t.description, t.category);
        task.id = t.id;
        task.completed = t.completed;
        task.createdAt = new Date(t.createdAt);
        return task;
      });
      this.tasks.set(key, tasks);
    } else {
      this.tasks.set(key, []);
    }
  }

  private saveToLocalStorage(): void {
    const key = this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(this.getTasks()));
  }

  getTasks(): Task[] {
    const key = this.getStorageKey();
    if (!this.tasks.has(key)) {
      this.tasks.set(key, []);
    }
    return this.tasks.get(key) || [];
  }

  addTask(task: Task): void {
    const key = this.getStorageKey();
    const currentTasks = this.tasks.get(key) || [];
    currentTasks.push(task);
    this.tasks.set(key, currentTasks);
    this.saveToLocalStorage();
  }

  completeTask(id: string): void {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.complete();
      this.saveToLocalStorage();
    }
  }

  deleteTask(id: string): void {
    const key = this.getStorageKey();
    const filtered = this.getTasks().filter(t => t.id !== id);
    this.tasks.set(key, filtered);
    this.saveToLocalStorage();
  }

  getPendingCount(): number {
    return this.getTasks().filter(t => !t.completed).length;
  }

  getCompletedCount(): number {
    return this.getTasks().filter(t => t.completed).length;
  }

  filterByCategory(category: string): Task[] {
    if (category === 'Todas') {
      return this.getTasks();
    }
    return this.getTasks().filter(t => t.category === category);
  }
}