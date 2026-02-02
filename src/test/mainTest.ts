import { SystemConfig } from "@services/SystemConfig";
import { IdGenerator } from "@utils/IdGenerator";
import { SystemLogger } from "../logs/SystemLogger";
import { GlobalValidators } from "@utils/GlobalValidators";
import { BusinessRules } from "@services/BusinessRules";
import { EntityList } from "@utils/EntityList";
import { SimpleCache } from "@utils/SimpleCache";
import { Favorites } from "@utils/Favorites";
import { Paginator } from "@utils/Paginator";
import { WatcherSystem } from "@utils/WatcherSystem";
import { PriorityManager } from "@utils/PriorityManager";
import { RatingSystem } from "@utils/RatingSystem";
import { DependencyGraph } from "@utils/DependencyGraph"

export function mainTest() {
  // Configurar sistema
  SystemConfig.setEnvironment("Production");

  // Gerar IDs
  const userId = IdGenerator.generate();
  const taskId = IdGenerator.generate();

  // Validar dados
  const email = "user@example.com";
  const isEmailValid = GlobalValidators.isValidEmail(email);

  // Aplicar regras de negócio
  const canCompleteTask = BusinessRules.canTaskBeCompleted(true);

  // Registar logs
  SystemLogger.log(`User ID: ${userId}, Task ID: ${taskId}`);
  SystemLogger.log(`Email validation for ${email}: ${isEmailValid}`);
  SystemLogger.log(`Can complete task ${taskId}: ${canCompleteTask}`);

  // Testar EntityList genérica
  const userList = new EntityList<{ id: number; name: string }>();
  userList.add({ id: 1, name: "Natália" });
  userList.add({ id: 2, name: "Rebeca" });

  const taskList = new EntityList<{ id: number; title: string }>();
  taskList.add({ id: 101, title: "Task One" });

  // Cache simples
  const userCache = new SimpleCache<number, { id: number; name: string; }>();
  userCache.set(1, { id: 1, name: "Gabriella" });
  userCache.set(2, { id: 2, name: "Daniel" });

  const taskCache = new SimpleCache<number, { id: number; title: string }>();
  taskCache.set(10, { id: 10, title: "Task One" });
  taskCache.set(20, { id: 20, title: "Task Two" });

  // Favotires test
  const favUsers = new Favorites<{ id: number; name: string }>();
  const user1 = { id: 1, name: "Taís" };
  const user2 = { id: 2, name: "Daniel" };
  favUsers.add(user1);
  favUsers.add(user2);
  favUsers.remove(user1);

  const favTasks = new Favorites<{ id: number; title: string }>();
  const task1 = { id: 101, title: "Task One" };
  favTasks.add(task1);

  // Pagination test
  const paginator = new Paginator();
  const page1 = paginator.paginate(userList.getAll(), 1, 2);
  const page2 = paginator.paginate(userList.getAll(), 2, 2);

  // WatcherSystem
  const watcherSystem = new WatcherSystem();
  watcherSystem.watch(task1, user1);
  watcherSystem.watch(task1, user2);

  // PriorityManager
  const priorityManager = new PriorityManager();
  priorityManager.setPriority(task1, 5);

  // RatingSystem
  const ratingSystem = new RatingSystem();
  ratingSystem.rate(task1, 5);
  ratingSystem.rate(task1, 3);

  // DependencyGraph
  const depGraph = new DependencyGraph();
  depGraph.addDependency(task1);

  // Imprimir resultados
  console.log("System Config Info:", SystemConfig.getInfo());
  console.log("Generated User ID:", userId);
  console.log("Generated Task ID:", taskId);
  console.log(`Is email "${email}" valid?`, isEmailValid);
  console.log(`Can complete task ${taskId}?`, canCompleteTask);
  console.log("System Logs:", SystemLogger.getLogs());
  console.log(userList.getAll());
  console.log(taskList.getAll());
  console.log(userCache.get(1));
  console.log(userCache.get(2));
  console.log(taskCache.get(10));
  console.log(taskCache.get(20));
  console.log(favUsers.getAll());
  console.log(favTasks.exists(task1));
  console.log("Aqui está a page 1: ", page1);
  console.log("Aqui está a page 2: ", page2);
  console.log("Watcher", watcherSystem.getWatchers(task1));
  console.log(priorityManager.getPriority(task1));
  console.log(ratingSystem.getAverage(task1));
  console.log(depGraph.getDependencies(task1));
}
