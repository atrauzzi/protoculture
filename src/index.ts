export {App} from "./App";
export {StaticPlatform, Platform} from "./Platform";
export {ServiceProvider, StaticServiceProvider} from "./ServiceProvider";
export {Suite} from "./Suite";
export {LogLevel} from "./Log/LogLevel";

export {ConsoleServiceProvider} from "./Console/ConsoleServiceProvider";
export {ReduxServiceProvider} from "./Redux/ReduxServiceProvider";

export const symbols = {
    Environment: Symbol("Environment"),
    AvailablePlatform: Symbol("AvailablePlatform"),
    CurrentPlatform: Symbol("CurrentPlatform"),
};