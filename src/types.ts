export type RunFunction = (id: Id) => Promise<unknown>;
export type Id = unknown;
export type NamedFunctions = Map<Id, RunFunction>;
export type DepGraphMap = Map<Id, Set<Id>>;
export type ScopeFunction = (graph: DepGraphMap) => Id[];
export type DepGraphArray = [RunFunction, RunFunction][];
