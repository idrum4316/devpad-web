class User {
    public id: string;
    public admin: boolean;

    constructor(id: string, admin: boolean) {
        this.id = id;
        this.admin = admin;
    }
}

export { User };