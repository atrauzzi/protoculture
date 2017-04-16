import {LogLevel} from "./Log/LogLevel";
import { BaseEnvironment, Suite } from "./index";


export interface StaticPlatform<PlatformType extends Platform> {

    new(): PlatformType;
}

export interface Platform {

    current: boolean;

    environment: BaseEnvironment;

    name: string;

    suite: Suite;

    log(message: string, level: LogLevel): void;

    boot?(name?: string): Promise<void>;
}
