export interface ReactyComponent {
    componentWillMount?(): void;
    componentWillUnmount?(): void;
    setState(state: any): any;
}
export interface ReactyComponentClass {
    new (...args: any[]): ReactyComponent;
}
export declare function registerReactorListener(reactor: Object, l: Function): void;
export declare function unregisterReactorListener(reactor: Object, l: Function): void;
export declare function registerNotifiableProperty(reactor: Object, property: string): void;
export declare function getAllReactorPropertiesList(reactor: Object): string[];
/**
 * Property decorated with @notify
 * will trigger all listeners for this reactor after it has been changed.
 */
export declare function notify(reactor: Object, property: string): any;
/**
 * Notifying that passed as argument reactor has changes.
 */
export declare function notify(reactor: Object): any;
/**
 * Notifying that reactor has changes.
 * Should be called inside reactors method.
 * Hub via error stack would be able to get reactor and notify
 * all listeners.
 */
export declare function notify(): any;
export declare function registerReactor(reactor: Object): void;
