var express = require('express')
var os = require('os');
var open = require('opn');
let app = express();
let host = 8099;
var qr = require('qr-image');
var ipv4 = '';
var ifaces = os.networkInterfaces();

for (var dev in ifaces) {
    ifaces[dev].forEach(function(details, index) {
        if (details.family == 'IPv4') {
            ipv4 = details.address;
        }
    });
}

app.use(express.static(__dirname));

app.get("/", (req, res, next) => {
    res.sendfile("test/index.html")
});
app.get('/create_qrcode', function(req, res, next) {
    try {
        var img = qr.image(ipv4 + ':' + host, { size: 10 });
        res.writeHead(200, { 'Content-Type': 'image/png' });
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, { 'Content-Type': 'text/html' });
        res.end('<h1>414 Request-URI Too Large</h1>');
    }
});

app.listen(host, () => {
    console.log('the server start at ' + host)
    console.log(ipv4 + ":" + host)
        // open(ipv4 + ":" + host)
})