import * as _ from "lodash";
import * as React from "react";
import * as ReactDom from "react-dom";
import {Component} from "react";
import {Store, Action, Reducer} from "redux";
import {Provider} from "react-redux";
import {ApplicationState} from "./Domain/Model/ApplicationState";
import {initialize} from "./Domain/Action/Initialize";
import {messageReceived} from "./Domain/Action/MessageReceived";
import {createStore} from "./StoreFactory";
import {Environment} from "./Domain/Model/Environment";
import {loadConfiguration} from "./Domain/Action/LoadConfiguration";
import setConfigurationReducer from "./Domain/Reducer/SetConfiguration";


interface ResponseTarget {
    origin: string;
    source: Window;
}

abstract class App<State extends ApplicationState> {

    private containerElement: Element|string;

    protected store: Store<State>;

    private initialState: State;

    private static responseTargets: {[key: string]: ResponseTarget} = {};

    private static readonly ignoredSources = [
        /react-.*/,
        /@.*/,
    ];

    public constructor(
        containerElementOrSelector: Element|string,
        initialState: State = {} as State
    ) {
        this.containerElement = containerElementOrSelector;
        this.initialState = initialState;
    }

    public run(environment: Environment) {

        this.containerElement = this.findContainer(this.containerElement);

        const reducers = _.assign(
            this.getReducers(),
            setConfigurationReducer
        );
        const userValue = this.getMetaValue("user");

        this.store = createStore<State>(reducers, _.merge(
            this.getDefaultState(),
            this.initialState,
            {
                environment: environment,
                user: _.isEmpty(userValue) ? null : userValue,
            }
        ));

        window.addEventListener("message", this.onMessageReceived.bind(this));

        this.store.dispatch(initialize());

        const configurationPath = this.getConfigurationPath();
        if(configurationPath) {
            this.store.dispatch(loadConfiguration(configurationPath));
        }

        ReactDom.render(
            <Provider store={this.store}>
                {this.getComponent()}
            </Provider>,
            this.containerElement
        );

    }

    public static respond(responseTargetId: string, data: any) {
        const responseTarget = App.responseTargets[responseTargetId];
        responseTarget.source.postMessage(data, responseTarget.origin);
    }

    public static broadcast(data: Action, internal: boolean = true) {
        const targetOrigin = internal ? window.location.origin : "*";
        window.postMessage(data, targetOrigin);
    }

    // Provide any Promise<Action> (promise that returns an action) to have this app injest it.
    public listenTo(promise: Promise<Action>): Promise<Action> {
        return promise.then(this.receive.bind(this));
    }

    //
    //

    protected getDefaultState(): State {
        return {} as State;
    }

    protected getConfigurationPath(): string {
        return null;
    }

    protected abstract getReducers(): {[actionType: string]: Reducer<State>};

    protected abstract getComponent(): Component<any, State>;

    //
    //

    protected receive(action: Action) {

        if(action.type) {
            this.store.dispatch(action as any);
        }
        else {
            console.info("Ignored received action.", action);
        }

    }

    protected onMessageReceived(messageEvent: MessageEvent) {

        if(
            !messageEvent.data
            || !messageEvent.origin
            || !messageEvent.source
        ) {
            console.error("Invalid message.", messageEvent);
        }
        else if(
            messageEvent.data.source
            && _.some(App.ignoredSources, (sourceToIgnore) => messageEvent.data.source.search(sourceToIgnore))
        ) {
            //console.info("Ignored posted message.", messageEvent.data.source, messageEvent);
            return;
        }
        else if(
            messageEvent.data.type
            && messageEvent.origin === window.location.origin
        ) {
            this.store.dispatch(messageEvent.data);
        }
        else {

            const responseTargetId = messageEvent.origin + "@" + messageEvent.source.location;

            App.responseTargets[responseTargetId] = {
                origin: messageEvent.origin,
                source: messageEvent.source,
            };

            this.store.dispatch(messageReceived(messageEvent.data, messageEvent.origin, responseTargetId));

        }

    }

    protected getMetaValue<Type>(id: string, defaultValue: Type = undefined): Type {

        let value: any = undefined;

        try {
            const element: HTMLMetaElement = document.getElementsByName(id).item(0) as HTMLMetaElement;
            const value = element.content;
            return (_.isUndefined(value) || _.isNull(value)) ? defaultValue : JSON.parse(value);
        }
        catch(e) {
        }

        return value || defaultValue;

    }

    protected getElementValue<Type>(elementId: string, attributeName: string, defaultValue: Type = undefined): Type {

        let value: any;

        try {
            const element: HTMLElement = document.getElementById(elementId);
            value = element.getAttribute(attributeName);
            return (_.isUndefined(value) || _.isNull(value)) ? defaultValue : JSON.parse(value);
        }
        catch(e) {
        }

        return value || defaultValue;

    }

    protected findCsrf(): string {

        const csrfElement: HTMLInputElement = document.getElementsByName("__RequestVerificationToken")[0] as HTMLInputElement;

        if(csrfElement) {
            return csrfElement.value;
        }

        return undefined;

    }

    //
    //

    private findContainer(elementOrString: Element|string) {

        if(_.isString(elementOrString)) {
            return this.selectorToElement(elementOrString as string);
        }
        else if(elementOrString instanceof Element) {
            return elementOrString;
        }
        else {
            throw "Invalid container provided.";
        }

    }

    private selectorToElement(selector: string) {

        const element = document.getElementById(selector);

        if(!element) {
            throw "Unable to find element \"" + selector + "\".";
        }

        return element;

    }

}

export default App;