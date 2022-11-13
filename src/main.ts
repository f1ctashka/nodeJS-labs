import 'dotenv/config';

import { createServer, IncomingMessage, ServerResponse } from 'node:http';

const SAMOYED = 'https://i.imgur.com/EDA6NLa.jpg';
const PORT = +(process.env.PORT || 3000);

const listener = (request: IncomingMessage, response: ServerResponse) => {
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(200);

  response.end(`<img src="${SAMOYED}" alt="Samoyed" width="200" />`);
};

const server = createServer(listener);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
