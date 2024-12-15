const express = require('express');
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
var bodyParser = require('body-parser');
const path = require('path');
const formData = require('express-form-data');
const fs = require('fs');
// mongoose.connect('mongodb://98.81.55.100:27017/workshop_devops');
mongoose.connect('mongodb://192.168.0.145:28017/workshop_devops');
// mongoose.connect('mongodb://basic_node_app_mongo_db_container:27017/workshop_devops');

const app = express();
app.use(express.json());

app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(formData.parse());
app.use(express.static("uploads"));

const dataSchema = new mongoose.Schema({ name: String });
const Data = mongoose.model('User', dataSchema);

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

app.post('/mongo', async (req, res) => {
    const data = new Data(req.body);
    await data.save();
    res.send(data);
});
app.get('/mongo', async (req, res) => {
    const data = await Data.find();
    res.send(data);
});

app.post('/upload', (req, res) => {
    const cpath = path.join(__dirname, 'uploads', Math.random() * 1000 + '.jpg');
    const file = req.files.file;
    fs.copyFile(file.path, cpath, function (err) {
        if (err) return console.error(err)
        console.log("success!")
    });

    res.json({ message: 'File uploaded successfully' });
});

// mysql.createConnection({ host: '98.81.55.100', user: 'remote_user', password: 'DBsql$#%12345678', database: 'workshop_devops' })
// mysql.createConnection({ host: 'basic_node_app_mysql_db_container', user: 'root', password: '', database: 'workshop_devops' })
mysql.createConnection({ host: '192.168.0.145', port:'3406', user: 'root', password: '', database: 'workshop_devops' })
    .then(connection => {
        app.post('/mysql', (req, res) => {
            const { name } = req.body;
            connection.query('INSERT INTO users (name) VALUES (?)', [name])
                .then(() => {
                    res.send({ success: true });
                })
                .catch(err => {
                    res.status(500).send({ error: err.message });
                });
        });

        app.get('/mysql', (req, res) => {
            connection.query('SELECT * FROM users')
                .then(([rows]) => {
                    res.send(rows);
                })
                .catch(err => {
                    res.status(500).send({ error: err.message });
                });
        });

        app.listen(6001, '0.0.0.0', () => {
            console.log('Server started on port http://98.81.55.100:6001');
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });


/** scp -i workshop_2_aws_pkey.pem app.zip ubuntu@98.81.55.100:/var/www/node_app */

/* 
-v /mnt/c/Users/mypho/Desktop/basic_node_app/db/mongo:/data/db \
    docker run --name basic_node_app_mongo_db_container \
    --network basic_node_app_network \
    -p 28017:27017 -d mongo

*/

/**
 * 
 -v /mnt/c/Users/mypho/Desktop/basic_node_app/db/mysql:/var/lib/mysql \

 docker run --name basic_node_app_mysql_db_container \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
  --network basic_node_app_network \
  -p 3406:3306 \
  -d mysql
 */

// docker run --name basic_node_app_v2_container_1 --network basic_node_app_network -p 8001:6001 -d basic_node_app:v2

// docker run --name basic_node_app_v3_container_1 --network basic_node_app_network -p 8002:6001 -v /mnt/c/Users/mypho/Desktop/basic_node_app/uploads:/var/www/basic_node_app/uploads -d basic_node_app:v3