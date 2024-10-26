const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database("./Database/Book.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});


exports.getInfo = (req, res) => {
    const sqlQuery = 'SELECT name,count, cost FROM Books WHERE id = ?';
    const bookId = req.params.id; 

    
    db.get(sqlQuery, [bookId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (result) {
            res.status(200).json({ information: result });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    });
};

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
        res.status(200).json({ message: 'Book count updated successfully.' });
    });
};