import { LogLevel } from "./Log/LogLevel";
import { Environment, Bundle } from "./index";


export interface StaticPlatform<PlatformType extends Platform> {

    new(): PlatformType;
}

export interface Platform {

    current: boolean;

    environment: Environment;

    name: string;

    bundle: Bundle;

    log(message: string[], level: LogLevel): void;

    boot?(name?: string): Promise<void>;
}
