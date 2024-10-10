import type { IChildCare } from "@/types/childCare";

/**
 * @description Getters for childCares store
 * @param {Object} state - The state of the store
 * @returns {Array} - The list of childCares
 */

export default {
    getChildCares(state: { childCares: IChildCare[]; }) {
        return state.childCares;
    }
};