const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const NodeCache = require('node-cache');

// Initialize database
const db = new sqlite3.Database("./Database/Book.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// Initialize NodeCache with a TTL of 100 seconds and a check period of 120 seconds
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Cache-enabled getInfo function
exports.getInfo = (req, res) => {
    const bookId = req.params.id;

    // Check if data is already cached
    const cachedData = cache.get(bookId);
    if (cachedData) {
        console.log('Cache hit for book ID:', bookId);
        return res.status(200).json({ information: cachedData, source: "cache" });
    }

    console.log('Cache miss for book ID:', bookId);
    const sqlQuery = 'SELECT name, count, cost FROM Books WHERE id = ?';

    // Query the database if data is not in cache
    db.get(sqlQuery, [bookId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (result) {
            // Cache the result before responding
            cache.set(bookId, result);
            res.status(200).json({ information: result, source: "database" });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    });
};

// Update count and clear cache for updated record
exports.updatedCount = (req, res) => {
    const itemId = req.params.id;
    const newCount = req.body.count; // Get new count from request body

    const sql = 'UPDATE Books SET count = ? WHERE id = ?';
    db.run(sql, [newCount, itemId], function (err) {
        if (err) {
            console.error('Database error:', err.message); // Log any database errors
            return res.status(500).json({ error: 'Failed to update book count.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        // Invalidate cache for the updated book ID
        cache.del(itemId);
        res.status(200).json({ message: 'Book count updated successfully.' });
    });
};
