import "./Extensions";
import reduxThunk from "redux-thunk";
import { ServiceProvider } from "../ServiceProvider";
import { Container, interfaces } from "inversify";
import { createStore, compose as reduxCompose, applyMiddleware, Store, Reducer, StoreEnhancer, Middleware } from "redux";
import { LogLevel } from "../index";
import { reduxSymbols } from "./index";
import { Bundle } from "../Bundle";
import { createBusReducer, BusReducer } from "./BusReducer";


export class ReduxServiceProvider extends ServiceProvider {

    protected get middlewares() {

        try {

            return this.bundle.container.getAll<Middleware>(reduxSymbols.Middleware);
        }
        catch (error) {

            return [];
        }
    }

    public async boot(): Promise<void> {

        this.bundle.container.bind(reduxSymbols.Middleware)
            .toConstantValue(reduxThunk);

        this.bundle.container.bind<typeof reduxCompose>(reduxSymbols.Compose)
            .toConstantValue(reduxCompose);

        this.bundle.container.bind<Redux.Store<any>>(reduxSymbols.Store)
            .toDynamicValue((context) => this.busReducerStoreFactory(context.container))
            .inSingletonScope();

        this.configureBusReducers(ServiceProvider.getDecoratedTypes("protoculture-redux:bus-reducers"));
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

            this.bundle.logger.log("No initial state was found", null, LogLevel.Info);

            return null;
        }
    }

    protected busReducerStoreFactory(container: interfaces.Container) {

        let busReducers: BusReducer<any>[];

        try {

            busReducers = container.getAll<BusReducer<any>>(reduxSymbols.BusReducer);
        }
        catch (error) {

            busReducers = [];
        }

        return this.createBusReducerStore(busReducers, this.getInitialState<any>(container));
    }

    protected createBusReducerStore(busReducers: BusReducer<any>[], initialState: any) {

        return this.createStore(createBusReducer(busReducers), initialState);
    }

    protected createStore<State>(reducer: Reducer<State>, initialState?: State) {

        const compose = this.bundle.container.get<typeof reduxCompose>(reduxSymbols.Compose);

        return createStore<State>(
            reducer,
            initialState,
            compose(applyMiddleware(...this.middlewares))
        );
    }
}
