import {ServiceProvider} from "../ServiceProvider";
import {reduxSymbols} from "./index";
import {Suite} from "../Suite";
import { Container, interfaces } from "inversify";
import {createStore, Store} from "redux";
import {createBusReducer, BusReducer} from "./BusReducer";


export class ReduxServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.suite.container.bind<Redux.Store<any>>(reduxSymbols.Store)
            .toDynamicValue((container) => this.busReducerFactory(container));
    }

    public async bootChild(container: Container): Promise<void> {

        container.rebind<Redux.Store<any>>(reduxSymbols.Store)
            .toDynamicValue((context) => this.busReducerFactory(context));
    }

    protected busReducerFactory(context: interfaces.Context) {

        const busReducers = context.container.getAll<BusReducer>(reduxSymbols.BusReducer);

        return this.createBusReducerStore(busReducers);
    }

    // ToDo: Other kinds of reducers can totally be a thing by inspecting a config and or creating a different service provider!
    protected createBusReducerStore(busReducers: BusReducer[]): Store<any> {

        return createStore<any>(createBusReducer<any>(busReducers));
    }
}