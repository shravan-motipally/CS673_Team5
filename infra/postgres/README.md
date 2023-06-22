# Postgres

## Installation

Install docker desktop [here](https://docs.docker.com/desktop/)
After installation, run the following to get postgres running on local.

```bash
$ DOCKER_BUILDKIT=1 docker build -t postgres .
$ docker run -p 5432:5432 -e POSTGRES_USER=<user> -e POSTGRES_PASSWORD=<password> postgres
```