import { ITask } from '../tasks/ITask';
import { UserClass } from '../models/UserClass';
import { TaskStatus } from '../tasks/TaskStatus';

export class SearchService {
    /**
     * Pesquisa tarefas por título
     */
    searchByTitle(tasks: ITask[], text: string): ITask[] {
        if (!text || text.trim().length === 0) {
            return tasks;
        }

        const lowerText = text.toLowerCase();
        return tasks.filter(task => 
            task.title.toLowerCase().includes(lowerText)
        );
    }

    /**
     * Pesquisa tarefas por responsável
     */
    searchByUser(tasks: ITask[], userName: string): ITask[] {
        if (!userName || userName.trim().length === 0) {
            return tasks;
        }

        const lowerUserName = userName.toLowerCase();
        return tasks.filter(task => 
            task.responsavelNome?.toLowerCase().includes(lowerUserName)
        );
    }

    /**
     * Pesquisa tarefas por status
     */
    searchByStatus(tasks: ITask[], status: TaskStatus): ITask[] {
        return tasks.filter(task => task.status === status);
    }

    /**
     * Pesquisa tarefas por categoria
     */
    searchByCategory(
        tasks: ITask[], 
        categoria: 'trabalho' | 'pessoal' | 'estudos'
    ): ITask[] {
        return tasks.filter(task => task.categoria === categoria);
    }

    /**
     * Pesquisa tarefas por tipo
     */
    searchByType(tasks: ITask[], type: string): ITask[] {
        return tasks.filter(task => task.getType() === type);
    }

    /**
     * Pesquisa tarefas concluídas
     */
    searchCompleted(tasks: ITask[]): ITask[] {
        return tasks.filter(task => task.completed);
    }

    /**
     * Pesquisa tarefas pendentes
     */
    searchPending(tasks: ITask[]): ITask[] {
        return tasks.filter(task => !task.completed);
    }

    /**
     * Pesquisa tarefas concluídas em um período
     */
    searchCompletedInPeriod(tasks: ITask[], startDate: Date, endDate: Date): ITask[] {
        return tasks.filter(task => {
            if (!task.completed || !task.dataConclusao) return false;
            
            const conclusaoTime = task.dataConclusao.getTime();
            return conclusaoTime >= startDate.getTime() && 
                   conclusaoTime <= endDate.getTime();
        });
    }

    /**
     * Pesquisa global (procura em múltiplos campos)
     */
    globalSearch(tasks: ITask[], query: string): ITask[] {
        if (!query || query.trim().length === 0) {
            return tasks;
        }

        const lowerQuery = query.toLowerCase();
        const results = new Set<ITask>();

        // Pesquisar no título
        this.searchByTitle(tasks, query).forEach(task => results.add(task));

        // Pesquisar no responsável
        this.searchByUser(tasks, query).forEach(task => results.add(task));

        // Pesquisar na categoria
        tasks.filter(task => 
            task.categoria.toLowerCase().includes(lowerQuery)
        ).forEach(task => results.add(task));

        // Pesquisar no tipo
        tasks.filter(task => 
            task.getType().toLowerCase().includes(lowerQuery)
        ).forEach(task => results.add(task));

        return Array.from(results);
    }

    /**
     * Pesquisa utilizadores por nome
     */
    searchUsersByName(users: UserClass[], name: string): UserClass[] {
        if (!name || name.trim().length === 0) {
            return users;
        }

        const lowerName = name.toLowerCase();
        return users.filter(user => 
            user.nome.toLowerCase().includes(lowerName)
        );
    }

    /**
     * Pesquisa utilizadores por email
     */
    searchUsersByEmail(users: UserClass[], email: string): UserClass[] {
        if (!email || email.trim().length === 0) {
            return users;
        }

        const lowerEmail = email.toLowerCase();
        return users.filter(user => 
            user.email.toLowerCase().includes(lowerEmail)
        );
    }

    /**
     * Pesquisa utilizadores por role
     */
    searchUsersByRole(users: UserClass[], role: string): UserClass[] {
        return users.filter(user => user.role === role);
    }

    /**
     * Pesquisa utilizadores ativos
     */
    searchActiveUsers(users: UserClass[]): UserClass[] {
        return users.filter(user => user.isActive());
    }

    /**
     * Pesquisa utilizadores inativos
     */
    searchInactiveUsers(users: UserClass[]): UserClass[] {
        return users.filter(user => !user.isActive());
    }

    /**
     * Pesquisa global de utilizadores
     */
    globalSearchUsers(users: UserClass[], query: string): UserClass[] {
        if (!query || query.trim().length === 0) {
            return users;
        }

        const lowerQuery = query.toLowerCase();
        const results = new Set<UserClass>();

        // Pesquisar no nome
        this.searchUsersByName(users, query).forEach(user => results.add(user));

        // Pesquisar no email
        this.searchUsersByEmail(users, query).forEach(user => results.add(user));

        // Pesquisar no role
        users.filter(user => 
            user.role.toLowerCase().includes(lowerQuery)
        ).forEach(user => results.add(user));

        return Array.from(results);
    }

    /**
     * Pesquisa avançada de tarefas com múltiplos filtros
     */
    advancedSearchTasks(
        tasks: ITask[],
        filters: {
            title?: string;
            user?: string;
            status?: TaskStatus;
            categoria?: 'trabalho' | 'pessoal' | 'estudos';
            type?: string;
            completed?: boolean;
        }
    ): ITask[] {
        let results = [...tasks];

        if (filters.title) {
            results = this.searchByTitle(results, filters.title);
        }

        if (filters.user) {
            results = this.searchByUser(results, filters.user);
        }

        if (filters.status !== undefined) {
            results = this.searchByStatus(results, filters.status);
        }

        if (filters.categoria) {
            results = this.searchByCategory(results, filters.categoria);
        }

        if (filters.type) {
            results = this.searchByType(results, filters.type);
        }

        if (filters.completed !== undefined) {
            results = filters.completed 
                ? this.searchCompleted(results)
                : this.searchPending(results);
        }

        return results;
    }

    /**
     * Pesquisa avançada de utilizadores com múltiplos filtros
     */
    advancedSearchUsers(
        users: UserClass[],
        filters: {
            name?: string;
            email?: string;
            role?: string;
            active?: boolean;
        }
    ): UserClass[] {
        let results = [...users];

        if (filters.name) {
            results = this.searchUsersByName(results, filters.name);
        }

        if (filters.email) {
            results = this.searchUsersByEmail(results, filters.email);
        }

        if (filters.role) {
            results = this.searchUsersByRole(results, filters.role);
        }

        if (filters.active !== undefined) {
            results = filters.active 
                ? this.searchActiveUsers(results)
                : this.searchInactiveUsers(results);
        }

        return results;
    }

    /**
     * Ordena tarefas por título
     */
    sortByTitle(tasks: ITask[], ascending: boolean = true): ITask[] {
        return [...tasks].sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return ascending ? comparison : -comparison;
        });
    }

    /**
     * Ordena tarefas por data de criação
     */
    sortByCreationDate(tasks: ITask[], ascending: boolean = true): ITask[] {
        return [...tasks].sort((a, b) => {
            const comparison = a.id - b.id; // id é timestamp
            return ascending ? comparison : -comparison;
        });
    }

    /**
     * Ordena utilizadores por nome
     */
    sortUsersByName(users: UserClass[], ascending: boolean = true): UserClass[] {
        return [...users].sort((a, b) => {
            const comparison = a.nome.localeCompare(b.nome);
            return ascending ? comparison : -comparison;
        });
    }

    /**
     * Retorna estatísticas de pesquisa
     */
    getSearchStats(tasks: ITask[], users: UserClass[]) {
        return {
            totalTasks: tasks.length,
            completedTasks: this.searchCompleted(tasks).length,
            pendingTasks: this.searchPending(tasks).length,
            totalUsers: users.length,
            activeUsers: this.searchActiveUsers(users).length,
            inactiveUsers: this.searchInactiveUsers(users).length
        };
    }
}
