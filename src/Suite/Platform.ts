import {LogLevel} from "../LogLevel";
import {Environment} from "./Environment";


export interface Platform {

    current: boolean;

    environment: Environment;

    name: string;

    log(level: LogLevel, topic: string, message: any): void;
}