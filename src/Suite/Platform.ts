import {LogLevel} from "../Log/LogLevel";
import {Environment} from "./Environment";


export interface StaticPlatform<PlatformType extends Platform> {

    new(): PlatformType;
}

export interface Platform {

    current: boolean;

    environment: Environment;

    name: string;

    log(message: string, level: LogLevel): void;
}
