# Devops Workshop

---

# Table of Contents

1. **Prepare VPS**  
   1.1 Setting Up the VPS Environment  
   1.2 Initial Server Configuration  

2. **Install Required Software**  
   2.1 Install PHP  
   2.2 Install Node.js  
   2.3 Install MongoDB  
   2.4 Install MySQL  

3. **Database Configuration**  
   3.1 Connect with DB-Weaver  
   3.2 Verify Database Connections  

4. **Run a Node.js Project**  
   4.1 Setting Up the Project  
   4.2 Running the Application  

5. **Create APIs**  
   5.1 API to Manage Data in MongoDB  
   5.2 API to Manage Data in MySQL  

6. **Setup Apache**  
   6.1 Configure Apache for Project Hosting  
   6.2 Live Testing  

7. **Production Readiness**  
   7.1 List and Resolve Problems in Production  

8. **Setup CI/CD with GitHub Actions**  
   8.1 Basic CI/CD Workflow  
   8.2 Automating Builds and Deployments  

9. **Server Monitoring**  
   9.1 Tools and Techniques for Monitoring  

10. **Docker Basics**  
    10.1 Concepts: Image, Container, Volume, Network, compose 
    10.2 Run Your First Project Through Docker  

11. **Implement Docker Concepts**  
    11.1 Apply Basic Docker Concepts to Your Project  
    11.2 Implement Continuous Integration and Deployment (CID)  

12. **Setup Load Balancer**  
    12.1 Configuring Load Balancing  
    12.2 Testing Load Distribution  

13. **Docker Container Monitoring**  
    13.1 Tools and Practices for Monitoring Docker Containers  

14. **Conclusion**  
    14.1 Summary of Accomplishments  
    14.2 Next Steps  

---

Here is the step-by-step code for each task:

### 1. Prepare VPS
```bash
# Update and upgrade the VPS
sudo apt update && sudo apt upgrade -y
```

---

### Install nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 2. Install PHP
```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```
```bash
sudo apt install php8.3 php8.3-fpm php8.3-cli php8.3-mysql php8.3-curl php8.3-mbstring php8.3-xml php8.3-zip php8.3-gd php8.3-soap php8.3-bcmath -y
```
```bash
sudo systemctl start php8.3-fpm
sudo systemctl enable php8.3-fpm
sudo systemctl status php8.3-fpm
```
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```
```bash
php -v
composer --version
```

---

### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

### 4. Install MongoDB
```bash
sudo apt install software-properties-common gnupg apt-transport-https ca-certificates -y
curl -fsSL https://pgp.mongodb.com/server-7.0.asc |  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse
sudo apt update
sudo apt install mongodb-org -y
mongod --version
sudo systemctl start mongod
sudo systemctl enable mongod
```

```bash
mongosh
use workshop_devops
db.createCollection("users")
show collections
db.users.insertMany([
    { name: "Abdullah al" },
    { name: "Mubassir" },
    { name: "Sakin" }
]);
db.workshop_devops.find().pretty();
```

---

### 5. Install MySQL
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql.service
```
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';
exit
```
```
```bash
mysql -u your_username -p

SHOW DATABASES;

CREATE DATABASE workshop_devops;

USE workshop_devops;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO users (name) 
VALUES 
  ('Abdullah'),
  ('Mobassir'),
  ('Sakin');

SELECT * FROM users;
```

---

### 6. Connect with work bench and mongodb compass
```bash
# Configure MySQL for remote access
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
bind-address            = 0.0.0.0
sudo ufw allow 3306
allowPublicKeyRetrieval = true
sudo systemctl restart mysql

# Allow remote user
mysql -u root -p
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'DBsql$#%12345678';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```
restrict access to a specific IP (your local PC's IP)
```bash
CREATE USER 'remote_user'@'local-pc-ip' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'local-pc-ip' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
mongo DB
```bash
sudo nano /etc/mongod.conf
bindIp:   0.0.0.0
sudo ufw allow 27017
```

---

### 7. Run a Node Project
create a directory opend directory into vs code follow the instructions.
package.json

```bash
{
  "name": "node-mongo-mysql-project",
  "version": "1.0.0",
  "description": "A Node.js project with MongoDB and MySQL integrations",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "keywords": [
    "nodejs",
    "mongodb",
    "mysql",
    "api"
  ],
  "author": "Shefat",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.3.0",
    "mongoose": "^7.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

```bash
npm install
```

---

### 8. Create Two APIs
#### MongoDB Example:
```javascript
// app.js
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/workshop_devops');

const app = express();
app.use(express.json());

const dataSchema = new mongoose.Schema({ name: String });
const Data = mongoose.model('User', dataSchema);

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

```bash
node app.js
```

#### MySQL Example:
```javascript
// app.js
const mysql = require('mysql2/promise');
mysql.createConnection({ host: 'localhost', user: 'root', password: '12345678', database: 'workshop_devops' })
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
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
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

Here are some problems in project deployments that Docker can address:

1. **Inconsistent Development Environments**
2. **Dependency Conflicts**
3. **Difficulties in Scaling**
4. **Complexity in Managing Multiple Services**
5. **Lack of Environment Replication**
6. **Version Incompatibility**
7. **Server Configuration Issues**
8. **Manual Configuration and Deployment Errors**
9. **Difficulties in Continuous Integration/Continuous Deployment (CI/CD)**
10. **Resource Isolation and Efficiency**
11. **Application Portability**
12. **Difficulty in Rollbacks**
13. **Performance Variations Across Environments**
14. **Security Risks Due to Outdated Software**
15. **Lack of Monitoring and Logging in Production**
16. **Difficulty in Multi-Cloud or Hybrid Cloud Deployments**
17. **Service Discovery and Networking Complexity**
18. **Time-Consuming Debugging in Production**

Docker helps mitigate these issues by providing containerization, isolation, and reproducibility across environments. 

---

### 11. Setup CI/CD with GitHub Actions
https://github.com/Md-shefat-masum/html-hello-project

### 12. Server Monitoring
```bash
sudo apt install htop
htop
```
docker-compose.yml
```bash
version: '3.7'
services:
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      
  node_exporter:
    image: quay.io/prometheus/node-exporter:latest
    container_name: node_exporter
    command:
      - '--path.rootfs=/host'
    network_mode: host
    pid: host
    restart: unless-stopped
    volumes:
      - '/:/host:ro,rslave'

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

prometheus.yml
```bash
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['103.191.240.173:9100']

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
#### Setup CICD:
https://github.com/Md-shefat-masum/html-hello-project

---

### 16. Setup Load Balancer
#### Install Nginx:
php nginx.conf
```bash
events {}

http {
    upstream php_project {
        server php_app1:9000;
        server php_app2:9000;
        server php_app3:9000;
        server php_app4:9000;
        server php_app5:9000;
    }

    server {
        listen 80;
        root /var/www/html;

        index index.php;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass php_project;
            fastcgi_param SCRIPT_FILENAME /var/www/html$fastcgi_script_name;
            include fastcgi_params;
        }

        error_log  /var/log/nginx/error.log;
    }
}


```
dockerfile
```
# Use an official PHP image with FPM (FastCGI Process Manager) support
FROM php:7.4-fpm

# Install necessary PHP extensions
RUN apt-get update && apt-get install -y \
    nginx \
    && apt-get clean

# Set the working directory
WORKDIR /var/www/html

# Copy the source code into the container
COPY src/ /var/www/html/

# Expose port 80 for Nginx and 9000 for PHP
EXPOSE 80 9000

# Start both PHP-FPM and Nginx in the foreground
CMD service nginx start && php-fpm -F
```
docker-compose.yml
```
``version: '3.7'
services:
  php_app1:
    build:
      context: .
    volumes:
      - ./src:/var/www/html
    expose:
      - "9000"

  php_app2:
    build:
      context: .
    volumes:
      - ./src:/var/www/html
    expose:
      - "9000"

  php_app3:
    build:
      context: .
    volumes:
      - ./src:/var/www/html
    expose:
      - "9000"

  php_app4:
    build:
      context: .
    volumes:
      - ./src:/var/www/html
    expose:
      - "9000"

  php_app5:
    build:
      context: .
    volumes:
      - ./src:/var/www/html
    expose:
      - "9000"

  nginx:
    image: nginx:latest
    ports:
      - "8081:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - php_app1
      - php_app2
      - php_app3
      - php_app4
      - php_app5
---

### 17. Docker Container Monitoring
```bash
docker stats
```
