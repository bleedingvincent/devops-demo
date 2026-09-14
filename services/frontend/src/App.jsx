import { useState, useEffect } from 'react'
import './App.css'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' && window.location.port === '5173'
    ? 'http://localhost:8000'
    : '/api/')

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newItemName, setNewItemName] = useState('')
  const [description, setDescription] = useState('');

  // Load items from API
  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/items`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  // Create new item (Тепер приймає і ім'я, і опис)
  const createItem = async (name, desc) => {
    setError(null)
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ТУТ ВИПРАВЛЕНО: тепер відправляємо і name, і description
        body: JSON.stringify({ name: name, description: desc }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      // Отримуємо створений елемент з бази (щоб мати правильний ID)
      const newItem = await response.json() 
      
      setDescription('');
      setItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err.message || 'Failed to create item')
      throw err
    }
  }

  // Delete item
  const deleteItem = async id => {
    setError(null)
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete item')
    }
  }

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault()
    if (!newItemName.trim()) {
      setError('Item name cannot be empty')
      return
    }

    try {
      // ТУТ ВИПРАВЛЕНО: передаємо опис у функцію
      await createItem(newItemName.trim(), description.trim())
      setNewItemName('')
    } catch {
      // Error already set in createItem
    }
  }

  // Load items on component mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    fetchItems()
  }, [])

  return (
    <div className="app">
      <header>
        <h1>DevOps Demo - Items Manager</h1>
      </header>

      <main>
        <section className="form-section">
          <h2>Add New Item</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              placeholder="Enter item name"
              disabled={loading}
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Item description"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !newItemName.trim()}>
              Add Item
            </button>
          </form>
        </section>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <section className="items-section">
          <h2>Items ({items.length})</h2>
          {loading && <div className="loading-state">Loading items...</div>}
          {!loading && items.length === 0 && (
            <div className="empty-state">No items yet. Add one above!</div>
          )}
          {!loading && items.length > 0 && (
            <ul className="items-list">
              {items.map(item => (
                // ТУТ ВИПРАВЛЕНО: коректна структура тегів
                <li key={item.id} className="item">
                  <span>
                    <strong>{item.name}</strong>
                    {item.description ? <span> - {item.description}</span> : null}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${item.name}"?`)) {
                        deleteItem(item.id)
                      }
                    }}
                    disabled={loading}
                    aria-label={`Delete ${item.name}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
