import { defineStore } from 'pinia'
import { useState } from './state'
import actions from './actions'
import getters from './getters'

/**
 * @description Users store
 * @returns {Object} - The users store
 * @returns {Object} - The state of the store
 * @returns {Object} - The actions of the store
 * @returns {Object} - The getters of the store
 */

export const useUsersStore = defineStore('users', {
  state: useState,
  actions,
  getters
})
