const fs = require('node:fs');

const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;

  const data = fs.readFileSync('index.html', 'utf8');
  
  res.setHeader('Content-Type', 'text/html');
  res.end(data);

});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
