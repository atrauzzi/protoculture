import {LogLevel} from "../LogLevel";
import {Environment} from "./Environment";


export interface Platform {

    new?(...args: any[]): Platform;

    current: boolean;

    environment: Environment;

    name: string;

    log(level: LogLevel, topic: string, message: any): void;
}

export type ConcretePlatform = Platform & {new(): Platform};