class AuthResponse {
    public token: string | null = null;
    public isAdmin: boolean = false;
    public username: string | null = null;
}

export { AuthResponse };