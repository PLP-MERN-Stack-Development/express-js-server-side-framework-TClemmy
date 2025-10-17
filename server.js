// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
//const { v4: uuidv4 } = require('uuid');
Loading configuration....
const apiKeyAuth = require('./authenticate');//the middleware

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
//apply middleware to all routes
app.use(apiKeyAuth);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});
// Task 1: 
app.get('/', (req, res) =>{
  res.send('Hello World');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/', (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if(!product) return res.status(404).send('Product Not Found.');
  res.json(product);
});
// POST /api/products - Create a new product
app.post('/', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    inStock: req.body.inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put('/', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if(!product) return res.status(404).send('Product Not Found');
  Object.assign(product, req.body);
  res.json(product);
});
// DELETE /api/products/:id - Delete a product
app.delete('/:id', (req, res) => {
  const product = products.filter(p => p.id !== parseInt(req.params.id));
  res.status(204).send('Product Deleted');
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
const reqLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  console.log('${timestamp} ${method} ${url}');
  next();
};
//use the middleware
app.use(reqLogger);
// * Middleware to parse JSON request bodies
app.post('/data', (req, res) =>{
  console.log(req.bodyParser);
  res.send('JSON Received');
});
// - Authentication
// - Error handling
const errorHandler = (req, res, next) =>{
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false, 
        message: err.message || 'Internal Server Error',
    });
};
// Adnavced Features
//filter by product category
app.get('/', (req, res) => {
  let filteredProducts = products;
  const {category} = req.query;
  if(category)
  {
    filteredProducts = products.filter(product => 
      product.category.toLowerCase() == category.toLowerCase()
    );
  }
  res.json(filteredProducts);
});
//search by product name
app.get('/', (req, res) => {
    const searchName = req.query.name;
    if(!searchName)
    {
      return res.status(400).json({message: 'Search name required'});
    }
    //filter
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchName.toLowerCase())
    );
    res.json(filteredProducts);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 
