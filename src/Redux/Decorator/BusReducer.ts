import * as Redux from "redux";
import { ServiceProvider } from "../../ServiceProvider";
import { StaticBusReducer } from "../BusReducer";


export function busReducer() {

    return function (constructor: StaticBusReducer) {

        ServiceProvider.addDecoratedType("protoculture-redux:bus-reducers", constructor);
    };
}
