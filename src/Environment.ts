import {LogLevel} from "./Log";


export type Environment<With> = BaseEnvironment & {

    [P in keyof With]?: With[P];
};

export interface BaseEnvironment {

    logLevel: LogLevel;
    name: string;

    debug: boolean;
}
