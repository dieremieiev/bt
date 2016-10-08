# Model

- Message
    - text
- User
    - email/password
    - state
- Bot
    - code
    - state

# Use case

- login/logout
- load/save state
- create/deploy/start/stop/remove bot

# Components

- user auth
- bot rest API (will be used by messenger)
- bot state storage
- user state storage
- script executor
- our bot farm rest API (login, logout, create, deploy, start, stop, etc.)

# Tech
- Java 8/Spring IO
- Docker (deployment)
- Cassandra
- messaging and load balancing? (not for now)

# Steps

1. prject skeleton (create project, download libs, etc.)
2. setup docker
3. design db schema
4. our bot farm rest API
   - login/logout
   - user state
   - create
   - deploy
   - start/stop
   - remove
5. bot rest API
6. script executor (google cloud functions?)
