var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http');
var postgres = require('pg');
var cors = require('cors');
var multer = require('multer');
var parse = require('csv-parse');
var XLSX = require('node-xlsx');
var hash = require('crypto-js');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).single('file');

var port = 6120;
var jwt_secret = '332bc079f4a5502272d8fcb48907355c69663727ccb2823d29c1430606179fd79c5550153fd07c4bb598d9140ac025534e90faab8bb58af8550879ba1adbf47e';
var { Client } = require('pg');
var client = new Client({
    host: 'database-1.c6dwdzqumaoj.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'price_updates',
    user: 'dbadmin',
    password: 'alfj%34dVOp'
});
client.connect();

async function queryDB(query) {
    console.log('\x1b[33m%s\x1b[0m', 'QUERY: ' + query + '\n');
    var result = await client.query(query);
    return result;
}

app.get('*', (req, res, next) => {
    console.log('Received request');
    next();
});
    
app.get('/getAllUpdates', (req, res) => {
    (async () => {
        var updates = await queryDB('select u.id, extract(epoch from due_date) as due_date, extract(epoch from received_date) as received_date, priority, url, v.name, status, items from price_update u, vendor v where v.id = u.vendor_id');
        res.send({ error: null, updates: updates.rows });
    })();
});
    
app.post('/getDetails', (req, res) => {
    (async () => {
        var details = await queryDB('select name, document_num, product_nums, prices, comments from update_list, price_update, vendor where price_update.id = price_update_id and vendor.id = price_update.vendor_iddate_id = ' + req.body.update_id);
        res.send({ error: null, details: details.rows[0] });
    })();
});
    
app.post('/uploadFile', (req, res) => {
    console.log('File uploading...');
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        var payload = jwt.verify(req.body.token, jwt_secret);

        // Store the file as a price_update on the DB
        var received_date = new Date().getTime();
        var due_date = new Date();
        due_date.setDate(due_date.getDate() + 15);
        due_date = due_date.getTime();
        var priority = 0;
        var vendor_id = payload.id;
        var status = 0;
        var items = 0;
        var url = req.file.originalname;
        queryDB('insert into price_update (received_date, due_date, priority, vendor_id, status, items, url) values (to_timestamp(' + received_date + ') at time zone \'UTC\', to_timestamp(' + due_date +') at time zone \'UTC\', ' + priority + ', ' + vendor_id + ', ' + status + ', ' + items + ', \'' + url + '\')');

        var uploaded = processUpdate(req.file.originalname, payload.shorthand);
        if (uploaded) {
            res.send({ error: null });
        } else {
            res.send({ error: 'Something went wrong with the upload' });
        }
    });
});

app.post('/checkToken', (req, res) => {
    (async () => {
        // Check that token is in use
        var userCheck = await queryDB('select * from vendor where token = \'' + req.body.token + '\'');
        if (userCheck.rowCount > 0) {
            // Token is in use, check for expiry
            var payload = jwt.verify(userCheck.rows[0].token, jwt_secret);
            var date = new Date();
            if (new Date() > new Date(payload.expiry)) {
                // Token is expired, nullify in DB and return error
                var updateUser = await queryDB('update vendor set token = null where id = ' + payload.id);
                res.send({ error: 'Your login has expired, please sign in again.' });
            } else {
                // No issues with token, send payload
                res.send({ error: null, payload: payload });
            }
        } else {
            // Token not in use, return error
            res.send({ error: 'Please sign in again to continue.' });
        }
    })();
});

app.post('/logout', (req, res) => {
    (async () => {
        var payload = jwt.verify(req.body.token, jwt_secret);

        // Check for existing user
        var userCheck = await queryDB('select * from vendor where id = ' + payload.id);
        if (userCheck.rowCount > 0) {
            // Remove the token from the user
            var removeToken = await queryDB('update vendor set token = null where id = ' + payload.id);
            res.send({ error: null });
        } else {
            res.send({ error: 'no_user' });
        }
    })();
});

app.post('/getAllUpdates', (req, res) => {
    (async () => {
        // Verify the token is admin
        var payload = jwt.verify(req.body.token, jwt_secret);
        
    })();
});

app.post('/login', (req, res) => {
    (async () => {
        // Check for existing user
        var userCheck = await queryDB('select * from vendor where shorthand = \'' + req.body.username.toUpperCase() + '\'');
        if (userCheck.rowCount > 0) {
            // User exists, verify password
            var hashedPre = hash.SHA512(userCheck.rows[0].salt + req.body.password);
            var hashed = hashedPre.toString(hash.enc.Hex);

            console.log(hashed.toUpperCase());

            if (hashed.toUpperCase() == userCheck.rows[0].password) {
                // Passwords match, generate token
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                var isAdmin = req.body.username.toUpperCase() == 'CANUSA';
                var payload = {
                    id: userCheck.rows[0].id,
                    name: userCheck.rows[0].name,
                    shorthand: userCheck.rows[0].shorthand,
                    expiry: expireDate.getTime(),
                    admin: isAdmin
                };
                var token = jwt.sign(payload, jwt_secret);

                // Update user record to include token
                var updateRecord = await queryDB('update vendor set token = \'' + token + '\' where id = ' + userCheck.rows[0].id);

                console.log(isAdmin);

                // Send token back to client
                res.send({ error: null, token: token, admin: isAdmin });
            } else {
                res.send({ error: "wrong_pass" });
            }
        } else {
            res.send({ error: "no_user" });
        }
    })();
});

function addTab(number) {
    var output = '';
    for (var i=0; i<number; i++) {
        output += '|';
    }
    return output;
}

//------- Vendor Processing Functions -------//

// Determine vendor
function processUpdate(input, shorthand) {
    switch (shorthand) {
        case 'WTH':
            return processWTH(input);
        default:
            console.log('Cannot determine vendor');
            return false;
    }
}

// WTH Processing
function processWTH(input) {
    var workbook = XLSX.parse('uploads/' + input);
    var data = '';
    for (var i in workbook[0].data) {
        if (i > 0) {
            var row = workbook[0].data[i];
            var newRow = row[0] + '|' + row[2] + addTab(21) + row[7] +
                        addTab(8) + Number(row[14]).toFixed(2) + '||' +
                        Number(row[13]).toFixed(2) + addTab(31) + Number(row[8]).toFixed(2) +
                        '|' + Number(row[11]).toFixed(2) + '|' + Number(row[9]).toFixed(2) +
                        '|' + Number(row[10]).toFixed(2) + '|';
            data += newRow + '\n';
        }
    }
    var filename = input.substr(input.length-5);
    fs.writeFile('output/' + input + ' - output.csv', data, err => {
        if (err) return console.log(err);
        console.log('WTH processing complete: output/' + input + '-output.csv');
        return true;
    });
}
    
app.listen(port, () => {
    console.log('Listening on port ' + port + '...');
});