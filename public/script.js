// filepath: /Users/elinamo/Desktop/project2-1/public/script.js

let readyStatus = document.querySelector('#readyStatus')
let notReadyStatus = document.querySelector('#notReadyStatus')
let myForm = document.querySelector('#myForm')
let contentArea = document.querySelector('#contentArea')
let formPopover = document.querySelector('#formPopover')
let createButton = document.querySelector('#createButton')
let formHeading = document.querySelector('#formPopover h2')

// Get form data and process each type of input
const getFormData = () => {
    return {
        productName: document.querySelector('#productName').value,
        saleDate: new Date(document.querySelector('#saleDate').value),
        quantity: parseInt(document.querySelector('#quantity').value),
        price: parseFloat(document.querySelector('#price').value),
        total: parseFloat(document.querySelector('#total').value),
        customerName: document.querySelector('#customerName').value,
        paymentMethod: document.querySelector('#paymentMethod').value,
    }
}

// listen for form submissions  
myForm.addEventListener('submit', async event => {
    event.preventDefault()
    const data = getFormData()
    await saveItem(data)
})

// Save item (Create or Update)
const saveItem = async (data) => {
    const response = await fetch('/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        // Handle successful save
        fetchItems()
    } else {
        // Handle error
        console.error('Error saving item')
    }
}

// Edit item - populate form with existing data
const editItem = (data) => {
    document.querySelector('#id').value = data.id
    document.querySelector('#productName').value = data.productName
    document.querySelector('#saleDate').value = data.saleDate.toISOString().split('T')[0]
    document.querySelector('#quantity').value = data.quantity
    document.querySelector('#price').value = data.price
    document.querySelector('#total').value = data.total
    document.querySelector('#customerName').value = data.customerName
    document.querySelector('#paymentMethod').value = data.paymentMethod
}

// Delete item
const deleteItem = async (id) => {
    const response = await fetch(`/data/${id}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        fetchItems()
    } else {
        console.error('Error deleting item')
    }
}

// Render a single item
const renderItem = (item) => {
    // Implement rendering logic for a single sales record
}

// fetch items from API endpoint and populate the content div
const fetchItems = async () => {
    const response = await fetch('/data')
    const items = await response.json()
    contentArea.innerHTML = ''
    items.forEach(renderItem)
}