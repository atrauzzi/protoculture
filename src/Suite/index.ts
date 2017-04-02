export {Base as Suite} from "./Base";

export const suiteSymbols = {
    Runtime: Symbol("Runtime"),
    Platform: Symbol("Platform"),
    CurrentRuntime: Symbol("CurrentRuntime"),
    CurrentPlatform: Symbol("CurrentPlatform"),
    // ToDo: Determine how we'll let multiple things converge on redux when we register it.
    Reducer: Symbol("BusReducer")
};