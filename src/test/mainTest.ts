import { SystemConfig } from "@services/SystemConfig";
import { IdGenerator } from "@utils/IdGenerator";
import { SystemLogger } from "../logs/SystemLogger";
import { GlobalValidators } from "@utils/GlobalValidators";
import { BusinessRules } from "@services/BusinessRules";

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

  // Imprimir resultados
  console.log("System Config Info:", SystemConfig.getInfo());
  console.log("Generated User ID:", userId);
  console.log("Generated Task ID:", taskId);
  console.log(`Is email "${email}" valid?`, isEmailValid);
  console.log(`Can complete task ${taskId}?`, canCompleteTask);
  console.log("System Logs:", SystemLogger.getLogs());
}
