import { Options, Queue, QueueAddOptions, DefaultAddOptions } from "p-queue";
import PriorityQueue from "p-queue/dist/priority-queue";
import { RunFunction } from "p-queue/dist/queue";
import { NamedFunctions, DepGraph } from "./types";
import { PGraph } from "./PGraph";

export function pGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
>(
  namedFunctions: NamedFunctions,
  graph: DepGraph,
  options: Options<QueueType, EnqueueOptionsType>
) {
  return new PGraph(namedFunctions, graph, options);
}
