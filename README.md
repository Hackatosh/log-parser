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

Options can be passed to the software as follow :
```
yarn start:dev --alertRpsThreshold <number> --logFilePath <absolute_path_to_log_file>
```

- `alertRpsThreshold` indicates the number of the request per second needed to trigger an alert (default to 10)
- `logFilePath` indicates the absolute path to the log file (if not provided, the `sample_csv.txt` file will be read)

### Demonstration

I recommend to try the software with the following commands :

```
yarn start:dev --alertRpsThreshold 1

yarn start:dev --logFilePath resources/trigger_alert.txt
```

The first one shows lots of statistics (and one alert).
The second one shows the alert being fired, resolved and fired again.

### Dev commands

To type check the code, you need to build the project with this command :

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

The software is able to :
- Read and parse a csv file which contains access logs, without any file size restriction.
- Display an alert message when the number of requests exceed the configured request per second threshold on average for 2 minutes.
Alert is not fired again until it is resolved, which will happen when the number of requests goes below the previous limit.
- Display statistics about request (number of hits per section, per request, per status and total) every 10s.

A basic working CI pipeline has been configured for the repository and automatically build, unit test and lint the codebase.

### Built with

The whole project is written in [Typescript](https://www.typescriptlang.org/docs/home.html). The package management is done with [Yarn](https://yarnpkg.com/).

**Run-time**
* [NodeJS](https://nodejs.org/en/docs/) - Server-side JavaScript runtime environment

**Packages used**
* [split2](https://www.npmjs.com/package/split2) - Break up a file stream and reassemble it so that each line is a chunk
* [minimist](https://www.npmjs.com/package/minimist) - Parse arguments
* [moment](https://www.npmjs.com/package/moment) - Date library for parsing, validating, manipulating, and formatting dates

**Tooling**
* [Jest](https://jestjs.io/) - Javascript testing framework
* [ESLint](https://eslint.org/) -  JavaScript linter

**CI**
* [Github Actions](https://github.com/features/actions) - Github CI/CD workflows

### Architectures choices

The code is composed of 6 basics part :

- The line-by-line file reader which use native fs module and split2 module
- The CSV parser which convert each line of the file into a JS object
- The Statistics Logic which aggregate the csv lines into into one stats report object and decide when this object should be send to the next pipeline's steps 
- The Alerts Logic which manage the high traffic alert state (no alert / fired / resolved)
- The Alerts Display which display message related to alerts (fired/resolved)
- The Statistics Display which display statistics reports

Decomposing the code this way has multiple advantages :
- No coupling between statistics and alerting at all
- Display and logics are clearly separated so you can easily change what you do with the alerts and the reports (as an example, you could send an email instead of displaying the alerts in the console)
- You can change easily the way the logs are obtained (as example, instead of reading of file, you could read from standard input)
- It is very easy to unit test each part
- Code is clearer

In order to be scalable, the software is entirely based on [stream](https://nodejs.org/api/stream.html). Stream allow to process data chunk by chunk (instead of loading everything into the RAM, like you would have to by using Buffer), which allows to treat a number of logs as big as needed.

The CSV Parser, Statistics Logic and Alerts Logic are implemented as Transform Stream and Stats Display and Alerts display are implemented as Writable Stream.

The only limitation to scalability here is the internal state managed by the Stats Logic and the Alert Logic : if you have a huge number of request in a short interval of time, some structure could overflow.

### Possible improvements

**Optimisations :**
- Optimise the methods provided by the TimestampArray object (an array that contains number which are always sorted) used by the Alerting logic (for example with the use of binary search)
- Implement automated "E2E" tests which will read sample csv files and check the outputs of the software

**Features :**
- Implement more interesting way of displaying Statistics Report and Alerts (Slack message, emails...)
- Implement a more sophisticated Alerting Logic (alerts by section, by request status, etc) with different thresholds
- Add more statistics
- Add a configuration to read logs from standard input

## Author

This project was made by Edouard Benauw