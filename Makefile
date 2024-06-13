build: build-micro-front-kfc

build-micro-front-kfc:
	docker build -t kfcregistry.azurecr.io/integrations-aggregators/micro-front-kfc:latest -f ./Dockerfile .

push-login:
	docker login kfcregistry.azurecr.io --username kfcregistry --password pMZb5sKcjLnx2bXNN3Ka0D4t5htoH7+R

push-micro-front-kfc:
	docker push kfcregistry.azurecr.io/integrations-aggregators/micro-front-kfc:latest

push: push-login push-micro-front-kfc