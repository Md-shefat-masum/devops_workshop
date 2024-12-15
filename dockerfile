FROM node:14

WORKDIR /var/www/basic_node_app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 6001

CMD ["node", "app.js"]