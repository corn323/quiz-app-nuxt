import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (event.method === 'POST') {
        const body = await readBody(event)
        const { title, options, answer, tags } = body

        // 新增題目到資料庫
        const question = await prisma.question.create({
            data: {
                question: title,
                options: JSON.stringify(options),
                answer,
                tags: JSON.stringify(tags)
            }
        })

        return question
    } else if (event.method === 'GET') {
        // 查詢所有題目
        const questions = await prisma.question.findMany()
        return questions
    } else if (event.method === 'DELETE') {
        const body = await readBody(event)
        const { id } = body
        await prisma.question.delete({
            where: {
                id: id
            }
        })
    }
})