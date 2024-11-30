const { doTable } = require('./adatbazis.js');
const { getUzenetek } = require('./uzenetek.js');
const { handleForm } = require('./kapcsolat_form.js');
const { CRUD } = require('./crud.js');

const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    if (filePath === './') {
        filePath = './index.html';
    }
	
	if (req.url === '/todo') {
		filePath = './todo.html';
    }
	
	if (req.url === '/menucrud') {
		filePath = './crudmenu.html';
    }
	
	if (req.url === '/kapcsolat') {
		filePath = './kapcsolat.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html; charset=utf-8';

    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg';
            break;
    }
	
	if (req.url === '/doHiba') { //törölni
		doHiba((htmlResult) => {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(htmlResult);
		});
        return;
    }
	
	if (req.url === '/getData') {
		doTable((htmlResult) => {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(htmlResult);
		});
        return;
    }
	
	if (req.url === '/getUzenetek') {
		getUzenetek((htmlResult) => {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(htmlResult);
		});
        return;
    }
	
	if (req.url.startsWith("/crud")) {
        CRUD(req, res);
        return;
    }
	
	if (req.url === '/submit') {
        handleForm(req, res);
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Fájl nem található');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}).listen(8011);

console.log('Elindítva a 8011-es porton');