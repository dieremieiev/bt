# start/stop docker
sudo service docker start
sudo service docker status
sudo service docker stop

# stop/remove all of docker containers
docker images -a
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")

# build
docker build -t bt .

# start
docker run --name=bt-cassandra -it cassandra
docker run -it -p 8080:8080 --link=bt-cassandra bt
