import {Suite} from "./Suite";
import {decorate, injectable, Container} from "inversify";


export abstract class ServiceProvider {

    public abstract async boot(suite: Suite): Promise<void>;

    public async bootChild(container: Container): Promise<void> {

    }

    protected makeInjectable(object: any): void {

        decorate(injectable(), object);
    }
}

export type ConcreteServiceProvider = typeof ServiceProvider & {new(): ServiceProvider};