import { describe, it, expect } from "vitest";
import { orchestrate } from "../index";

describe("orchestrate", () => {
  it("executes tasks in order and returns results", () => {
    const results = orchestrate([
      () => 1,
      () => 2,
      () => 3,
    ]);
    expect(results).toEqual([1, 2, 3]);
  });

  it("returns an empty array for no tasks", () => {
    const results = orchestrate([]);
    expect(results).toEqual([]);
  });
});
