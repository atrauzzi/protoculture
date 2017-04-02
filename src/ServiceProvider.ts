import {Suite} from "./Suite";
import {Container} from "inversify";


export abstract class ServiceProvider {

    public abstract async boot(suite: Suite): Promise<void>;

    public async bootChild(container: Container): Promise<void> {

    }
}