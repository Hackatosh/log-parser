# Log Parser

Welcome to the Log Parser repository !

The Log Parser aims to parse HTTP access log files and display statistics and alerts related to their contents.

## Getting started

### Prerequisites

Before being able to run this project, you need to have :
* [NodeJS v14](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)

Those will allow you to install the dependencies needed for this project and run it.

### Installing

To install the project dependencies, you need to use yarn :

```
yarn install --frozen-lockfile
```

### Running the project

You can directly run the project with ts-node using the following command :

```
yarn start:dev
```

Or, you can build the project using Typescript and then run the compiled version with the following commands :

```
yarn build

yarn start:compiled
```

### Dev commands

You can build the project using Typescript, to verify type checking, with this command :

```
yarn build
```

You can run the unit tests using Jest with this command :

```
yarn test
```

You can lint the project with ES Lint using this command :

```
yarn lint
```

You can fix automatically linting errors using this command :

```
yarn lint:fix
```

## The project

### Features

### Built with

### Architectures choices

### Possible improvements