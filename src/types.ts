export type RunFunction = (id: Id) => Promise<unknown>;
export type Id = string | number;
export type NamedFunctions = Map<Id, RunFunction>;
export type DepGraph = Map<Id, Set<Id>>;
export type ScopeFunction = (graph: DepGraph) => Id[];
