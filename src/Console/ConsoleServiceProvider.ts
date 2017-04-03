import {ServiceProvider} from "../ServiceProvider";
import {consoleSymbols} from "./";
import {Suite} from "../Suite";
import {Container} from "inversify";
import {createStore, Reducer} from "redux";


export class ConsoleServiceProvider<State> extends ServiceProvider {

    public async boot(suite: Suite): Promise<void> {


    }
}