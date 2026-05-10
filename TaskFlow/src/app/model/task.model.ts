export class Task {
  id: string;
  name: string;
  description: string;
  category: string;
  completed: boolean;
  createdAt: Date;

  constructor(name: string, description: string, category: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.category = category;
    this.completed = false;
    this.createdAt = new Date();
  }

  complete(): void {
    this.completed = true;
  }

  getFormattedDate(): string {
    return this.createdAt.toLocaleDateString('es-ES');
  }
}