import {Container} from "inversify";


export abstract class ServiceProvider {

    public abstract async boot(container: Container): Promise<void>;
}