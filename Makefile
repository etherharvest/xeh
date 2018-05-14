current_dir := $(shell pwd)
user_id := $(shell id -u)

compile:
	docker run --rm --name xeh -v $(current_dir):/app/xeh -it xeh \
		truffle compile

build: package.json
	docker build --rm -t xeh --build-arg user_id=$(user_id) .
	docker run --rm --name xeh -v $(current_dir):/app/xeh -it xeh \
		npm install

tests:
	docker-compose run --rm --name xeh --service-ports xeh  \
		/bin/bash -c "truffle migrate --network compose --reset && truffle test --network compose"

coverage:
	docker-compose run --rm --name xeh --service-ports xeh  \
		/bin/bash -c "truffle migrate --network compose --reset && solidity-coverage --network compose"

clean:
	docker-compose down
	docker rm xeh
	docker rmi xeh
