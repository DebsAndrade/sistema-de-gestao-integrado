import { BaseEntity } from "@models/BaseEntity";
import { ITask } from "./ITask";
import { TaskStatus } from "./TaskStatus";

export class GenericTask extends BaseEntity implements ITask {
  public id: number;
  public status: TaskStatus = TaskStatus.CREATED;
  public completed: boolean = false;
  public categoria: "trabalho" | "pessoal" | "estudos" = "trabalho";
  public responsavelNome: string | undefined;
  public dataConclusao: Date | undefined;

  constructor(
    id: number,
    public title: string,
  ) {
    super(id);
    this.id = id;
  }

  getType(): string {
    return "GenericTask";
  }

  moveTo(status: TaskStatus): void {
    this.updateStatus(status);
  }

  toggleComplete(): void {
    this.completed = !this.completed;
    if (this.completed) {
      this.status = TaskStatus.COMPLETED;
      this.dataConclusao = new Date();
    } else {
      this.status = TaskStatus.IN_PROGRESS;
      this.dataConclusao = undefined;
    }
  }

  updateStatus(newStatus: TaskStatus): void {
    this.status = newStatus;
    console.log(`Tarefa ${this.id} mudou para ${newStatus}`);
  }
}

// Exercício 7: Polimorfismo (BugTask)
export class BugTask extends GenericTask {
  public severity: "LOW" | "HIGH";

  constructor(id: number, title: string, severity: "LOW" | "HIGH") {
    super(id, `[BUG] ${title}`); // Adiciona prefixo automaticamente
    this.severity = severity;
  }

  // Sobreposição de método: Bug só fecha se não for HIGH (exemplo de regra)
  updateStatus(newStatus: TaskStatus): void {
    if (this.severity === "HIGH" && newStatus === TaskStatus.COMPLETED) {
      console.warn("Bugs críticos precisam de revisão antes de fechar!");
      return;
    }
    super.updateStatus(newStatus);
  }
}
