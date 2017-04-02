import {ServiceProvider} from "../ServiceProvider";
import {reduxSymbols} from "./";
import {Suite} from "../Suite";
import {Container} from "inversify";
import {createStore} from "redux";


export class ReduxServiceProvider<State> extends ServiceProvider {

    public async boot(suite: Suite): Promise<void> {

    }

    public async bootChild(container: Container): Promise<void> {

        container.bind<Redux.Store<State>>(reduxSymbols.Store)
            .to();
    }
}