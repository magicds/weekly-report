const http = require('http');
const querystring = require('querystring');

const postData = querystring.stringify({
    user: JSON.stringify(
        [{
            name: '测试用户名',
            email: '516321242@qq.com'
        }, {
            name: '测试',
            email: '345566251@qq.com'
        }]
    ),
    type: 'all'
});

// http://localhost/weeklyreport/mail/sendmail.php
const options = {
    hostname: 'localhost',
    port: 80,
    path: '/weeklyreport/mail/sendmail.php',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', chunk => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();