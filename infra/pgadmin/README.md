# PGAdmin

## Installation

Install docker desktop [here](https://docs.docker.com/desktop/) 
After installation, run the following to get pgadmin running on local.

Change PGADMIN_USER and PGADMIN_PASSWORD below with whatever you wish (on local - for prod ask me).
```bash
$ DOCKER_BUILDKIT=1 docker build -t pgadmin .
$ docker run -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=$PGADMIN_USER -e PGADMIN_DEFAULT_PASSWORD=$PGADMIN_PASSWORD  pgadmin
```

## Connecting to your postgres instance

Obv go to postgres and follow the steps to get postgres up and running on your local.

Once done, login to pgadmin on port 5050 (localhost:5050) using the email and password you used above. (remove the < and >)

Once logged in, under servers, click Register -> Server.  Enter the following information depending on where you're trying to connect.

If you're trying to connect your local postgres, use the following property values.

| Tab | Property | Value | 
| --- | -------- | ----- |
| General | Name | <whatever you wish> |
| Connection | Host name/address | docker.host.internal |
| Connection | user | << user >> |
| Connection | password | << password >> |


If you're trying to connect your our postgres on render, use the following property values.

| Tab | Property | Value | 
| --- | -------- | ----- |
| General | Name | <whatever you wish> |
| Connection | Host name/address | ask |
| Connection | user | $PGADMIN_USER |
| Connection | password | $PGADMIN_PASSWORD |

