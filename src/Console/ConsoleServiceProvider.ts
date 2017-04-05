import {BaseServiceProvider} from "../ServiceProvider";
import {suiteSymbols, Suite} from "../Suite";
import {Platform} from "../Suite/Platform";
import {ConsolePlatform} from "./ConsolePlatform";


export class ConsoleServiceProvider extends BaseServiceProvider {

    public async boot(suite: Suite): Promise<void> {

        this.makeInjectable(ConsolePlatform);

        suite.container.bind<Platform>(suiteSymbols.Platform)
            .to(ConsolePlatform)
            .inSingletonScope();
    }
}