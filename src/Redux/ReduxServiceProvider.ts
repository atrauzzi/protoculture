import {ServiceProvider} from "../ServiceProvider";
import {Container, interfaces} from "inversify";
import {createStore, compose as reduxCompose, applyMiddleware, Store, Reducer, StoreEnhancer, Middleware} from "redux";
import { LogLevel } from "../index";
import {reduxSymbols} from "./index";
import {Suite} from "../Suite";
import {createBusReducer, BusReducer} from "./BusReducer";


export class ReduxServiceProvider extends ServiceProvider {

    protected get middlewares() {

        try {

            return this.suite.container.getAll<Middleware>(reduxSymbols.Middleware);
        }
        catch (error) {

            return [];
        }
    }

    public async boot(): Promise<void> {

        this.suite.container.bind<typeof reduxCompose>(reduxSymbols.Compose)
            .toConstantValue(reduxCompose);

        this.suite.container.bind<Redux.Store<any>>(reduxSymbols.Store)
            .toDynamicValue((context) => this.busReducerStoreFactory(context.container))
            .inSingletonScope();
    }

    public async bootChild(container: Container): Promise<void> {

        container.bind<Redux.Store<any>>(reduxSymbols.Store)
            .toDynamicValue((context) => this.busReducerStoreFactory(container));
    }

    protected getInitialState<State>(container: interfaces.Container) {

        try {

            return container.get<State>(reduxSymbols.InitialState);
        }
        catch (error) {

            this.suite.logger.log("No initial state was found", null, LogLevel.Info);

            return null;
        }
    }

    protected busReducerStoreFactory(container: interfaces.Container) {

        let busReducers: BusReducer[];

        try {

            busReducers = container.getAll<BusReducer>(reduxSymbols.BusReducer);
        }
        catch (error) {

            busReducers = [];
        }

        return this.createBusReducerStore(busReducers, this.getInitialState<any>(container));
    }

    protected createBusReducerStore(busReducers: BusReducer[], initialState: any) {

        return this.createStore(createBusReducer(busReducers), initialState);
    }

    protected createStore<State>(reducer: Reducer<State>, initialState?: State) {

        const compose = this.suite.container.get<typeof reduxCompose>(reduxSymbols.Compose);

        return createStore<State>(
            reducer,
            initialState,
            compose(applyMiddleware(...this.middlewares))
        );
    }
}
