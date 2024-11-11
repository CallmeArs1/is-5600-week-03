const http = require('http');
const url = require('url');
const express = require('express');
const EventEmitter = require('events');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();
app.use(express.static(__dirname + '/public'));

function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}
function respondJson(req, res) {
    res.json({
      text: 'hi',
      numbers: [1, 2, 3],
    });
  }
  function respondEcho(req, res) {
    const { input = '' } = req.query;
  
    res.json({
      normal: input,
      shouty: input.toUpperCase(),
      charCount: input.length,
      backwards: input.split('').reverse().join(''),
    });
  }
  function respondNotFound(req, res) {
    res.status(404).send('Not Found');
  }

  function chatApp(req, res) {
    res.sendFile(path.join(__dirname, '/chat.html'));
  }
  app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', (req, res) => {
    const { message } = req.query;
  
    chatEmitter.emit('message', message);
    res.end();
  });
  
  app.get('/sse', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
    });
  
    const onMessage = (message) => res.write(`data: ${message}\n\n`);
    chatEmitter.on('message', onMessage);
  
    res.on('close', () => {
      chatEmitter.off('message', onMessage);
    });
  });
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
      
      