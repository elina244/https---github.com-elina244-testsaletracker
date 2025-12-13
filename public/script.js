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
    const formData = new FormData(myForm)
    const json = Object.fromEntries(formData)

    // Handle different input types
    myForm.querySelectorAll('input').forEach(el => {
        const value = json[el.name]
        const isEmpty = !value || value.trim() === ''

        if (el.type === 'number') {
            json[el.name] = isEmpty ? null : Number(value)
        }
        else if (el.type === 'date') {
            json[el.name] = isEmpty ? null : new Date(value).toISOString()
        }
    })
    return json
}

// Listen for form submissions  
myForm.addEventListener('submit', async event => {
    event.preventDefault()
    const data = getFormData()
    await saveItem(data)
    myForm.reset()
    formPopover.hidePopover()
})

// Save item (Create or Update)
const saveItem = async (data) => {
    console.log('Saving:', data)

    const endpoint = data.id ? `/data/${data.id}` : '/data'
    const method = data.id ? "PUT" : "POST"

    const options = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    try {
        const response = await fetch(endpoint, options)

        if (!response.ok) {
            try {
                const errorData = await response.json()
                console.error('Error:', errorData)
                alert(errorData.error || response.statusText)
            }
            catch (err) {
                console.error(response.statusText)
                alert('Failed to save: ' + response.statusText)
            }
            return
        }

        const result = await response.json()
        console.log('Saved:', result)

        // Refresh the data list
        fetchItems()
    }
    catch (err) {
        console.error('Save error:', err)
        alert('An error occurred while saving')
    }
}

// Edit item - populate form with existing data
const editItem = (data) => {
    console.log('Editing:', data)

    Object.keys(data).forEach(field => {
        const element = myForm.elements[field]
        if (element) {
            if (element.type === 'date') {
                element.value = data[field] ? data[field].substring(0, 10) : ''
            } else {
                element.value = data[field]
            }
        }
    })

    formHeading.textContent = '🛒 Edit Sale'
    formPopover.showPopover()
}

// Delete item
const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this sale?')) {
        return
    }

    const endpoint = `/data/${id}`
    const options = { method: "DELETE" }

    try {
        const response = await fetch(endpoint, options)

        if (response.ok) {
            const result = await response.json()
            console.log('Deleted:', result)
            fetchItems()
        }
        else {
            const errorData = await response.json()
            alert(errorData.error || 'Failed to delete item')
        }
    } catch (error) {
        console.error('Delete error:', error)
        alert('An error occurred while deleting')
    }
}

// Render a single item
const renderItem = (item) => {
    const div = document.createElement('div')
    div.classList.add('item-card')
    div.setAttribute('data-id', item.id)

    const saleDate = item.saleDate ? new Date(item.saleDate).toLocaleDateString() : 'N/A'
    const total = item.total ? `$${item.total.toFixed(2)}` : '$0.00'
    const price = item.price ? `$${item.price.toFixed(2)}` : '$0.00'

    const template = /*html*/`  
    <div class="item-heading">
        <h3>${item.productName || 'Unnamed Product'}</h3>
        <div class="sale-total">${total}</div>
    </div>
    <div class="item-info"> 
        <div class="sale-details">
            <div class="detail">
                <strong>Date:</strong> ${saleDate}
            </div>
            <div class="detail">
                <strong>Quantity:</strong> ${item.quantity || 0}
            </div>
            <div class="detail">
                <strong>Original Price:</strong> ${price}
            </div>
            <div class="detail">
                <strong>Sale Price:</strong> ${total}
            </div>
        </div>
    </div>
    <div class="item-info">
        <section class="customer">
            <strong>Customer:</strong> ${item.customerName || 'N/A'}
        </section>
        <section class="payment">
            <strong>Payment:</strong> ${item.paymentMethod || 'N/A'}
        </section>
    </div>
    <div class="item-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    </div>
    `
    div.innerHTML = DOMPurify.sanitize(template)

    div.querySelector('.edit-btn').addEventListener('click', () => editItem(item))
    div.querySelector('.delete-btn').addEventListener('click', () => deleteItem(item.id))

    return div
}

// Fetch items from API endpoint and populate the content div
const fetchItems = async () => {
    try {
        const response = await fetch('/data')

        if (response.ok) {
            if (readyStatus) readyStatus.style.display = 'block'
            if (notReadyStatus) notReadyStatus.style.display = 'none'

            const data = await response.json()
            console.log('Fetched data:', data)

            if (data.length == 0) {
                contentArea.innerHTML = '<p><i>No sales found in the database.</i></p>'
                return
            }
            else {
                contentArea.innerHTML = ''
                data.forEach(item => {
                    const itemDiv = renderItem(item)
                    contentArea.appendChild(itemDiv)
                })
            }
        }
        else {
            if (notReadyStatus) notReadyStatus.style.display = 'block'
            if (readyStatus) readyStatus.style.display = 'none'
            if (createButton) createButton.style.display = 'none'
            if (contentArea) contentArea.style.display = 'none'
        }
    } catch (error) {
        console.error('Error fetching data:', error)
        if (notReadyStatus) notReadyStatus.style.display = 'block'
    }
}

// Revert to the default form title on reset
myForm.addEventListener('reset', () => formHeading.textContent = '🛒 Record a Sale')

// Reset the form when the create button is clicked
createButton.addEventListener('click', () => myForm.reset())

// Load initial data
fetchItems()