import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import * as bodyParser from 'body-parser';
import compression from 'compression';
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

app.use(compression());

// TODO: Remove cors
// app.use(cors());

app.use('/api', api);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
