import {ServiceProvider} from "../ServiceProvider";
import {Container} from "inversify";
import {reduxSymbols} from "./";


export class ReduxServiceProvider<State> extends ServiceProvider {

    public async boot(container: Container): Promise<void> {


        container.bind<Redux.Store<State>>(reduxSymbols.Store)
            .to();

    }
}