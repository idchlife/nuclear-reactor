import StoreLikeReactor from '../../reactors/StoreLikeReactor';
import { notify } from '../..';
export class FleebReactor extends StoreLikeReactor {
  @notify
  hizards: number = 12345;

  @notify
  strings: string[] = [];
};

export default new FleebReactor();