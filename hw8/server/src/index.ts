import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import api from './api';

const app = express();
const PORT = 3000;

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
  requestWhitelist: ['url', 'method', 'httpVersion', 'originalUrl', 'query'],
  responseWhitelist: ['statusCode', 'body']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO: Remove cors
app.use(cors());

app.use(express.static(path.join(__dirname, '../../client/dist/client')));

app.get('/', (_req, res) => {
  res.redirect('/index.html');
});

app.use('/api', api);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
