import "reflect-metadata";
//
import * as _ from "lodash";
import {suiteSymbols} from "./";
import {appSymbols} from "../App";
import {BaseApp as App} from "../App/Base";
import {Container, interfaces} from "inversify";
import ContainerOptions = interfaces.ContainerOptions;
import {BaseServiceProvider} from "../";
import {ReduxServiceProvider} from "../Redux/ReduxServiceProvider";
import {Platform} from "./Platform";
import {LogLevel} from "../LogLevel";
import {StaticServiceProvider} from "../ServiceProvider";
import {ProtocultureServiceProvider} from "./ProtocultureServiceProvider";


export abstract class BaseSuite {

    //
    // Configurable by Subclasses

    protected abstract get name(): string;

    protected get containerConfiguration(): ContainerOptions { return null; }

    protected get heartbeatInterval(): number { return 5; }

    protected get serviceProviders(): StaticServiceProvider<any>[] {

        return [];
    }

    //
    // Internal

    protected platform: Platform;

    protected _container: Container;

    protected loadedServiceProviders: BaseServiceProvider[];

    protected apps: App[];

    protected booted: boolean;

    //
    // External

    public get container(): Container {

        return this._container;
    }

    public get working() {

        return _.some(this.apps, app => app.working);
    }

    //
    // Initialization Phase

    public constructor() {

        this.loadServiceProviders();
    }

    protected loadServiceProviders() {

        const internalServiceProviders = [
            ProtocultureServiceProvider,
            ReduxServiceProvider,
        ];

        const serviceProviders = _.concat(internalServiceProviders, this.serviceProviders);

        this.loadedServiceProviders = _.map(serviceProviders, serviceProvider => new serviceProvider(this));
    }

    //
    // Boot Phase

    public async boot(): Promise<void> {

        this.booted = false;

        this.bootContainer();

        await this.bootServiceProviders();
        await this.bootPlatform();

        this.booted = true;
    }

    protected bootContainer() {

        if(this.containerConfiguration) {

            this._container = new Container(this.containerConfiguration);
        }
        else {

            this._container = new Container();
        }
    }

    protected async bootServiceProviders() {

        const bootPromises = _.map(this.loadedServiceProviders, serviceProvider => serviceProvider.boot(this));

        await Promise.all(bootPromises);
    }

    protected async bootPlatform() {

        const platform = _.find(this.container.getAll<Platform>(suiteSymbols.Platform), platform => platform.current);

        if(!platform) {

            throw new Error("Unable to determine current platform.");
        }

        this.container.bind<Platform>(suiteSymbols.CurrentPlatform)
            .toConstantValue(platform);

        this.platform = this.container.get<Platform>(suiteSymbols.CurrentPlatform);
    }

    //
    // Run Phase

    public async run(): Promise<void> {

        try {

            if(!this.booted) {

                await this.boot();
            }

            if(!_.isEmpty(this.apps)) {

                throw new Error("Suite already run");
            }

            this.log(LogLevel.Debug, this.toString(), "Suite started");
            // ToDo: Redux event.

            this.buildApps();

            this.startHeartbeat();
            await this.runApps();
        }
        catch(error) {

            console.error(error.stack);
        }
    }

    protected async runApps() {

        try {

            this.log(LogLevel.Debug, this.toString(), "Running apps");
            // ToDo: Redux event per app.
            const appPromises = _.map(this.apps, app => {

                this.log(LogLevel.Debug, this.toString(), "Starting app: " + app.name);

                // ToDo: Capture what comes back, if it's a Promise, THEN start the heartbeat?
                return app.run(this);
            });

            this.log(LogLevel.Debug, this.toString(), "All apps invoked, waiting");
            await Promise.all(appPromises);
        }
        catch(error) {

            this.log(LogLevel.Error, "app-error", error.stack);
        }
    }

    public async stop(): Promise<void> {

        // ToDo: Redux event.

        return null;
    }

    protected buildApps() {

        this.log(LogLevel.Debug, this.toString(), "Building apps");
        this.apps = this.container.getAll<App>(appSymbols.App);

        console.log(this.apps);
    }

    protected startHeartbeat() {

        const heartBeat = setInterval(
            async () => {

                this.log(LogLevel.Debug, this.toString() + "heartbeat", "Beat...");

                if(!this.working) {

                    this.log(LogLevel.Debug, this.toString() + "heartbeat", "...Heart beat.");

                    clearInterval(heartBeat);
                    await this.stop();
                }
            },
            this.heartbeatInterval * 1000
        );
    }

    //
    // Utils

    public async bootChild(): Promise<Container> {

        const childContainer = this.container.createChild();

        const bootPromises = _.map(this.loadedServiceProviders, serviceProvider => serviceProvider.bootChild(childContainer));
        await Promise.all(bootPromises);

        return childContainer;
    }

    protected log(level: LogLevel, topic: string, message: any = null) {

        this.platform.log(level, topic, message);
    }

    public toString() {

        // Note: I'm not trying to invent some kind of URI-like convention here, but this is sortable and splittable and can be used for things like logs & user agents
        return `protoculture:${this.platform.name}@${this.name}:${this.platform.environment.name}/${this.platform.environment.debug}#`;
    }
}
