# p-graph

Promise graph with concurrency control, built on top of the excellent [p-queue](https://github.com/sindresorhus/p-queue) library.

## Install

```
$ npm install p-graph
```

## Usage

The p-graph library takes in a `graph` and an `options` argument. To start, create a graph of functions that return promises (let's call them Run Functions), then run them through the pGraph API:

```js
const { default: pGraph } = require("p-graph"); // ES6 import also works: import pGraph from 'p-graph';

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

await pGraph(graph, { concurrency: 3 }).run(); // returns a promise that will resolve when all the tasks are done from this graph in order
```

### Ways to define a graph

1. Use a dependency array

```js
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

await pGraph(graph);
```

2. Use a dependency array with a list of named functions

```js
const funcs = new Map();

funcs.set("putOnShirt", () => Promise.resolve("put on your shirt"));
funcs.set("putOnShorts", () => Promise.resolve("put on your shorts"));
funcs.set("putOnJacket", () => Promise.resolve("put on your jacket"));
funcs.set("putOnShoes", () => Promise.resolve("put on your shoes"));
funcs.set("tieShoes", () => Promise.resolve("tie your shoes"));

const graph = [
  [putOnShoes, tieShoes],
  [putOnShirt, putOnJacket],
  [putOnShorts, putOnJacket],
  [putOnShorts, putOnShoes],
];

await pGraph(namedFunctions, graph);
```

3. Use a dependency map with a list of named functions

```js
const funcs = new Map();

funcs.set("putOnShirt", () => Promise.resolve("put on your shirt"));
funcs.set("putOnShorts", () => Promise.resolve("put on your shorts"));
funcs.set("putOnJacket", () => Promise.resolve("put on your jacket"));
funcs.set("putOnShoes", () => Promise.resolve("put on your shoes"));
funcs.set("tieShoes", () => Promise.resolve("tie your shoes"));

const depMap = new Map();

depMap.set(tieShoes, new Set([putOnShoes]));
depMap.set(putOnJacket, new Set([putOnShirt, putOnShorts]));
depMap.set(putOnShoes, new Set([putOnShorts]));
depMap.set(putOnShorts, new Set());
depMap.set(putOnShirt, new Set());

await pGraph(namedFunctions, graph);
```

### Using the ID as argument to the same function

In many cases, the jobs that need to run are the same where the only difference is the arguments for the function. In that case, you can treat the IDs as arguments as they are passed into the Run Function.

```ts
type Id = unknown;
type RunFunction = (id: Id) => Promise<unknown>;
```

As you can see, the ID can be anything. It will be passed as the argument for your Run Function. This is a good option if having a large number of functions inside a graph is prohibitive in memory sensitive situations.

```js
const funcs = new Map();
const thatImportantTask = (id) => Promise.resolve(id);

funcs.set("putOnShirt", thatImportantTask);
funcs.set("putOnShorts", thatImportantTask);
funcs.set("putOnJacket", thatImportantTask);
funcs.set("putOnShoes", thatImportantTask);
funcs.set("tieShoes", thatImportantTask);
```

## Scopes and filtering

After a graph and option are sent to the `pGraph` function, the graph is executed with the `run()` function. The `run()` takes in an argument that lets you filter which tasks to end. This allows you to run tasks up to a certain point in the graph.

```js
// graph is one of the three options up top
// depMap is the dependency map where the key is the ID for the Run Function
//   - the ID CAN be the Run Function itself if graph is specified as the dependency array format
await pGraph(graph).run((depMap) => {
  return [...depMap.keys()].filter((id) => id.startsWith("b"));
});
```

## Options

All the options are exactly the same as [the options from p-queue](https://www.npmjs.com/package/p-queue#options). The main one of interest is probably `concurrency`. The feature from `p-queue` is that it can do priority queuing while p-graph currently does not take in an option per task to have specific priority associated.
