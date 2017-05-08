export interface ReactorCore {
    [name: string]: any;
    notifiableProperties: {
        [name: string]: any;
    };
    hiddenProperties: string[];
    emitChange(): any;
}
export interface ReactorClass<R extends Reactor> {
    new (...args: any[]): R;
}
export declare function notify<R extends Reactor>(reactor: R, property: string): void;
export declare abstract class Reactor {
    __core: ReactorCore;
    __protectedAddChangeListener(c: Function): void;
    __protectedRemoveChangeListener(c: Function): void;
    /**
     * @protected
     */
    protected notify(): void;
}
