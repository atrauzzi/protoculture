import { LogLevel } from "./Log";


export interface Environment {

    [index: string]: any;

    logLevel: LogLevel;

    debug: boolean;
}
