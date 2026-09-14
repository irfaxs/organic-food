import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api/products/'

function App() {

  // =================================================
  // PRODUCTS
  // =================================================

  const [products, setProducts] = useState([])

  // =================================================
  // FORM DATA
  // =================================================

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)

  // =================================================
  // EDIT MODE
  // =================================================

  const [editingId, setEditingId] = useState(null)

  // Reference to Add/Edit Product form
  const formRef = useRef(null)

  // =================================================
  // GET PRODUCTS
  // =================================================

  const fetchProducts = () => {

    axios
      .get(API_URL)
      .then((response) => {

        setProducts(response.data)

      })
      .catch((error) => {

        console.error(
          'Error fetching products:',
          error
        )

      })

  }

  // =================================================
  // LOAD PRODUCTS WHEN PAGE OPENS
  // =================================================

  useEffect(() => {

    fetchProducts()

  }, [])

  // =================================================
  // DELETE PRODUCT
  // =================================================

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) {
      return
    }

    axios
      .delete(`${API_URL}${id}/`)
      .then(() => {

        console.log(
          'Product deleted successfully'
        )

        // Remove product from screen
        setProducts((currentProducts) =>
          currentProducts.filter(
            (product) => product.id !== id
          )
        )

        // If deleting the product currently being edited
        if (editingId === id) {
          handleCancelEdit()
        }

        alert('Product deleted successfully!')

      })
      .catch((error) => {

        console.error(
          'Error deleting product:',
          error
        )

        alert('Failed to delete product.')

      })

  }

  // =================================================
  // EDIT PRODUCT
  // =================================================

  const handleEdit = (product) => {

    // Store product ID
    setEditingId(product.id)

    // Put existing product values into form
    setName(product.name)
    setPrice(product.price)

    // Don't replace image unless a new image is selected
    setImage(null)

    // Scroll directly to Add/Edit Product form
    setTimeout(() => {

      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

    }, 100)

  }

  // =================================================
  // CANCEL EDIT
  // =================================================

  const handleCancelEdit = () => {

    setEditingId(null)

    setName('')
    setPrice('')
    setImage(null)

  }

  // =================================================
  // CREATE / UPDATE PRODUCT
  // =================================================

  const handleSubmit = (event) => {

    event.preventDefault()

    // Basic validation
    if (!name.trim()) {

      alert('Please enter product name.')
      return

    }

    if (!price) {

      alert('Please enter product price.')
      return

    }

    const formData = new FormData()

    formData.append(
      'name',
      name
    )

    formData.append(
      'price',
      price
    )

    // Only send image when a new image is selected
    if (image) {

      formData.append(
        'image',
        image
      )

    }

    // =================================================
    // UPDATE PRODUCT
    // =================================================

    if (editingId !== null) {

      axios
        .patch(
          `${API_URL}${editingId}/`,
          formData
        )
        .then((response) => {

          console.log(
            'Product updated:',
            response.data
          )

          // Update product on screen
          setProducts((currentProducts) =>
            currentProducts.map((product) =>
              product.id === editingId
                ? response.data
                : product
            )
          )

          // Clear form
          setName('')
          setPrice('')
          setImage(null)

          // Exit edit mode
          setEditingId(null)

          alert(
            'Product updated successfully!'
          )

        })
        .catch((error) => {

          console.error(
            'Error updating product:',
            error
          )

          console.error(
            'Server response:',
            error.response?.data
          )

          alert(
            'Failed to update product. Check the terminal.'
          )

        })

      return
    }

    // =================================================
    // CREATE PRODUCT
    // =================================================

    axios
      .post(
        API_URL,
        formData
      )
      .then((response) => {

        console.log(
          'Product created:',
          response.data
        )

        // Add new product directly to screen
        setProducts((currentProducts) => [
          ...currentProducts,
          response.data
        ])

        // Clear form
        setName('')
        setPrice('')
        setImage(null)

        alert(
          'Product added successfully!'
        )

      })
      .catch((error) => {

        console.error(
          'Error creating product:',
          error
        )

        console.error(
          'Server response:',
          error.response?.data
        )

        alert(
          'Failed to add product.'
        )

      })

  }

  // =================================================
  // PAGE
  // =================================================

  return (

    <div className="app">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <header className="navbar">

        <div className="logo">
          ORGANIC
        </div>

        <nav>

          <a href="#home">
            Home
          </a>

          <a href="#shop">
            Shop
          </a>

          <a href="#about">
            About
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>

        <div className="cart">
          🛒
        </div>

      </header>


      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="small-title">
            100% NATURAL
          </p>

          <h1>
            Healthy
            <br />
            Organic
            <br />
            Food
          </h1>

          <p className="hero-text">
            Fresh and healthy organic food delivered
            straight to your table.
          </p>

          <button
            type="button"
            onClick={() => {

              document
                .getElementById('shop')
                ?.scrollIntoView({
                  behavior: 'smooth'
                })

            }}
          >
            SHOP NOW
          </button>

        </div>

        <div className="hero-image">

          <div className="vegetable-placeholder">
            🥦 🥑 🥬
          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* PRODUCTS */}
      {/* ================================================= */}

      <section
        className="products"
        id="shop"
      >

        <h2>
          Our Products
        </h2>


        {/* ================================================= */}
        {/* ADD / EDIT PRODUCT FORM */}
        {/* ================================================= */}

        <div
          className="add-product"
          ref={formRef}
        >

          <h3>

            {editingId !== null
              ? 'Edit Product'
              : 'Add New Product'}

          </h3>


          <form
            onSubmit={handleSubmit}
          >

            {/* PRODUCT NAME */}

            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />


            {/* PRICE */}

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              min="0"
              step="0.01"
              required
            />


            {/* IMAGE */}

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {

                const selectedFile =
                  event.target.files?.[0] || null

                setImage(selectedFile)

              }}
            />


            {/* SUBMIT BUTTON */}

            <button
              type="submit"
            >

              {editingId !== null
                ? 'UPDATE PRODUCT'
                : 'ADD PRODUCT'}

            </button>


            {/* CANCEL BUTTON */}

            {editingId !== null && (

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelEdit}
              >
                CANCEL
              </button>

            )}

          </form>

        </div>


        {/* ================================================= */}
        {/* PRODUCT LIST */}
        {/* ================================================= */}

        <div className="product-grid">

          {products.length === 0 ? (

            <p className="no-products">
              No products available.
            </p>

          ) : (

            products.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >


                {/* PRODUCT IMAGE */}

                <div className="product-image">

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  ) : (

                    <span>
                      🥦
                    </span>

                  )}

                </div>


                {/* PRODUCT NAME */}

                <h3>
                  {product.name}
                </h3>


                {/* PRODUCT PRICE */}

                <p>
                  ₹{product.price}
                </p>


                {/* ================================================= */}
                {/* EDIT / DELETE BUTTONS */}
                {/* ================================================= */}

                <div className="product-actions">

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    EDIT
                  </button>


                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    DELETE
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>


      {/* ================================================= */}
      {/* PROMO SECTION */}
      {/* ================================================= */}

      <section
        className="promo-section"
        id="about"
      >

        {/* PROMO CARD 1 */}

        <div className="promo-card">

          <div className="promo-image">
            🥑
          </div>

          <div className="promo-content">

            <h2>
              Organic
              <br />
              Vegetables
            </h2>

            <button
              type="button"
              onClick={() => {

                document
                  .getElementById('shop')
                  ?.scrollIntoView({
                    behavior: 'smooth'
                  })

              }}
            >
              SHOP NOW
            </button>

          </div>

        </div>


        {/* PROMO CARD 2 */}

        <div className="promo-card natural">

          <div className="promo-content">

            <h2>
              Natural
              <br />
              & Healthy
            </h2>

            <p>
              Fresh natural products for a
              healthy lifestyle.
            </p>

          </div>

          <div className="promo-image">
            🌾
          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer
        className="footer"
        id="contact"
      >

        {/* ABOUT */}

        <div className="footer-column">

          <h3>
            About Us
          </h3>

          <p>
            Fresh organic food made with
            natural ingredients for a
            healthier lifestyle.
          </p>

        </div>


        {/* QUICK LINKS */}

        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

          <a href="#home">
            Home
          </a>

          <a href="#shop">
            Shop
          </a>

          <a href="#about">
            About
          </a>

        </div>


        {/* SOCIAL MEDIA */}

        <div className="footer-column">

          <h3>
            Follow Us
          </h3>

          <div className="social-icons">

            <span>
              ⓕ
            </span>

            <span>
              ⓘ
            </span>

            <span>
              ♥
            </span>

          </div>

        </div>

      </footer>

    </div>

  )

}

export default App