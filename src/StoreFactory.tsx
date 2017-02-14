import {Store, Action} from "redux";
import thunkMiddleware from 'redux-thunk';
import * as _ from "lodash";
import {createStore as createReduxStore, applyMiddleware, compose} from "redux";
import {ApplicationState} from "./Domain/Model/ApplicationState";


interface Window {

    devToolsExtension?: () => any;
}

declare const window: Window;

export const createStore = <State extends ApplicationState>(reducers: any, initialState: State = {} as State): Store<State> => {

    const keyValueDispatchReducer = (state: State = initialState, action: Action) => {

        if(_.has(reducers, action.type)) {
            return reducers[action.type](state, action);
        }

        return state;
    };

    if(window.devToolsExtension) {
        return createReduxStore(keyValueDispatchReducer, compose(applyMiddleware(thunkMiddleware), window.devToolsExtension()));
    }

    return createReduxStore<State>(keyValueDispatchReducer, compose(applyMiddleware(thunkMiddleware)));
};
