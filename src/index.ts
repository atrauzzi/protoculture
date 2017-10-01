export { StaticApp, App, BaseApp } from "./App";
export { StaticPlatform, Platform } from "./Platform";
export { ServiceProvider, StaticServiceProvider } from "./ServiceProvider";
export { Bundle } from "./Bundle";
export { LogLevel } from "./Log/LogLevel";

export { ReduxServiceProvider } from "./Redux/ReduxServiceProvider";
export { ConsoleServiceProvider } from "./Console/ConsoleServiceProvider";
export { WebServiceProvider } from "./Web/WebServiceProvider";

export { Environment } from "./Environment";

export { createRequest, requestJson, Method, RequestOptions } from "./CreateRequest";
export { lazyLoad } from "./Web/LazyLoad";
export { domReady } from "./Web/DomReady";

export { bundleSymbols } from "./Bundle/index";
export { appSymbols } from "./App/index";
export { reduxSymbols } from "./Redux/index";

export { BusReducer } from "./Redux/BusReducer";
export { busReducer } from "./Redux/Decorator/BusReducer";

export const symbols = {
    Environment: Symbol("Environment"),
    AvailablePlatform: Symbol("AvailablePlatform"),
    CurrentPlatform: Symbol("CurrentPlatform"),
};
