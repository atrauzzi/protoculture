import { ServiceProvider } from "../ServiceProvider";
import { WebPlatform } from "./WebPlatform";
import { reduxSymbols } from "../index";
import { compose } from "redux";


declare const window: {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
};

export class WebServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.bindPlatform(WebPlatform);

        this.bundle.container.rebind(reduxSymbols.Compose)
            .toConstantValue(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
    }
}
