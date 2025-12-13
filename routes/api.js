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
        // Ensure proper type conversions
        let dateValue = new Date()
        if (saleDate) {
            // Handle ISO date string - extract date only
            const dateStr = saleDate instanceof String ? saleDate : new Date(saleDate).toISOString().split('T')[0]
            dateValue = new Date(dateStr)
        }
        
        const createData = {
            productName: String(productName || ''),
            saleDate: dateValue,
            quantity: parseInt(quantity) || 0,
            price: parseFloat(price) || 0,
            total: parseFloat(total) || 0,
            customerName: String(customerName || ''),
            paymentMethod: String(paymentMethod || ''),
        }
        
        const newSale = await prisma.sales.create({
            data: createData,
        })
        res.status(201).json(newSale)
    } catch (error) {
        console.error('Create error:', error)
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
        // Ensure proper type conversions
        let dateValue = new Date()
        if (saleDate) {
            // Handle ISO date string - extract date only
            const dateStr = saleDate instanceof String ? saleDate : new Date(saleDate).toISOString().split('T')[0]
            dateValue = new Date(dateStr)
        }
        
        const updateData = {
            productName: String(productName || ''),
            saleDate: dateValue,
            quantity: parseInt(quantity) || 0,
            price: parseFloat(price) || 0,
            total: parseFloat(total) || 0,
            customerName: String(customerName || ''),
            paymentMethod: String(paymentMethod || ''),
        }
        
        const updatedSale = await prisma.sales.update({
            where: { id },
            data: updateData,
        })
        res.json(updatedSale)
    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({ error: 'Failed to update sale' })
    }
})

// ----- DELETE -----
// Listen for DELETE requests
router.delete('/data/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deletedSale = await prisma.sales.delete({
            where: { id },
        })
        res.json(deletedSale)
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sale' })
    }
})

export default router