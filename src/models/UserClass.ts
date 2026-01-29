import { BaseEntity } from '@models/BaseEntity';
import { UserRoles } from '@security/UserRoles';

export class UserClass extends BaseEntity {
    private _email: string; // Privado para ninguém mexer direto
    public nome: string;
    public role: UserRoles;
    private active: boolean = true;

    constructor(id: number, nome: string, email: string, role: UserRoles = UserRoles.MEMBER) {
        super(id); // Chama o construtor do Pai (BaseEntity)
        this.nome = nome;
        this._email = this.validateEmail(email);
        this.role = role;
    }

    // Exercício 3: Validação centralizada
    private validateEmail(email: string): string {
        if (!email.includes('@')) throw new Error("Email inválido");
        return email;
    }

    get email(): string { return this._email; }
    
    set email(novoEmail: string) {
        this._email = this.validateEmail(novoEmail);
    }

    isActive(): boolean { return this.active; }
    toggleStatus(): void { this.active = !this.active; }
}
