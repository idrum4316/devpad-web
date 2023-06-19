import {defineStore} from 'pinia';
import {ref} from 'vue';
import {AuthResponse} from '@/Models/AuthResponse';
import {User} from "@/Models/User";


export const useSessionStore = defineStore('session', () => {

    // State

    const token = ref(null as string | null);
    const user = ref(null as User | null);

    // Actions

    async function authenticate(id: string, password: string): Promise<void> {

        const response = await fetch(`/auth/token`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: id,
                password: password
            })
        });

        const data = await response.json() as AuthResponse;

        // Seems unnecessary, but whatever...
        if (data.username == null)
        {
            throw Error('username is missing from response');
        }

        token.value = data.token;
        user.value = new User(data.username, data.isAdmin);
    }
});
