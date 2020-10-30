import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import * as path from 'path';
import * as bodyParser from 'body-parser';
// import cors from 'cors';
import api from './api';

const app = express();

declare var process: {
  env: {
    PORT: string
  }
};

const PORT = process.env.PORT || 8080;

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
  ),
  requestWhitelist: ['url', 'method', 'httpVersion', 'originalUrl', 'query'],
  responseWhitelist: ['statusCode']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO: Remove cors
// app.use(cors());

app.use(express.static(path.join(__dirname, './client')));

app.use('/api', api);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
