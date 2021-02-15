# Deploy using docker-compose
The simplest way, just run this two commands (only docker-compose is needed as prerequisites):

```
sed -i 's/localhost/query-server-dev/' ./client/package.json

docker-compose -f docker-compose.dev.yml up
```

# Deploy using bash

Each service will run in a seperate terminal

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