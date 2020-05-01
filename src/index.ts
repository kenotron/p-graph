import { Options, Queue, QueueAddOptions, DefaultAddOptions } from "p-queue";
import PriorityQueue from "p-queue/dist/priority-queue";
import { RunFunction } from "p-queue/dist/queue";
import { DepGraphArray, NamedFunctions, DepGraphMap } from "./types";
import { PGraph } from "./PGraph";
import { depArrayToNamedFunctions, depArrayToMap } from "./depConverters";

function pGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
>(
  namedFunctions: NamedFunctions,
  graph: DepGraphMap,
  options?: Partial<Options<QueueType, EnqueueOptionsType>>
);

function pGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
>(
  namedFunctions: NamedFunctions,
  graph: DepGraphArray,
  options?: Partial<Options<QueueType, EnqueueOptionsType>>
);

function pGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
>(
  graph: DepGraphArray,
  options?: Partial<Options<QueueType, EnqueueOptionsType>>
);

function pGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
>(...args: any[]) {
  if (args.length < 1 || args.length > 3) {
    throw new Error("Incorrect number of arguments");
  }

  let namedFunctions: NamedFunctions;
  let graph: DepGraphMap;
  let options: Partial<Options<QueueType, EnqueueOptionsType>>;

  if (args.length === 1) {
    if (!Array.isArray(args[0])) {
      throw new Error(
        "Unexpected graph definition format. Expecting graph in the form of [()=>Promise, ()=>Promise][]"
      );
    }

    const depArray = args[0] as DepGraphArray;
    namedFunctions = depArrayToNamedFunctions(depArray);
    graph = depArrayToMap(depArray);
    options = {};
  } else if (args.length === 2) {
    if (Array.isArray(args[0])) {
      const depArray = args[0] as DepGraphArray;
      namedFunctions = depArrayToNamedFunctions(depArray);
      graph = depArrayToMap(depArray);
      options = {};
    } else if (args[0] instanceof Map && Array.isArray(args[1])) {
      const depArray = args[1] as DepGraphArray;
      namedFunctions = args[0];
      graph = depArrayToMap(depArray);
      options = {};
    } else if (args[0] instanceof Map && args[1] instanceof Map) {
      namedFunctions = args[0];
      graph = args[1];
      options = {};
    } else if (Array.isArray(args[0])) {
      const depArray = args[0] as DepGraphArray;
      namedFunctions = depArrayToNamedFunctions(depArray);
      graph = depArrayToMap(depArray);
      options = args[1];
    } else {
      throw new Error("Unexpected arguments");
    }
  } else {
    const options = args[2] as Options<QueueType, EnqueueOptionsType>;
    const namedFunctions = args[0] as NamedFunctions;
    let graph: DepGraphMap;

    if (Array.isArray(args[1])) {
      graph = depArrayToMap(args[1]);
    } else {
      graph = args[1];
    }

    const pGraph = new PGraph(namedFunctions, graph, options);
    pGraph.namedFunctions = args[0];
    pGraph.graph = args[1];

    return pGraph;
  }

  return new PGraph(namedFunctions, graph, options);
}

export default pGraph;
