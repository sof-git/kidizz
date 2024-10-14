import type { IChildCare } from '@/types/childCare'
import type { IChildCareState } from './state'
import AxiosInstance from '@/plugins/axios'

/**
 * @description Actions for childCares store
 * @param {Object} store - The store
 * @returns {Object} - The list of actions
 */

export default {
  async fetchAllChildCares(this: IChildCareState) {
    const response = await AxiosInstance.get('/child-care')
    const childCares: IChildCare[] = response.data
    this.childCares = childCares
    return childCares
  },

  async fetchChildCare(this: IChildCareState) {
    const response = await AxiosInstance.get('/child-care')
    const childCares: IChildCare[] = response.data
    this.childCares = childCares
  },

  async addChildCare(this: IChildCareState, childCare: any): Promise<any> {
    const response = await AxiosInstance.post('/child-care', childCare)
    const newChildCare = response.data
    this.childCares.push(newChildCare)
    return { status: response.status, child: newChildCare }
  },

  async deleteChildCare(this: IChildCareState, id: number) {
    const response = await AxiosInstance.delete(`/child-care/${id}`)
    this.childCares.splice(
      this.childCares.findIndex((childCare: IChildCare) => childCare.id === id),
      1
    )
    return response
  },

  async addChildren(this: IChildCareState, children: any) {
    const response = await AxiosInstance.post('/child', children)
    return response
  },

  async removeChild(this: IChildCareState, childId: number, childCareId: number) {
    const response = await AxiosInstance.put(`/child/child-care/${childCareId}/child/${childId}`)
    return response
  },

  async fetchChildsByChildCareId(this: IChildCareState, id: number) {
    const response = await AxiosInstance.get(`child/child-care/${id}/children`)
    const childs = response.data
    return childs
  },

  async fetchChildsForExport(this: IChildCareState, id?: number) {
    try {
      const url = id ? `child/children/export.csv?childCareId=${id}` : `child/children/export.csv`
      const response = await AxiosInstance.get(url, {
        responseType: 'blob' // Set response type to blob for binary data
      })

      // Check if the response is valid
      if (!response || !response.data) {
        throw new Error('No data received from the server.')
      }

      const exportCsv = response.data

      // Create a Blob from the CSV data
      const blob = new Blob([exportCsv], { type: 'text/csv' })

      // Create a link element
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'children_export.csv' // Set the file name for download

      // Append to the body and trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up and remove the link element
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error fetching children for export:', error)
      // Handle the error (e.g., show a notification to the user)
    }
  }
}
