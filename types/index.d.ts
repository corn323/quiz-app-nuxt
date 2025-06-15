export { }

declare global {
  // Import the types definitions
  interface Window {
    api: {
      trpc: (req: IpcRequest) => Promise<IpcResponse>
      addQuestion: (req: IpcRequest) => Promise<IpcResponse>
      getQuestions: () => Promise<IpcResponse>
      deleteQuestion: (req: IpcRequest) => Promise<IpcResponse>
      updateQuestion: (req: IpcRequest) => Promise<IpcResponse>
      getTags: () => Promise<IpcResponse>
    }
  }
}
