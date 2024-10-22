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
