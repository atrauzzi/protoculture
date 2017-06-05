import { interfaces } from "inversify";
import { reduxSymbols } from "./index";
import { ServiceProvider } from "../ServiceProvider";
import { BusReducer } from "./BusReducer";


declare module "../ServiceProvider" {

    export interface ServiceProvider {

        configureBusReducer(busReducer: BusReducer<any>): void;
        configureBusReducers(busReducers: BusReducer<any>[]): void;
    }
}

ServiceProvider.prototype.configureBusReducer = function (busReducer: BusReducer<any>) {

    this.makeInjectable(busReducer);

    this.bundle.container.bind(reduxSymbols.BusReducer)
        .to(busReducer);
};

ServiceProvider.prototype.configureBusReducers = function (busReducers: BusReducer<any>[]) {

    busReducers.forEach((busReducer) =>
        this.configureBusReducer(busReducer));
};
