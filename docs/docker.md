# start/stop docker
sudo service docker start
sudo service docker status
sudo service docker stop

# stop/remove all of docker containers
docker images -a
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images | grep '^<none>' | awk '{print $3}')
docker rmi $(docker images | grep '^bt[^-]' | awk '{print $3}')

# build
cd docs/java8
docker build -t bt-ubuntu-java8 .
cd ../..
docker build -t bt .

# start
docker run --name bt-cassandra -v /home/tvv/w/tvv/bt/work/bt/data:/var/lib/cassandra -it --rm cassandra
docker run --link bt-cassandra -p 8080:8080 -it --rm bt

# cqlsh
docker run --link bt-cassandra -it --rm cassandra sh -c 'exec cqlsh "$BT_CASSANDRA_PORT_9042_TCP_ADDR"'

# env
docker run --link bt-cassandra -p 8080:8080 -it --rm bt sh -c 'exec env'
