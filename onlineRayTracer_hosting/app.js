const express = require('express')
const http = require('http')
const fs = require('fs')
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 8080;

app.use('/html', express.static('./public_html'));
app.use('/css', express.static('./public_css'));
app.use('/js', express.static('./public_js'));
app.use('/src', express.static('./public_src'));

app.get('/', (request, response) => {
    fs.readFile(`${__dirname}/public_html/onlineRayTracer_startPage.html`, (err, data) => {
        if(err) {
            console.log(err);
            response.send('에러');
        } else {
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write(data);
            response.end();
        }
    })
})

server.listen(port, () => {
  console.log('서버 실행 중..');
})