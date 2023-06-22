# Postgres

## Installation

Install docker desktop [here](https://docs.docker.com/desktop/)
After installation, run the following to get postgres running on local.

```bash
$ DOCKER_BUILDKIT=1 docker build -t postgres .
$ docker run -p 5432:5432 -e POSTGRES_USER=$POSTGRES_USER -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_DB=$POSTGRES_DB postgres
```

Above, the $POSTGRES_USER is an environment variable in linux/mac,
in windows you can sub in the actual values or use %POSTGRES_USER% to sub in.