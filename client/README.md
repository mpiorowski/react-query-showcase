This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

# Development build

## Prerequisites 

node, npm, docker, docker-compose

## Database

```
cd db && sh start.sh
```
## Server

```
cd server
```
First create config file
```
cp .env.dist .env
```
Then, with running database, apply migration:
```
npm run migrate

# or

yarn run migrate
```
Then run the api server
```
npm i && npm start

# or

yarn && yarn start
```
## Client
```
cd client
```
Run the client app
```
npm i && npm start

# or

yarn && yarn start
```
## Access
http://localhost:3000