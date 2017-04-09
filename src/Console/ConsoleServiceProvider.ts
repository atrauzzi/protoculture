import {ServiceProvider} from "../ServiceProvider";
import {ConsolePlatform} from "./ConsolePlatform";
import {StaticPlatform} from "../Platform";


export class ConsoleServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.bindPlatform(ConsolePlatform);
    }
}