const url = require('url');
const http = require('http');
const myURL = new URL('https://localhost:8080');

const hostname = 'localhost';
const port = 8080;

const server = http.createServer((req:any, res:any) => {
    // if (myURL.href === 'localhost:8080') {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.end('This is index');
    // } else if (myURL.pathname === '/about') {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.end('This is about');
    // } else if (myURL.pathname === '/contact-me') {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.end('This is contant');
    // } 

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('This is index');
    console.log(res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});