const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf'); // Requiere instalación: npm install cookie-parser csurf

const app = express();
const PORT = 3000;


app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);
  
  db.run(`INSERT OR IGNORE INTO categories (id, name) VALUES (1, 'Electrónica')`);
  db.run(`INSERT OR IGNORE INTO categories (id, name) VALUES (2, 'Ropa')`);
  db.run(`INSERT OR IGNORE INTO products (id, name, price, category_id) VALUES (1, 'Smartphone', 299.99, 1)`);
  db.run(`INSERT OR IGNORE INTO products (id, name, price, category_id) VALUES (2, 'Camiseta', 19.99, 2)`);
});


app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/categories/search', (req, res) => {
  const searchTerm = req.query.name || '';
  const query = 'SELECT * FROM categories WHERE name LIKE ?';
  
  db.all(query, [`%${searchTerm}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/categories', csrfProtection, (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO categories (name) VALUES (?)', [name], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name });
  });
});

app.put('/api/categories/:id', csrfProtection, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  db.run('UPDATE categories SET name = ? WHERE id = ?', [name, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.delete('/api/categories/:id', csrfProtection, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM categories WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});


app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/products/search', (req, res) => {
  const searchTerm = req.query.name || '';
  const query = 'SELECT * FROM products WHERE name LIKE ?';
  
  db.all(query, [`%${searchTerm}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.post('/api/products', csrfProtection, (req, res) => {
  const { name, description, price, category_id } = req.body;
  db.run(
    'INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)',
    [name, description, price, category_id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, description, price, category_id });
    }
  );
});

app.put('/api/products/:id', csrfProtection, (req, res) => {
  const { name, description, price, category_id } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
    [name, description, price, category_id, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.delete('/api/products/:id', csrfProtection, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// 5. FIX: Se eliminó completamente la ruta /api/exec (Command Injection)

// Ruta principal
app.get('/', csrfProtection, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor seguro corriendo en http://localhost:${PORT}`);
});