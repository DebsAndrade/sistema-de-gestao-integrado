export class Attachment {
    id: number;
    taskId: number;
    filename: string;
    size: number;
    url: string;
    mimeType?: string;
    uploadedAt: Date;
    uploadedBy: number;

    constructor(
        id: number,
        taskId: number,
        filename: string,
        size: number,
        url: string,
        uploadedBy: number,
        mimeType?: string
    ) {
        this.id = id;
        this.taskId = taskId;
        this.filename = filename;
        this.size = size;
        this.url = url;
        this.uploadedBy = uploadedBy;
        this.mimeType = mimeType;
        this.uploadedAt = new Date();
    }

    /**
     * Retorna o tamanho formatado (KB, MB, etc)
     */
    getFormattedSize(): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (this.size === 0) return '0 Bytes';
        
        const i = Math.floor(Math.log(this.size) / Math.log(1024));
        const size = (this.size / Math.pow(1024, i)).toFixed(2);
        
        return `${size} ${sizes[i]}`;
    }

    /**
     * Retorna a extensão do arquivo
     */
    getExtension(): string {
        const parts = this.filename.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    }

    /**
     * Verifica se é uma imagem
     */
    isImage(): boolean {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
        return imageExtensions.includes(this.getExtension());
    }

    /**
     * Verifica se é um documento
     */
    isDocument(): boolean {
        const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
        return docExtensions.includes(this.getExtension());
    }

    /**
     * Retorna informação formatada do anexo
     */
    toString(): string {
        return `${this.filename} (${this.getFormattedSize()}) - Enviado em ${this.uploadedAt.toLocaleString('pt-PT')}`;
    }
}
