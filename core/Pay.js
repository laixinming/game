import { diamond } from "./Diamond.js";
export class Pay { recharge(){diamond.add(100);return {success:true};} }
export const pay = new Pay();
