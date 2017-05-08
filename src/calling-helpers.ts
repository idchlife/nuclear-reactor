import { Reactor } from './reactors';
let initializationComplete: boolean = false;

export interface ReactorCall {
  reactor: Reactor;
  properties: string[];
  changeListener?();
}

let reactorCalls: ReactorCall[] = [];

export function registerReactorCall(reactor: Reactor, property: string) {
  console.log("Adding call for", reactor.constructor.name, property);
  const calls: ReactorCall = reactorCalls.find(c => c.reactor === reactor);

  if (!calls) {
    reactorCalls.push({
      reactor,
      properties: [property]
    });
  } else {
    calls.properties.push(property);
  }
}
export function getReactorCalls(): ReactorCall[] {
  return reactorCalls;
}

export function clearReactorCalls() {
  reactorCalls = [];
}

export function areAllComponentsProcessed(): boolean {
  return initializationComplete;
}