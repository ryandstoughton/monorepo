export function orchestrate<T>(tasks: (() => T)[]): T[] {
  return tasks.map(task => task());
}
