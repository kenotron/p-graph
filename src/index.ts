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
  options: Options<QueueType, EnqueueOptionsType>
);

function pGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
>(graph: DepGraphArray, options: Options<QueueType, EnqueueOptionsType>);

function pGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
>(...args: any[]) {
  if (args.length < 2 || args.length > 3) {
    throw new Error("Incorrect number of arguments");
  }

  if (args.length === 2) {
    const options = args[1] as Options<QueueType, EnqueueOptionsType>;

    if (!Array.isArray(args[0])) {
      throw new Error(
        "Unexpected graph definition format. Expecting graph in the form of [()=>Promise, ()=>Promise][]"
      );
    }

    const depArray = args[0] as DepGraphArray;
    const namedFunctions = depArrayToNamedFunctions(depArray);
    const graph = depArrayToMap(depArray);
    return new PGraph(namedFunctions, graph, options);
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
}

exports = pGraph;
export default pGraph;
