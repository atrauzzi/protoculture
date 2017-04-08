import {LogLevel} from "../Log";


export interface Environment {

    logLevel: LogLevel;
    name: string;

    debug: boolean;
}