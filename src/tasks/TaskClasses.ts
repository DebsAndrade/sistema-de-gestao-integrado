import { BaseEntity } from "@models/BaseEntity";
import { ITask, TaskStatus } from "./ITask";

export class GenericTask extends BaseEntity implements ITask {
  public status: TaskStatus = TaskStatus.Pending;

  constructor(
    id: number,
    public title: string,
  ) {
    super(id);
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
    if (this.severity === "HIGH" && newStatus === TaskStatus.Completed) {
      console.warn("Bugs críticos precisam de revisão antes de fechar!");
      return;
    }
    super.updateStatus(newStatus);
  }
}
