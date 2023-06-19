import type {PageMetadata} from "@/Models/PageMetadata";

class Page {
    public contents: string;
    public metadata: PageMetadata;

    constructor(contents: string, metadata: PageMetadata) {
        this.contents = contents;
        this.metadata = metadata;
    }
}

export { Page };