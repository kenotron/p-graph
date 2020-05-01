import {
  DepGraphArray,
  NamedFunctions,
  DepGraphMap,
  DepGraphIdArray,
} from "./types";

export function depArrayToNamedFunctions(array: DepGraphArray) {
  const namedFunctions: NamedFunctions = new Map();

  // dependant depends on subject (Child depends on Parent means Child is dependent, Parent is subject)
  for (const [subject, dependent] of array) {
    namedFunctions.set(subject, subject);
    namedFunctions.set(dependent, dependent);
  }
  return namedFunctions;
}

export function depArrayToMap(array: DepGraphIdArray) {
  const graph: DepGraphMap = new Map();

  // dependant depends on subject (Child depends on Parent means Child is dependent, Parent is subject)
  for (const [subjectId, dependentId] of array) {
    if (!graph.has(dependentId)) {
      graph.set(dependentId, new Set([subjectId]));
    } else {
      graph.get(dependentId).add(subjectId);
    }
  }
  return graph;
}
