import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(express.static('public'))
app.use(express.json())

// Redirect root → index.html
app.get('/', (req, res) => {
  res.redirect('/index.html')
})

// CREATE
app.post('/data', async (req, res) => {
  try {
    const { productName, saleDate, quantity, price, total, customerName, paymentMethod } = req.body
    
    // Ensure proper type conversions
    let dateValue = new Date()
    if (saleDate) {
      // Extract just the date portion (YYYY-MM-DD)
      const dateStr = typeof saleDate === 'string' ? saleDate.split('T')[0] : new Date(saleDate).toISOString().split('T')[0]
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
    
    const sale = await prisma.sales.create({
      data: createData
    })
    res.json(sale)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create sale' })
  }
})

// READ ALL
app.get('/data', async (req, res) => {
  try {
    const sales = await prisma.sales.findMany()
    res.json(sales)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch sales' })
  }
})

// SEARCH
app.get('/search', async (req, res) => {
  try {
    const { productName } = req.query
    const sales = await prisma.sales.findMany({
      where: {
        productName: {
          contains: productName,
          mode: 'insensitive'
        }
      }
    })
    res.json(sales)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// UPDATE
app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { productName, saleDate, quantity, price, total, customerName, paymentMethod } = req.body
    
    // Ensure proper type conversions
    let dateValue = new Date()
    if (saleDate) {
      // Extract just the date portion (YYYY-MM-DD)
      const dateStr = typeof saleDate === 'string' ? saleDate.split('T')[0] : new Date(saleDate).toISOString().split('T')[0]
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
    
    const sale = await prisma.sales.update({
      where: { id },
      data: updateData
    })
    res.json(sale)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update sale' })
  }
})

// DELETE
app.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params
    const sale = await prisma.sales.delete({
      where: { id }
    })
    res.json(sale)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete sale' })
  }
})

const port = 3001
app.listen(port, () => {
  console.log(`Express is live at http://localhost:${port}`)
})
