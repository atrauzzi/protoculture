import {Base} from "./Base";


export interface BaseStatic<Instance extends Base<any>> {

    new(): Instance;
}