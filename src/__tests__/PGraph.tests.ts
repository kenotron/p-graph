import { PGraph } from "../PGraph";
import { NamedFunctions, DepGraph } from "../types";

describe("PGraph", () => {
  it("should allow a full graph to be created", async () => {
    const fns: NamedFunctions = new Map();
    const graph: DepGraph = new Map();

    const mockFn = jest.fn((id) => Promise.resolve());

    fns.set("fn1", mockFn);
    fns.set("fn2", mockFn);

    graph.set("fn1", new Set(["fn2"]));

    const pGraph = new PGraph(fns, graph);
    await pGraph.run();

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, "fn2");
    expect(mockFn).toHaveBeenNthCalledWith(2, "fn1");
  });
});
