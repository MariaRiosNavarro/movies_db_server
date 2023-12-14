# Setup

npm init -y

npm i express

npm i mongodb cors dotenv uuid multer

# Config package.json

- in package.json:

"type": "module",

- in package.json in "scripts" add:

"dev": "node --watch app.js"

- create .gitignore file and write inside

```javascript

node_modules/
.vscode/
.env
uploads/

```

- create .env file and write inside

```javascript

PORT=YOURPORT
MONGODB=mongodb://YOURADRESS
DATABASENAME=YOURDBNAME

```

- One Movie has this Propierties

![movie](/assets/img/dataProps.png)
