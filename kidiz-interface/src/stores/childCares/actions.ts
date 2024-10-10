import type { IChildCare } from "@/types/childCare";
import type { IChildCareState } from "./state";
import AxiosInstance  from "@/plugins/axios";

/**
 * @description Actions for childCares store
 * @param {Object} store - The store
 * @returns {Object} - The list of actions
 */

export default {

    async fetchAllChildCares(this:IChildCareState) {
        const response = await AxiosInstance.get('/child-care');
        const childCares:IChildCare[] = response.data;
        this.childCares = childCares;
        return childCares;
    },

    async fetchChildCare(this:IChildCareState) {
        const response = await AxiosInstance.get('/child-care');
        const childCares:IChildCare[] = response.data;
        this.childCares = childCares;
    },

    async addChildCare(this:IChildCareState, childCare:any):Promise<any> {
        const response = await AxiosInstance.post('/child-care', childCare);
        const newChildCare = response.data;
        this.childCares.push(newChildCare);
        return {status:response.status,child:newChildCare};
    },

    async deleteChildCare(this:IChildCareState, id:number) {
        const response = await AxiosInstance.delete(`/child-care/${id}`);
        if(response.status === 200) {
        const childCare = response.data;
        this.childCares.splice(this.childCares.findIndex((childCare:IChildCare) => childCare.id === id), 1);
        } else if (response.status === 401) {
            return {res:false,message:"Unauthorized"};
        }
    },

    async addChildren(this:IChildCareState, children:any) {
        const response = await AxiosInstance.post('/child', children);
        const child = response.data;
        return child;
    },

    async deleteChildren(this:IChildCareState, id:number) {
        const response = await AxiosInstance.delete(`/child/${id}`);
        const child = response.data;
        return response;
    },

    async fetchChildsByChildCareId(this:IChildCareState, id:number) {
        const response = await AxiosInstance.get(`child/child-care/${id}/children`);
        const childs = response.data;
        return childs;
    },

    async fetchChildsForExport(this:IChildCareState, id:number) {
        const response = await AxiosInstance.get(`/children/export`);
        const exportCsv = response.data;
        return exportCsv
    }
}