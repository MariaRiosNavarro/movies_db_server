# Server for the [movie_db_frontend](https://github.com/MariaRiosNavarro/movies_db_frontend) -> Fullstack Movie Database

Welcome to the Full Stack Movie Database project, built in Backend with Express & MongoDB. This application includes a self-hosted server and utilizes a MongoDB database with two collections: 'movies' and 'favorites.' Seamlessly integrated into the project are all CRUD (Create, Read, Update, Delete) operations for efficient data management.

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

Props of one USER POST

![movie](/assets/img/dataProps.png)

Props of one original Document

![movie](/assets/img/dataProps.png)
