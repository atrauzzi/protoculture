import {ServiceProvider} from "../ServiceProvider";
// import {consoleSymbols} from "./";
import {Suite} from "../Suite";


export class ConsoleServiceProvider extends ServiceProvider {

    public async boot(suite: Suite): Promise<void> {

        console.log("I'm being booted!!!");
        // suite.container.bind<Platform>(suiteSymbols.CurrentPlatform)
        //     .to(this.platform)
        //     .inSingletonScope();
    }
}