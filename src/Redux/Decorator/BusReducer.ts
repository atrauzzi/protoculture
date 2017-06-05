import * as Redux from "redux";
import { ServiceProvider } from "../../ServiceProvider";
import { StaticBusReducer } from "../BusReducer";


export function busReducer() {

    // tslint:disable-next-line:only-arrow-functions
    return function (constructor: StaticBusReducer<any>) {

        ServiceProvider.addDecoratedType("protoculture-redux:bus-reducers", constructor);
    };
}
