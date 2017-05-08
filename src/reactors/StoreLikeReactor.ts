import { registerReactor, registerReactorListener, unregisterReactorListener } from '../hub';

export default class StoreLikeReactor {
  constructor() {
    registerReactor(this);
  }

  public addChangeListener(c: Function) {
    registerReactorListener(this, c);
  }

  public removeChangeListener(c: Function) {
    unregisterReactorListener(this, c);
  }
}