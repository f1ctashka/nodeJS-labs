import { createServer } from 'node:http';

const listener = (request, response) => {
  response.setHeader('Content-Type', 'text/html');

  response
    .writeHead(200)
    .end(
      '<img src="https://i.imgur.com/EDA6NLa.jpg" alt="Samoyed" width="200" />'
    );
};

const server = createServer(listener);
server.listen(3000);
