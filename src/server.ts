import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { config } from './config/index';

const app = express();
const PORT = 3000;

mongoose
    .connect(config.dbUrl)
    .then(() => {
        console.log('Connected to the Database successfully');
    })
    .catch( (err) => {
        console.log('Error connecting to database')
    });

app.use(bodyParser.json())

/* Health check
    @return Object
*/
app.get('/', (req, res) => {
  res.send({status:"OK"}); 
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});