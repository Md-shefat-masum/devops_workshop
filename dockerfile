FROM node:14

WORKDIR /var/www/basic_node_app

COPY package.json ./

RUN apt-get update \
    && apt-get install -y nginx \
    && apt-get clean \
    && npm install

COPY . .

EXPOSE 80 6001

CMD service nginx start \
    && node app.js