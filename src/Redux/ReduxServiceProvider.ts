import {ServiceProvider} from "../ServiceProvider";
import {Container, interfaces} from "inversify";
import {createStore, compose as reduxCompose, applyMiddleware, Store, Reducer, StoreEnhancer, Middleware} from "redux";
import {reduxSymbols} from "./index";
import {Suite} from "../Suite";
import {createBusReducer, BusReducer} from "./BusReducer";


export class ReduxServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.suite.container.bind<typeof reduxCompose>(reduxSymbols.Compose)
            .toConstantValue(reduxCompose);

        this.suite.container.bind<Redux.Store<any>>(reduxSymbols.Store)
            .toDynamicValue((container) => this.busReducerFactory(container))
            .inSingletonScope();
    }

    public async bootChild(container: Container): Promise<void> {

        container.bind<Redux.Store<any>>(reduxSymbols.Store)
            .toDynamicValue((context) => this.busReducerFactory(context));
    }

    protected busReducerFactory(context: interfaces.Context) {

        let busReducers: BusReducer[];

        try {

            busReducers = context.container.getAll<BusReducer>(reduxSymbols.BusReducer);
        }
        catch(error) {

            busReducers = [];
        }
        
        return this.createBusReducerStore(busReducers);
    }

    // ToDo: Other kinds of reducers can totally be a thing by inspecting a config and or creating a different service provider!
    protected createBusReducerStore(busReducers: BusReducer[]): Store<any> {

        return this.createStore<any>(createBusReducer<any>(busReducers));
    }

    protected createStore<State>(reducer: Reducer<State>) {

        const compose = this.suite.container.get<typeof reduxCompose>(reduxSymbols.Compose);

        return createStore<State>(
            reducer,
            compose(applyMiddleware(...this.middlewares))
        );
    }

    protected get middlewares() {
        
        try {
            
            return this.suite.container.getAll<Middleware>(reduxSymbols.Middleware);
        }
        catch(error) {

            return [];
        }
    }
}