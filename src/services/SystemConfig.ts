export class SystemConfig {
  private static appName: string = 'MyApp';
  private static version: string = '1.0.0';
  private static environment: string = 'development';

  static setEnvironment(environment: string): void {
    SystemConfig.environment = environment;
  }

  static setVersion(version: string): void {
    SystemConfig.version = version;
  }

  static setAppName(name: string): void {
    SystemConfig.appName = name;
  }

  static getInfo(): { appName: string; version: string; environment: string } {
    return {
      appName: SystemConfig.appName,
      version: SystemConfig.version,
      environment: SystemConfig.environment,
    };
  }
}
