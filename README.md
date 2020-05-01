# p-graph

Promise graph with concurrency control, built on top of the excellent [p-queue](https://github.com/sindresorhus/p-queue) library.

## Install

```
$ npm install p-graph
```

## Usage

The p-graph library takes in a `graph` and an `options` argument. To start, create a graph of functions that return promises, then run them through the pGraph API:

```js
const pGraph = require("p-graph"); // ES6 import also works: import pGraph from 'p-graph';

const putOnShirt = () => Promise.resolve("put on your shirt");
const putOnShorts = () => Promise.resolve("put on your shorts");
const putOnJacket = () => Promise.resolve("put on your jacket");
const putOnShoes = () => Promise.resolve("put on your shoes");
const tieShoes = () => Promise.resolve("tie your shoes");

const graph = [
  [putOnShoes, tieShoes],
  [putOnShirt, putOnJacket],
  [putOnShorts, putOnJacket],
  [putOnShorts, putOnShoes],
];

pGraph(graph, { concurrency: 3 }); // returns a promise that will resolve when all the tasks are done from this graph in order
```

Another way to specify the graph is by using IDs and dependency
