import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import * as path from 'path';

const app = express();
const port = 3000;

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: true,
  ignoreRoute: (req, res) => false
}));

app.use(express.static(path.join(__dirname, '../../client/dist/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/client/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
