import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRequest } from '~/types/Ipc'

contextBridge.exposeInMainWorld('api', {
  trpc: (req: IpcRequest) => ipcRenderer.invoke('trpc', req),
  addQuestion: (req: IpcRequest) => ipcRenderer.invoke('addQuestion', req),
  getQuestions: (req: IpcRequest) => ipcRenderer.invoke('getQuestions'),
  deleteQuestion: (req: IpcRequest) => ipcRenderer.invoke('deleteQuestion', req),
  updateQuestion: (req: IpcRequest) => ipcRenderer.invoke('updateQuestion', req),
  getTags: (req: IpcRequest) => ipcRenderer.invoke('getTags')
})