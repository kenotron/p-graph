import { Options, Queue, QueueAddOptions, DefaultAddOptions } from "p-queue";
import PriorityQueue from "p-queue/dist/priority-queue";
import { RunFunction } from "p-queue/dist/queue";
import { DepGraphArray, NamedFunctions, DepGraphMap } from "./types";
import { PGraph } from "./PGraph";

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

    const namedFunctions: NamedFunctions = new Map();
    const graph: DepGraphMap = new Map();

    // dependant depends on subject (Child depends on Parent means Child is dependent, Parent is subject)
    for (const [subject, dependent] of args[0] as DepGraphArray) {
      namedFunctions.set(subject, subject);
      namedFunctions.set(dependent, dependent);

      if (!graph.has(dependent)) {
        graph.set(dependent, new Set([subject]));
      } else {
        graph.get(dependent).add(subject);
      }
    }

    return new PGraph(namedFunctions, graph, options);
  } else {
    const options = args[2] as Options<QueueType, EnqueueOptionsType>;
    const graph = args[1] as DepGraphMap;
    const namedFunctions = args[0] as NamedFunctions;

    const pGraph = new PGraph(namedFunctions, graph, options);
    pGraph.namedFunctions = args[0];
    pGraph.graph = args[1];

    return pGraph;
  }
}

export default pGraph;
