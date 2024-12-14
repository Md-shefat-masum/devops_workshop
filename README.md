# devops_workshop

Here is the step-by-step code for each task:

### 1. Prepare VPS
```bash
# Update and upgrade the VPS
sudo apt update && sudo apt upgrade -y
```

---

### 2. Install PHP
```bash
sudo apt install php libapache2-mod-php php-mysql -y
php -v
```

---

### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

### 4. Install MongoDB
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
mongo --version
```

---

### 5. Install MySQL
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
mysql -u root -p
```

---

### 6. Connect with DB-weaver
```bash
# Configure MySQL for remote access
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Comment out: bind-address = 127.0.0.1
sudo systemctl restart mysql

# Allow remote user
mysql -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
EXIT;
```

---

### 7. Run a Node Project
```bash
git clone <repository_url>
cd <project_folder>
npm install
node server.js
```

---

### 8. Create Two APIs
#### MongoDB Example:
```javascript
// app.js
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase');

const app = express();
app.use(express.json());

const dataSchema = new mongoose.Schema({ name: String });
const Data = mongoose.model('Data', dataSchema);

app.post('/mongo', async (req, res) => {
    const data = new Data(req.body);
    await data.save();
    res.send(data);
});
app.get('/mongo', async (req, res) => {
    const data = await Data.find();
    res.send(data);
});
app.listen(3000);
```

#### MySQL Example:
```javascript
// app.js
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'test' });

app.post('/mysql', async (req, res) => {
    const { name } = req.body;
    await connection.query('INSERT INTO users (name) VALUES (?)', [name]);
    res.send({ success: true });
});
app.get('/mysql', async (req, res) => {
    const [rows] = await connection.query('SELECT * FROM users');
    res.send(rows);
});
```

---

### 9. Setup Apache Configure and Live Test
```bash
sudo nano /etc/apache2/sites-available/000-default.conf
# Update DocumentRoot to your project directory

sudo a2enmod rewrite
sudo systemctl restart apache2
```

---

### 10. List Problems in Production
```bash
# Example of production log check
sudo journalctl -xe
tail -f /var/log/apache2/error.log
```

---

### 11. Setup CI/CD with GitHub Actions
#### .github/workflows/main.yml:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

---

### 12. Server Monitoring
```bash
sudo apt install htop
htop
```

---

### 13. Docker Basic Concepts
#### Install Docker:
```bash
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```

#### Image:
```bash
docker pull nginx
docker images
```

#### Container:
```bash
docker run -d -p 8080:80 nginx
docker ps
```

#### Volume:
```bash
docker volume create myvolume
docker run -v myvolume:/data -d nginx
```

#### Network:
```bash
docker network create mynetwork
```

---

### 14. Run First Project through Docker
#### Dockerfile:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Run:
```bash
docker build -t myapp .
docker run -d -p 3000:3000 myapp
```

---

### 15. Implement Basic Concepts
#### Setup CID:
```bash
docker run -d -p 6379:6379 --name redis redis
```

---

### 16. Setup Load Balancer
#### Install Nginx:
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/load-balancer
# Add upstream configuration
sudo ln -s /etc/nginx/sites-available/load-balancer /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

### 17. Docker Container Monitoring
```bash
docker stats
```