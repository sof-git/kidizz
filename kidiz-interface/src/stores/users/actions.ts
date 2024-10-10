import type { IUser } from '@/types/user';
import type { IUserState } from './state';
import axios from 'axios';
/**
 * @description Actions for users store
 * @param {Object} store - The store
 * @returns {Object} - The list of actions
 */

export default {
    async fetchUser(this:IUserState) {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const users:IUser[] = response.data;
        this.users = users;
    },
    async addUser(this:IUserState, user:any):Promise<any> {
        const response = await axios.post('users/user', user);
        const newUser = response.data;
        this.users.push(newUser);
        return {res:true,message:"User added successfully"};
    },
}