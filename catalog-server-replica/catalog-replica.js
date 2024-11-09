const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const NodeCache = require('node-cache');

// Initialize Express app and cache
const app = express();
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Middleware to parse JSON bodies (for update count requests)
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./Book-replica.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error("Database connection error:", err.message);
    console.log("Connected to the SQLite database.");
});

// sql= 'CREATE TABLE Books(id INTEGER PRIMARY KEY,name,count,cost,topic)';
// db.run(sql);
// sql='INSERT INTO Books(name,count,cost,topic)VALUES (?,?,?,?)';
// db.run(sql,["Spring in the Pioneer Valley",55,30," undergraduate school"],(err)=>{
//     if (err) return console.error(err.message);
// });
// sql='DROP TABLE Books';
// db.run(sql);
// Array of book data
// const books = [
//     [1,"RPCs for Noobs", 29, 150, "Distributed systems"],
//     [2,"How to get a good grade in DOS in 40 minutes a day", 10, 100, "Distributed systems"],
//     [3,"Xen and the Art of Surviving Undergraduate School", 25, 250, "undergraduate school"],
//     [4,"Cooking for the Impatient Undergrad", 50, 70, "undergraduate school"],
//     [5,"How to finish Project 3 on time", 20, 30, "undergraduate school"],
//     [6,"Why theory classes are so hard.", 15, 25, "undergraduate school"],
//     [7,"Spring in the Pioneer Valley", 55, 30, "undergraduate school"]
// ];

// // SQL statement for inserting data
// const sql = 'INSERT INTO Books (id,name, count, cost, topic) VALUES (?,?, ?, ?, ?)';

// // Insert each book into the database
// books.forEach(book => {
//     db.run(sql, book, (err) => {
//         if (err) return console.error(err.message);
//         console.log(`Inserted book: ${book[0]}`);
//     });
// });


// Route to get book information by ID with "CATALOG_WEBSERVICE_IP" in the URL path
app.get('/CATALOG_WEBSERVICE_IP/info/:id', (req, res) => {
    const bookId = req.params.id;

    // Check cache first
    const cachedData = cache.get(bookId);
    if (cachedData) {
        console.log('Serving info from cache for book ID:', bookId);
        return res.status(200).json({ information: cachedData });
    }

    // Query the database if not cached
    const sqlQuery = 'SELECT name, count, cost FROM Books WHERE id = ?';
    db.get(sqlQuery, [bookId], (err, result) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result) {
            // Cache the result and respond
            cache.set(bookId, result);
            res.status(200).json({ information: result });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    });
});

// Route to search for books by topic with "CATALOG_WEBSERVICE_IP" in the URL path
app.get('/CATALOG_WEBSERVICE_IP/search/:topic', (req, res) => {
    const topic = req.params.topic;

    // Check cache first
    const cachedSearch = cache.get(topic);
    if (cachedSearch) {
        console.log('Serving search results from cache for topic:', topic);
        return res.status(200).json({ information: cachedSearch });
    }

    const sqlQuery = 'SELECT id, name FROM Books WHERE topic = ?';
    db.all(sqlQuery, [topic], (err, result) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result && result.length > 0) {
            // Cache the result and respond
            cache.set(topic, result);
            res.status(200).json({ information: result });
        } else {
            res.status(404).json({ message: 'No books found for the specified topic' });
        }
    });
});

//// Route to update the count of a book by ID with "CATALOG_WEBSERVICE_IP" in the URL path
app.put('/CATALOG_WEBSERVICE_IP/updateCount/:id', (req, res) => {
    const bookId = req.params.id;
    const newCount = req.body.count; // Get new count from request body

    if (newCount === undefined || isNaN(newCount)) {
        return res.status(400).json({ error: 'Please provide a valid count value.' });
    }

    const sqlQuery = 'UPDATE Books SET count = ? WHERE id = ?';
    db.run(sqlQuery, [newCount, bookId], function (err) {
        if (err) {
            console.error("Database update error:", err.message);
            return res.status(500).json({ error: 'Failed to update book count.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        // Clear cache for this book since data has changed
        cache.del(bookId);
        res.status(200).json({ message: 'Book count updated successfully.' });
    });
});

// Start server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Service is running on port ${PORT}`);
});
