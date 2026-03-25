export class GlobalValidators {
  static isValidEmail(email: string): boolean {
    const atIndex = email.indexOf("@");
    if (atIndex < 1 || atIndex !== email.lastIndexOf("@")) {
      return false;
    }
    const domainPart = email.slice(atIndex + 1);
    if (domainPart.length < 3 || !domainPart.includes(".")) {
      return false;
    }
    return true;
  }

  static isNonEmpty(text: string): boolean {
    return text.trim().length > 0;
  }

  static isPositiveNumber(value: number): boolean {
    return value > 0;
  }

  static minLength(text: string, size: number): boolean {
    return text.length >= size;
  }
}
