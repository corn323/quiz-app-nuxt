import { release } from 'os'
import path from 'path'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import ipcRequestHandler from '../server/trpc/ipcRequestHandler'
import { appRouter } from '../server/trpc/routers'
import type { IpcRequest } from '~/types/Ipc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

if (release().startsWith('6.1'))
  app.disableHardwareAcceleration()

if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, 'preload.js')
const distPath = path.join(__dirname, '../.output/public')

if (app.isPackaged) {
  const dbPath = 'questions.db';
  process.env.DATABASE_URL = `file:${dbPath}`
}

async function createWindow() {
  win = new BrowserWindow({
    minHeight: 900,
    minWidth: 1280,
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  if (app.isPackaged) {
    win.loadFile(path.join(distPath, 'index.html'));
  }
  else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL!)
    win.webContents.openDevTools()
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) allWindows[0].focus();
  else createWindow();
})

app.whenReady().then(() => {
  ipcMain.handle('trpc', (event, req: IpcRequest) => {
    return ipcRequestHandler({
      endpoint: '/trpc',
      req,
      router: appRouter,
    })
  })

  ipcMain.handle('addQuestion', async (event, req) => {
    let optionsData = "";
    try {
      const request = JSON.parse(req);
      let { question, options, answer, tags, isMath } = request;
      if (options) optionsData = JSON.stringify(options)
      await prisma.question.create({
        data: {
          question: question,
          options: optionsData,
          answer: answer.toString(),
          isMath: isMath,
          tags: JSON.stringify(tags)
        }
      })
      return 200
    } catch (error) {
      console.log("新增失敗:", error);
      return 404
    }
  });
  ipcMain.handle('getQuestions', async (event, req) => {
    try {
      const questions = await prisma.question.findMany();
      return questions;
    } catch (error) {
      console.log("取得失敗:", error);
      return 404
    }
  });

  ipcMain.handle('deleteQuestion', async (event, req) => {
    try {
      const request = JSON.parse(req);
      const { id } = request;
      await prisma.question.delete({
        where: {
          id: id
        }
      })
      return 200;
    } catch (error) {
      console.log("刪除失敗:", error);
      return 404
    }
  });

  ipcMain.handle('updateQuestion', async (event, req) => {
    let optionsData = "";
    try {
      const request = JSON.parse(req);
      let { id, question, options, answer, tags } = request;
      if (options) optionsData = JSON.stringify(options)
      await prisma.question.update({
        where: {
          id: id
        },
        data: {
          question: question,
          options: optionsData,
          answer: answer.toString(),
          tags: JSON.stringify(tags)
        }
      })
      return 200
    } catch (error) {
      console.log("更新失敗:", error);
      return 404
    }
  })

  ipcMain.handle('getTags', async (event, req) => {
    try {
      const tags = await prisma.question.findMany({
        select: {
          tags: true
        }
      });
      return tags;
    } catch (error) {
      console.log("取得失敗:", error);
      return 404
    }
  })

  createWindow()
})
