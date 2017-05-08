import { Reactor } from './reactors';
export interface ReactorCall {
    reactor: Reactor;
    properties: string[];
    changeListener?(): any;
}
export declare function registerReactorCall(reactor: Reactor, property: string): void;
export declare function getReactorCalls(): ReactorCall[];
export declare function clearReactorCalls(): void;
export declare function areAllComponentsProcessed(): boolean;
