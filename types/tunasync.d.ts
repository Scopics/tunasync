interface Config {
  retries?: number;
  interval?: number;
  multiplier?: number;
  cacheSize: number;
  exponential?: boolean;
  isCb?: boolean;
  parallel: boolean;
  onAttemptFail?: Function;
}

export class AsyncEmitter {
  events: MapConstructor;
  wrappers: MapConstructor;
  on(name: string, fn: Function): void;
  onTemporary(name: string, fn: Function, timeout: number): void;
  once(name: string, fn: Function): void;
  emit(name: string, ...args: Array<any>): Promise<void>;
  remove(name: string, fn: Function): void;
  clear(name: string): boolean;
  listeners(name: string): Array<Function>;
  count(name: string): number;
  names(): Array<string>;
}

export class Queue {
  tasks: Array<Function>;
  onDone(result: any): any;
  pushTask(fn: Function, args?: Array<any>): Queue;
  done(fn: Function): Queue;
  doTasks(): Promise<any>;
}

export function queue(): Queue;

export function asyncMemoize(fn: Function, config?: Config): Function;

export function retry(
  fn: Function,
  args?: Array<any>,
  config?: Config
): Promise<any>;

export function series(
  fns: Array<Function>,
  done: Function,
  config?: Config
): void;

export function reduce(
  fn: Function,
  startValue: number,
  arr?: Array<any>,
  config?: Config
): Promise<any>;

export function map(
  fn: Function,
  arr?: Array<any>,
  config?: Config
): Promise<Array<any>>;

export function some(
  fn: Function,
  arr?: Array<any>,
  config?: Config
): Promise<boolean>;
