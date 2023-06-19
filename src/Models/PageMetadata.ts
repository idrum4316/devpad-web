class PageMetadata {
    public title: string;
    public tags: string[];
    public modified: Date;

    constructor(title: string, tags: string[], modified: Date) {
        this.title = title;
        this.tags = tags;
        this.modified = modified;
    }
}

export { PageMetadata };