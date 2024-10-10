import { defineStore } from 'pinia';
import { useState } from './state';
import actions from './actions';
import getters from './getters';

/**
 * @description ChildCares store
 * @returns {Object} - The childCares store
 * @returns {Object} - The state of the store
 * @returns {Object} - The actions of the store
 * @returns {Object} - The getters of the store
*/

export const useChildCaresStore = defineStore('childCares', {
    state: useState,
    actions,
    getters,
});