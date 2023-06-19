import {defineStore} from 'pinia';
import type {PageFormat} from "@/Models/PageFormat";
import type {Page} from "@/Models/Page";

export const usePageStore = defineStore({
    id: 'page',
    state: () => (new PageStoreState()),
    actions: {
        async fetchPage(id: string, format: PageFormat) : Promise<Page> {
            return await fetch(`/api/pages/${id}?format=${format}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    return res.json() as Promise<Page>;
                });
        }
    }
});
