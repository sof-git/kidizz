// authStore.ts
import { defineStore } from 'pinia';
import router from '@/router/index';
import axiosInstance from '@/plugins/axios';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: '',
  }),
  actions: {
    async login(username: string): Promise<any> {
      try {
        // Perform GET request to the '/users/:user' endpoint
        const res = await axiosInstance.get(`/users/${username}`);
        console.log(res);
        if(res.status === 404) {
          return { status: 404, message: 'User not found' };
        }
        // If the request is successful, set the user in the store and in local storage
        this.user = username;
        localStorage
          .setItem('user', username);
        // Redirect to the home page
        router.push('/');
        return res;
      } catch (error: any) {
        // If a 404 error occurs, return a specific message or throw the error
        if (error.response && error.response.status === 404) {
          return { status: 404, message: 'User not found' };
        }
        // For any other error, rethrow it so it can be handled elsewhere
        throw error;
      }
    },

    async register(username: string, email: string) {
      const user = {
        username: username,
        email: email,
      }
      const res = await axiosInstance.put('/users/user', user);
      localStorage.setItem('user', username);
      return res;
    },

    logout() {
      this.user = '';
      localStorage.removeItem('user');
      router.push('/');
    },
  },
});