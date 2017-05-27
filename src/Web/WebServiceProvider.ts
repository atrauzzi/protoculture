import {ServiceProvider} from "../ServiceProvider";
import {WebPlatform} from "./WebPlatform";


export class WebServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.bindPlatform(WebPlatform);
    }
}
