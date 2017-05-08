import { registerReactorListener, unregisterReactorListener } from '../hub';

export default class StoreLikeReactor {
  public addChangeListener(c: Function) {
    registerReactorListener(this, c);
  }

  public removeChangeListener(c: Function) {
    unregisterReactorListener(this, c);
  }
}