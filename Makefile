.PHONY: build test coverage
current_dir := $(shell pwd)
user_id := $(shell id -u)
command_migrate := truffle migrate --network dockerCompose --reset
command_test := truffle test --network dockerCompose
command_solium := solium -d contracts/

build:
	docker-compose build --build-arg user_id=$(user_id)
	docker-compose run --rm --name xeh contracts \
		npm install

test:
	docker-compose run --rm --name xeh --service-ports contracts  \
		/bin/bash -c "$(command_solium) && $(command_migrate) && $(command_test)"
	docker-compose rm --stop --force

clean:
	-docker-compose down --rmi all
