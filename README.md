# 1 Brand GraphQL Gateway Server

## Description

[Nest](https://github.com/nestjs/nest)
[Nest GraphQL](https://github.com/nestjs/graphql)
PostgreSQL 10
Docker, Docker Compose, & Make

## Local development
### Initial Setup

```bash
$ make
```

### Continued development
Starting the container & app
```bash
$ make compose-up
```

Stopping the container & app
```bash
$ make compose-down
```

### Running migrations
```bash
$ make migrate-up
```

## Yarn commands for starting the app

```bash
# docker compose
$ make compose-up

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Database migrations

Database migrations for this app use [golang-migrate/migrate](https://github.com/golang-migrate/migrate) command-line utility. To simply run existing migration you do not need to download the dependancy. We are running the migration commands via a docker container. However if you want to generate the files you can download/install it locally following these instructions: [https://github.com/golang-migrate/migrate/tree/master/cli](https://github.com/golang-migrate/migrate/tree/master/cli) and running the following command: `migrate -ext sql -dir sql/migrations -seq -digits 4 <name_of_migration>`

Read more about migration best practices [here](https://github.com/golang-migrate/migrate/blob/master/MIGRATIONS.md)
Read more about cli commands [here](https://github.com/golang-migrate/migrate/tree/master/cli#usage)


### MIgration commands in Makefile

Migrate the initial setup. Requires RDS admin credentials.
```bash
make migrate-init
```

Migrate changes up
```bash
make migrate-up
```

Migate the changes down
```bash
make migrate-down
```

Force migate starting at an existing version
```bash
make migrate-force -v=<migration_version_number>
```