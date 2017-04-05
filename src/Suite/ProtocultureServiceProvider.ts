import {BaseServiceProvider} from "../ServiceProvider";
import {Suite} from "../Suite";
import {App} from "../App";


export class ProtocultureServiceProvider extends BaseServiceProvider {

    public async boot(suite: Suite): Promise<void> {

        this.makeInjectable(App);
    }
}
