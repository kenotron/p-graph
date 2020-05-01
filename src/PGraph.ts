import { RunFunction, Queue } from "p-queue/dist/queue";
import PQueue, {
  QueueAddOptions,
  DefaultAddOptions,
  Options,
} from "p-queue/dist";
import PriorityQueue from "p-queue/dist/priority-queue";
import { NamedFunctions, DepGraph, ScopeFunction, Id } from "./types";

export class PGraph<
  QueueType extends Queue<RunFunction, EnqueueOptionsType> = PriorityQueue,
  EnqueueOptionsType extends QueueAddOptions = DefaultAddOptions
> {
  private promises: Map<Id, Promise<unknown>> = new Map();
  private q: PQueue;
  namedFunctions: NamedFunctions;
  graph: DepGraph;

  constructor(
    namedFunctions: NamedFunctions,
    graph: DepGraph,
    options?: Options<QueueType, EnqueueOptionsType>
  ) {
    this.promises = new Map();
    this.q = new PQueue(options);
    this.namedFunctions = namedFunctions;
    this.graph = graph;
  }

  /**
   * Runs the promise graph with scoping
   * @param scope
   */
  run(scope?: ScopeFunction) {
    const scopedPromises = scope
      ? scope(this.graph).map((id) => this.execute(id))
      : [...this.graph.keys()].map((id) => this.execute(id));

    return Promise.all(scopedPromises);
  }

  private execute(id: Id) {
    if (this.promises.has(id)) {
      return this.promises.get(id);
    }

    let execPromise: Promise<unknown> = Promise.resolve();

    const deps = this.graph.get(id);

    if (deps) {
      execPromise = execPromise.then(() =>
        Promise.all([...deps].map((depId) => this.execute(depId)))
      );
    }

    execPromise = execPromise.then(() =>
      this.q.add(() => this.namedFunctions.get(id)(id))
    );

    this.promises.set(id, execPromise);

    return execPromise;
  }
}
