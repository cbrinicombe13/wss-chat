class UserService {
    users = [];

    addUser = ({ id, name, room }) => {
        const existingUser = this.users.find((user) => user.room === room && user.name === name);

        if (!name || !room) return { error: 'Username and room are required.' };
        if (existingUser) return { error: 'Username is taken.' };

        const user = { id, name, room };

        this.users.push(user);

        return { user };
    }

    removeUser = (id) => {
        const index = this.users.findIndex((user) => user.id === id);

        if (index !== -1) return this.users.splice(index, 1)[0];
    }

    getUser = (id) => this.users.find((user) => user.id === id);

    getUsersInRoom = (room) => {
        console.log(this.users);
        return this.users.filter((user) => user.room === room)
    };
}

module.exports = UserService;
