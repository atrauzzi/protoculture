import {BaseServiceProvider} from "../ServiceProvider";
import {BaseSuite} from "../Suite";
import {BaseApp} from "../App";


export class ProtocultureServiceProvider extends BaseServiceProvider {

    public async boot(suite: BaseSuite): Promise<void> {

        this.makeInjectable(BaseApp);
    }
}
