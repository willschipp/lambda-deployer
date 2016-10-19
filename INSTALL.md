# Installation


### Requirements

- Linux VM (Centos, Ubuntu, etc.)
- Docker
- Weave

### Steps

- setup Docker
- deploy weave proxy and weave router

```weave launch-proxy -H tcp://0.0.0.0:12375 -H unix:///var/run/weave/weave.sock```

*optional
- pull iron/node:latest and iron/node:dev images

### App setup

- deploy lambda router --> make sure it's on the weave-router
- deploy lambda deployer
