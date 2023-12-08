
export class InfoMessageDto {
    title: string | null;
    content: string | null;

    constructor(title: string | null, content: string | null) {
        this.title = title;
        this.content = content;
    }
}