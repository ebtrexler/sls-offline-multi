# sls-offline-multi

> A wrapper for `serverless-offline` that allows multiple lambda instances to be run concurrently with watch functionality. This is achieved using `concurrently` and `nodemon`.

This package was originally forked from [https://github.com/isitgeorge/serverless-offline-multi](https://github.com/isitgeorge/serverless-offline-multi) and adapted to place all configuration in a single `yml` file

## Prerequisites

You'll need `serverless` and `nodemon` (optionally, for watch-restarts) installed globally, and `serverless-offline` installed into your project before running this wrapper.

## Install

```bash
npm install -g sls-offline-multi
```

## Usage

From the project root directory, run:

```bash
sls-offline-multi
```

The project root directory must have a file named `sls-offline-multi-compose.yml` with the following structure:

```yaml
stage: local
services:
  serviceName1:
    path: src/service-1
    port: 3002
    watch: true
  serviceName2:
    path: src/service-2
    port: 3004
    watch: false
```

Your service lambdas' are given by the `path` parameters under each of the services.  `port` chooses the `httpPort` for the lambda, and the `lambdaPort = port + 1000`.  If you want the lambda to run under `nodemon` and restart upon code changes (to `js or yml`), set `watch = true`. Each service lambda subfolder must have a `serverless.yml` to describe its deployment configuration.

`stage` defaults to `local` if not specified

Example:

```bash
.
├── sls-offline-multi-compose.yml
├── src
│   ├── service1
│   │   ├── messageProducer.js
│   │   ├── messageConsumer.js
│   │   └── serverless.yml
│   ├── service2
│       ├── messageProducer.js
│       ├── messageConsumer.js
│       └── serverless.yml
├── package-lock.json
├── package.json
├── sqs-mock
    ├── docker-compose.yml
    └── elasticmq.conf

```

## Contributing

Contributions are very welcome, and we will gladly merge in features/bug fixes.

## License

[MIT](LICENSE)
