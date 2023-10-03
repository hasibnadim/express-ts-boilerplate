# Express.js Boilerplate (Typescript)

## Enverment Setup

- clone the git repository

### Now install dependencies

> npm install OR yarn install

### Setup database

##### Chack _.env-expample_ file rename it _.env_ add **DATABASE_URL** env variable

> npx prisma db push

### For dev server

> npm run dev OR yarn dev

### For production server

> npm run build & npm start

###### or

> yarn build & yarn start

## Template Docs

### prisma

###### The folder of prismaORM

### public

###### The folder for public resouce. It will provide by http get request

## storage

###### All file will save here as cache, logs, image, video, row file etc

## tmp

###### It is the folder which can be used for temporary file saving.

## views

###### All html template will store here. Which will be used to render webview response.

## src
- The main folder for all souce code
    #### src/config
    All configuration will do here, like passport, database connection, logger, redis, s3, firebase etc.
    #### src/controller
    Controller of routes endpoint. Only controller and middleware can wite on request or response.
    #### src/middleware
    middleware of express.js routes.  Only controller and middleware can wite on request or response.
    #### src/routes
    All route will declare here.
    #### src/utils
    The functions which just get an input and returns output. no query or won't use others service.
    #### src/tools
    Validation schemas or object, sanitizer objects, Events etc. can query or use others service if needs.
    #### src/lib
    The functions and Objects which deals with huge data/resourece or long script or data scraping functionalities or one time used function will store here. can query or use others service
    #### src/core
    All business logic, complex transaction, long proccess and sensitive task will stay here.
        
    - src/core/services <br />
        <i>Main logic getway function or class will declare here</i>
    - src/core/helpers <br />
        <i>The function which helps service on code simplicity or code duplication</i>
    - src/core/queue <br />
        <i>Long proccess which needs too much time at client request-response cycle this task will register here. Exp: sending bulk email or sms </i>
