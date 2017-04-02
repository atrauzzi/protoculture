import {LogLevel} from "../LogLevel";


export interface Platform {

    new(): Platform;

    current: boolean;

    environment: any;

    name: string;

    log(level: LogLevel, topic: string, message: any): void;
}