# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/bvfromru/nodejs2022Q4-service.git nodejs2022Q4-service
```

## Switching to development branch and Installing NPM modules

```
cd nodejs2022Q4-service
git checkout dev-part2
npm install
```

## Running application

Rename file `.env.example` to `.env`
Run Docker Desktop and wait for the docker service to start

```
docker-compose up
```

If you have any troubles with Docker, please try to clear all docker images, volumes and containers.
(Clean / Purge data in Troubleshoot section of Docker Desktop)

## Docker security scans

Please use these commands to scan docker images with snyk

```
  npm run scan:app
  npm run scan:postgres
```

## Testing

After application running open new terminal and enter:

To run all tests with authorization checks please use command

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```
