.DEFAULT_GOAL := dev

########################
## Internal variables
########################
PROJECT_PATH=github.com/permanencelabs/graphql-gateway

## Change src path if build pipeline
ifndef CODEBUILD_SRC_DIR
	POSTGRES_DB=permanencelabs
	POSTGRES_HOST_NAME=127.0.0.1
	POSTGRES_HOST_PORT=5432
	POSTGRES_USER=postgres
	POSTGRES_PASSWORD=postgres
	POSTGRES_APP_USER=onebrand_app_user
	POSTGRES_APP_PASSWORD=olvidar
	POSTGRES_APP_ADMIN_USER=onebrand_app_administrator
	POSTGRES_APP_ADMIN_PASSWORD=olvidar
	POSTGRES_READONLY_USER=onebrand_read_only_user
	POSTGRES_READONLY_PASSWORD=olvidar
	POSTGRES_RDS_ADMIN_USER=
	POSTGRES_RDS_ADMIN_PASSWORD=
else
	MIGRATION_PATH=$(CODEBUILD_SRC_DIR)
endif

ifndef MIGRATION_PATH
	MIGRATION_PATH=/usr/src/app
endif

MIGRATION_DB_URL=postgres://${POSTGRES_APP_ADMIN_USER}:${POSTGRES_APP_ADMIN_PASSWORD}@${POSTGRES_HOST_NAME}:${POSTGRES_HOST_PORT}/${POSTGRES_DB}\?sslmode\=disable\&search_path\=onebrand,public

ifndef POSTGRES_RDS_ADMIN_USER
## if no RDS admin user credentials use local
MIGRATION_INIT_DB_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST_NAME}:${POSTGRES_HOST_PORT}/${POSTGRES_DB}\?sslmode\=disable\&search_path\=onebrand,public
else
	## Database url used for init. Requires the RDS admin user credentials
	MIGRATION_INIT_DB_URL=postgres://${POSTGRES_RDS_ADMIN_USER}:${POSTGRES_RDS_ADMIN_PASSWORD}@${POSTGRES_HOST_NAME}:${POSTGRES_HOST_PORT}/${POSTGRES_DB}\?sslmode\=disable\&search_path\=onebrand,public
endif

########################
## Helpers variables
########################
M=$(shell printf "\033[34;1m▶\033[0m")
TIMESTAMP := $(shell /bin/date "+%Y-%m-%d_%H-%M-%S")

sleep:
	sleep 30

########################
## Start Commands
########################
.PHONY: dev

dev: compose-build dep; $(info $(M) Setting up project development env complete...)

######
## Setup commands
######
.PHONY: setup dep build-server run-server

dep: ; $(info $(M) Ensuring vendored dependencies are up-to-date...)
	sudo docker-compose run --rm app yarn install

######
## Docker Compose commands
######
.PHONY: compose-build compose-up compose-down compose-test

compose-build: compose-down ; $(info $(M) Running application with docker-compose...)
	sudo docker-compose build --no-cache
	sudo docker-compose up -d --force-recreate

compose-up: ; $(info $(M) Running application with docker-compose...)
	sudo docker-compose up -d

compose-down: ; $(info $(M) Stopping application with docker-compose...)
	sudo docker-compose down

compose-test: ; $(info $(M) Running tests with docker-compose...)
	sudo docker-compose run --rm app make test


######
## Database commands
######
.PHONY: migrate-up migrate-preprocess migrate-init migrate-force migrate-down

migrate-preprocess: ;
	mkdir -p ./sql_out
	cp -R ./sql/init ./sql_out/
	POSTGRES_APP_ADMIN_USER=$(POSTGRES_APP_ADMIN_USER); \
	POSTGRES_APP_ADMIN_PASSWORD=$(POSTGRES_APP_ADMIN_PASSWORD); \
	POSTGRES_APP_USER=$(POSTGRES_APP_USER); \
	POSTGRES_APP_PASSWORD=$(POSTGRES_APP_PASSWORD); \
	POSTGRES_READONLY_USER=$(POSTGRES_READONLY_USER); \
	POSTGRES_READONLY_PASSWORD=$(POSTGRES_READONLY_PASSWORD); \
	while read line; \
	do \
		eval echo "$$line"; \
	done < ./sql/init/0003_users.up.sql > ./sql_out/init/0003_users.up.sql

migrate-init: migrate-preprocess;
	docker run --rm -v $(MIGRATION_PATH)/sql_out/init/:/migrations/ --network host migrate/migrate -path=/migrations/ -database=$(MIGRATION_INIT_DB_URL) up

migrate-up: ;
	docker run --rm -v $(MIGRATION_PATH)/sql/migrations/:/migrations/ --network host migrate/migrate -path=/migrations/ -database=$(MIGRATION_DB_URL) up

migrate-down: ;
	docker run --rm -v $(MIGRATION_PATH)/sql/migrations/:/migrations/ --network host migrate/migrate -path=/migrations/ -database=$(MIGRATION_DB_URL) down

## Sets clean version in schema_migrations table.
## Takes param v={{version}} e.g. v=400
migrate-force: ;
	docker run --rm -v $(MIGRATION_PATH)/sql/migrations/:/migrations/ --network host migrate/migrate -path=/migrations/ -database $(MIGRATION_DB_URL) force $(v)

######
## Test commands
######
.PHONY: test

test: ; $(info $(M) Running application tests...)
	yarn test

lint: ; $(info $(M) Running application linter...)
	yarn run lint
