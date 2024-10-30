let sql;
const sqlite3= require('sqlite3').verbose();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000; 



const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');



const program = new Command();
program.name('CLI').description('CLI for DOS Project').version('1.0.0');


let questionSearch = [
  {
    type: 'input',
    name: 'bookTitle',
    message: 'please enter book topic to get details about it: ',
  },
];

let questionInfo = [
  {
    type: 'number',
    name: 'itemNumber',
    message: 'please enter item number to get info about it: ',
  },
];

let questionPurchase = [
  {
    type: 'number',
    name: 'itemNumber',
    message: 'please enter book item number to purchase it: ',
  },
 
];


program
  .command('search-book-title')
  .alias('s')
  .description('search about specific book using book topic')
  .action(() => {
    inquirer
      .prompt(questionSearch)
      .then(async (answers) => {
        try {
          const result = await axios.get(`http://catalog_server:3000/search/${answers.bookTitle}`);
          console.log('Response Data:', result.data);
        } catch (error) {
          console.error('Error during request:', error.message);
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
         
        } else {
         
        }
      });
  });


program
  .command('info-book-item-number')
  .alias('i')
  .description('info about specific book using item number')
  .action(() => {
    inquirer
      .prompt(questionInfo)
      .then(async (answers) => {
        try {
          const result = await axios.get(`http://catalog_server:3000/info/${answers.itemNumber}`);
          console.log('Response Data:', result.data);
        } catch (error) {
          console.error('Error during request:', error.message);
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
         
        } else {
         
        }
      });
  });


program
  .command('purchase-book-by-item-number')
  .alias('p')
  .description('purchase specific book using item number')
  .action(() => {
    inquirer
      .prompt(questionPurchase)
      .then(async (answers) => {
        try {
          const result = await axios.post(`http://order_server:4000/purchase/${answers.itemNumber}`, {
            id: answers.itemNumber,
          
          });
          console.log('Response Data:', result.data);
        } catch (error) {
          console.error('Error during request:', error.message);
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
         
        } else {
         
        }
      });
  });


program.parse();

app.listen(PORT, () => {
  console.log(`Cloent server running on port ${PORT}...`);
});
