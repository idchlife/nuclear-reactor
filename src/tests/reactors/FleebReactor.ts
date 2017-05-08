import { notify } from '../..';
export class FleebReactor {
  @notify
  hizards: number = 12345;

  @notify
  strings: string[] = [];
};

export default new FleebReactor();