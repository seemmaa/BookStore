const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database("./Database/Book.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

exports.bookSearch = (req, res) => {
    const sqlQuery = 'SELECT id,name FROM Books WHERE topic = ?';
    const topic = req.params.topic; 

    
    db.all(sqlQuery, [topic], (err, result) => {
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
