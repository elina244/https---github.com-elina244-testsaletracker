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
    const sale = await prisma.sales.create({
      data: req.body
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
    const sale = await prisma.sales.update({
      where: { id },
      data: req.body
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
    await prisma.sales.delete({
      where: { id }
    })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete sale' })
  }
})

const port = 3001
app.listen(port, () => {
  console.log(`Express is live at http://localhost:${port}`)
})
