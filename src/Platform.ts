import { LogLevel } from "./Log/LogLevel";
import { Environment, Suite } from "./index";


export interface StaticPlatform<PlatformType extends Platform> {

    new(): PlatformType;
}

export interface Platform {

    current: boolean;

    environment: Environment;

    name: string;

    suite: Suite;

    log(message: string, level: LogLevel): void;

    boot?(name?: string): Promise<void>;
}
