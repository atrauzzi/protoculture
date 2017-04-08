export {Suite} from "./Base";
export {Environment} from "./Environment";
export {StaticPlatform, Platform} from "./Platform";

export const suiteSymbols = {
    Suite: Symbol("Suite"),
    Environment: Symbol("Environment"),
    AvailablePlatform: Symbol("Platform"),
    CurrentPlatform: Symbol("CurrentPlatform"),
};