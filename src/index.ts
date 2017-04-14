export {App, BaseApp} from "./App";
export {StaticPlatform, Platform} from "./Platform";
export {ServiceProvider, StaticServiceProvider} from "./ServiceProvider";
export {Suite} from "./Suite";
export {LogLevel} from "./Log/LogLevel";

export {ReduxServiceProvider} from "./Redux/ReduxServiceProvider";
export {ConsoleServiceProvider} from "./Console/ConsoleServiceProvider";
export {WebServiceProvider} from "./Web/WebServiceProvider";

export {Environment, BaseEnvironment} from "./Environment";

export {createRequest, requestJson} from "./CreateRequest";

export const symbols = {
    Environment: Symbol("Environment"),
    AvailablePlatform: Symbol("AvailablePlatform"),
    CurrentPlatform: Symbol("CurrentPlatform"),
};