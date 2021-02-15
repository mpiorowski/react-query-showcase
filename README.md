# Deploy using docker-compose
The simplest way, just run this two commands (only docker-compose is needed as prerequisites):

```
sed -i 's/localhost/query-server-dev/' ./client/package.json

docker-compose -f docker-compose.dev.yml up
```

# Deploy using bash

Each service will run in a seperate terminal

## Prerequisites 

node, yarn / npm, docker, docker-compose

## Database

```
cd db && sh start.sh
```
## Server

First create config file

```
cd server && cp .env.dist .env
```

Then, with running database, apply migration:
```
yarn run migrate

# or

npm run migrate
```
Then run the api server
```
yarn && yarn start

# or

npm i && npm start
```
## Client
```
cd client
```
Run the client app
```
yarn && yarn start

# or

npm i && npm start
```
## Access
http://localhost:3000