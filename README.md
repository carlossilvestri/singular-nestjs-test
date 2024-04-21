<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

1. Clone the repository:

   `git clone https://github.com/carlossilvestri/singular-nestjs-test.git`

2. Open a terminal in the repository API folder:

   `cd singular-nestjs-test`
3. Copy the `.env.docker` file to `.env` in the same root folder:

4. Run application using Docker (You need docker installed in your computer):

   `docker-compose up --build`
   
5.- Open a web browser, go to http://localhost:8080/docs to see Swagger Doc, create a user using endpoint auth/signup 

## Project configuration

1. Copy the `.env.docker` file to `.env` in the same root folder:

   `cp .env.docker .env`

2. As it is, it should work, but you can change these parameters:

   - `ACCESS_TOKEN_EXPIRATION`: expiration time of the JWT access token
   - `REFRESH_TOKEN_EXPIRATION`: expiration time of the JWT refresh token
   - `JWT_SECRET`: secret key used by JWT to encode access token
   - `JWT_REFRESH_SECRET`: secret key used by JWT to encode refresh token
   - `NESTJS_PORT`: port used by the API

## Database configuration

1. In the root of the API project, edit the file `.env` and configure these parameters using your Postgres configuration.

   ```
   POSTGRES_NAME=template
   POSTGRES_PORT=5432
   POSTGRES_PASSWORD=templateUserPass
   POSTGRES_USER=templateUser
   POSTGRES_HOST=db
   ```

2. Start the database with docker

```
$ npm run infra:up
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e

```

### Migrations.

To create a migration and implement changes in the db.

//**run old migrations, this project by default has a user migration**

```
$ npm run migration:run
```

//generate a migration

```
$ npm run migration:generate name_new_migration
```

//run the migration

```
$ npm run migration:run
```

## Documentation

This template uses swagger for documentation.
To see swagger, if you are using port 8080 for the api, it would be for example => localhost:8080/docs

## Endpoint security

This template uses jwt tokens and refresh tokens.

To make a route public for everyone you have to add the @Public decorator above the endpoint. Example, users.controller.ts / endpoint post, /users.

We can put three types of validations on the endpoints.

- That it has a valid token, access-token.
- That it has a valid token and is role x, example delete user can only be done by the admin role, Roles decorator.
- That the refresh token is valid.

## How refresh tokens work

The access token has to have a short lifetime, while the refresh token has to have a longer lifetime. (you can modify the duration by modifying the project variables).

When logging in, it returns the two tokens.
The refresh token is encrypted in the database, and is reset every time the user logs in or out.

When an access token expires, the endpoint will return a custom error.
httpStatus = 498
message = Token expired

In this case, a request must be made to auth/refresh-token that contains the refresh token in the header. This will return a valid access token.
