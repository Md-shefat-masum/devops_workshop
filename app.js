const express = require('express');
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

// mongoose.connect('mongodb://98.81.55.100:27017/workshop_devops');
mongoose.connect('mongodb://basic_node_app_network:27017/workshop_devops');

const app = express();
app.use(express.json());

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

mysql.createConnection({ host: '98.81.55.100', user: 'remote_user', password: 'DBsql$#%12345678', database: 'workshop_devops' })
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

//  docker run --name basic_node_app_mongo_db_container --network basic_node_app_network -p 28017:27017 -d mongo