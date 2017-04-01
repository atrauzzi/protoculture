import {ServiceProvider} from "./ServiceProvider";


export interface ServiceProviderStatic<Instance extends ServiceProvider> {

    new(): Instance;
}