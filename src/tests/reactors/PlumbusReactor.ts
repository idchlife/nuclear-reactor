import { notify } from "../../index";
export class PlumbusReactor {
  @notify
  price: number = 300;

  weight: number = 10;

  strawberrySniggles: string[] = [];

  constructor() {
    this.strawberrySniggles.push("one");
    this.strawberrySniggles.push("two");
    this.strawberrySniggles.push("three");
  }

  notifyWeightWithThis(weight: number) {
    this.weight = weight;

    notify(this);
  }

  notifyWeightWithoutThis(weight: number) {
    this.weight = weight;

    notify();
  }
};

export default new PlumbusReactor();