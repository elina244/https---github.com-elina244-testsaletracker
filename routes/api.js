// filepath: /Users/elinamo/Desktop/project2-1/routes/api.js
import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()

// Set this to match the model name in your Prisma schema
const model = 'sales'

// Prisma lets NodeJS communicate with MongoDB
const prisma = new PrismaClient()

// Connect to the database
prisma.$connect().then(() => {
    console.log('Connected to the database')
}).catch(err => {
    console.error('Database connection error:', err)
})

// ----- CREATE (POST) -----
// Create a new record for the configured model
router.post('/data', async (req, res) => {
    const { productName, saleDate, quantity, price, total, customerName, paymentMethod } = req.body
    try {
        const newSale = await prisma.sales.create({
            data: {
                productName,
                saleDate,
                quantity,
                price,
                total,
                customerName,
                paymentMethod,
            },
        })
        res.status(201).json(newSale)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create sale' })
    }
})

// ----- READ (GET) list ----- 
router.get('/data', async (req, res) => {
    try {
        const sales = await prisma.sales.findMany()
        res.json(sales)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales' })
    }
})

// ----- findMany() with search ------- 
router.get('/search', async (req, res) => {
    const { productName } = req.query
    try {
        const sales = await prisma.sales.findMany({
            where: {
                productName: {
                    contains: productName,
                },
            },
        })
        res.json(sales)
    } catch (error) {
        res.status(500).json({ error: 'Failed to search sales' })
    }
})

// ----- UPDATE (PUT) -----
// Listen for PUT requests
router.put('/data/:id', async (req, res) => {
    const { id } = req.params
    const { productName, saleDate, quantity, price, total, customerName, paymentMethod } = req.body
    try {
        const updatedSale = await prisma.sales.update({
            where: { id },
            data: {
                productName,
                saleDate,
                quantity,
                price,
                total,
                customerName,
                paymentMethod,
            },
        })
        res.json(updatedSale)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update sale' })
    }
})

// ----- DELETE -----
// Listen for DELETE requests
router.delete('/data/:id', async (req, res) => {
    const { id } = req.params
    try {
        await prisma.sales.delete({
            where: { id },
        })
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sale' })
    }
})

export default router