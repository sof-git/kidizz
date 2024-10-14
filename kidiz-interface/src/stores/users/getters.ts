import type { IUser } from '@/types/user'

/**
 * @description Getters for users store
 * @param {Object} state - The state of the store
 * @returns {Array} - The list of users
 */

export default {
  getUsers(state: { users: IUser[] }) {
    return state.users
  },
  getUserById: (state: { users: IUser[] }) => (id: number) => {
    return state.users.find((user) => user.id === id)
  }
}
