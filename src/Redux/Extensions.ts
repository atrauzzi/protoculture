import { interfaces } from "inversify";
import { reduxSymbols } from "./index";
import { ServiceProvider } from "../ServiceProvider";
import { StaticBusReducer, BusReducer } from "./BusReducer";


declare module "../ServiceProvider" {

    export interface ServiceProvider {

        configureBusReducer(busReducer: StaticBusReducer<any>): void;
        configureBusReducers(busReducers: StaticBusReducer<any>[]): void;

        bindInitialState(state: any): void;
    }
}

// todo: Should these be configure or bind?

ServiceProvider.prototype.configureBusReducer = function (busReducer: StaticBusReducer<any>) {

    this.makeInjectable(busReducer);

    this.bundle.container.bind(reduxSymbols.BusReducer)
        .to(busReducer);
};

ServiceProvider.prototype.configureBusReducers = function (busReducers: StaticBusReducer<any>[]) {

    busReducers.forEach((busReducer) =>
        this.configureBusReducer(busReducer));
};

ServiceProvider.prototype.bindInitialState = function (state: any) {

    this.bundle.container.bind(reduxSymbols.InitialState)
        .toConstantValue(state);
};
