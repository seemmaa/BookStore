let sql;
const sqlite3= require('sqlite3').verbose();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const axios = require('axios');

const db =new sqlite3.Database("./Database/Book.db",sqlite3.OPEN_READWRITE,(err)=>{
    if(err) return console.error(err.message);
});
////sql='DELETE FROM Books WHERE id=5';
//db.run(sql);
// sql= 'CREATE TABLE Books(id INTEGER PRIMARY KEY,name,count,cost,topic)';
// //db.run(sql);
// sql='INSERT INTO Books(name,count,cost,topic)VALUES (?,?,?,?)';
// db.run(sql,["Spring in the Pioneer Valley",55,30," undergraduate school"],(err)=>{
//     if (err) return console.error(err.message);
// });

sql='SELECT * FROM Books';
db.all(sql,[],(err,rows)=>{
    if(err) return console.error(err.message);
    rows.forEach((row)=>{
        console.log(row);
    });
});
const app = express();

const catalogRoutes= require('./routes/catalogRoutes');




const PORT = process.env.PORT || 3000;

app.use(express.json());

// all Routes here
app.use('/CATALOG_WEBSERVICE_IP', catalogRoutes);
//app.use('/CATALOG_WEBSERVICE_IP', infoRouter);






app.listen(PORT, () => {
            console.log(`App running on port ${PORT} .....`);})