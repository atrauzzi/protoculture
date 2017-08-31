import { ServiceProvider } from "../ServiceProvider";
import { ElectronPlatform } from "./ElectronPlatform";
import { reduxSymbols } from "../index";
import { compose } from "redux";


declare const window: {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
};

export class ElectronServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.bindPlatform(ElectronPlatform);

        this.bundle.container.rebind(reduxSymbols.Compose)
            .toConstantValue(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
    }
}
