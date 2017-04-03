import * as _ from "lodash";
import {suiteSymbols} from "./";
import {appSymbols} from "../App";
import {Base as App} from "../App/Base";
import {Container, interfaces} from "inversify";
import ContainerOptions = interfaces.ContainerOptions;
import {ServiceProviderStatic} from "../ServiceProviderStatic";
import {ServiceProvider} from "../";
import {ReduxServiceProvider} from "../Redux/ReduxServiceProvider";
import {Platform} from "./Platform";
import {LogLevel} from "../LogLevel";


export abstract class Base {

    //
    // Configurable by Subclasses

    protected abstract get name(): string;

    protected abstract get appConstructors(): (typeof App & {new(suite: Base): App<any>})[];

    protected get containerConfiguration(): ContainerOptions { return null; }

    protected get heartbeatInterval(): number { return 5; }

    protected get serviceProviders(): ServiceProvider[] {

        return [];
    }

    //
    // Internal

    protected platform: Platform;

    protected _container: Container;

    protected apps: App<any>[];

    protected loadedServiceProviders: ServiceProvider[];

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

        this.loadedServiceProviders = _.map(this.getServiceProviderConstructors(), serviceProvider => new serviceProvider);
    }

    //
    // Boot Phase

    public async boot(): Promise<void> {

        this.booted = false;

        this.bootContainer();

        // Note: Anything that runs before this cannot use DI
        await this.bootServiceProviders();

        // Note: It's important that we boot the platform after all ServiceProviders are registered
        await this.bootPlatform();

        this.booted = true;
    }

    public async bootChild(): Promise<Container> {

        const childContainer = this.container.createChild();

        const reduxServiceProvider = new ReduxServiceProvider();
        await reduxServiceProvider.bootChild(childContainer);

        const bootPromises = _.map(this.loadedServiceProviders, serviceProvider => serviceProvider.bootChild(childContainer));
        await Promise.all(bootPromises);

        return childContainer;
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

        this.platform = _.find(this.container.getAll<Platform>(suiteSymbols.Platform), platform => platform.current);

        if(!this.platform) {

            throw new Error("Unable to determine current platform.");
        }

        this.container.bind<Platform>(suiteSymbols.CurrentPlatform)
            .to(this.platform)
            .inSingletonScope();
    }

    //
    // Run Phase

    public async run(): Promise<void> {

        try {

            if(!this.booted) {

                await this.boot();
            }

            if(!_.isEmpty(this.apps)) {

                throw new Error("App already run");
            }

            this.log(LogLevel.Debug, this.toString(), "Suite started");
            // ToDo: Redux event.

            this.startHeartbeat();

            this.runApps();
        }
        catch(error) {

            console.error(error.stack);
        }
    }

    protected async runApps() {

        try {

            this.buildApps();

            this.log(LogLevel.Debug, this.toString(), "Running apps");
            // ToDo: Redux event per app.
            const appPromises = _.map(this.apps, app => {

                this.log(LogLevel.Debug, this.toString(), "Starting app: " + app.name)
                return app.run();
            });

            this.log(LogLevel.Debug, this.toString(), "All apps invoked, waiting");
            await Promise.all(appPromises);
        }
        catch(error) {

            this.log(LogLevel.Error, "app-error", error);
        }
    }

    public async stop(): Promise<void> {

        // ToDo: Redux event.

        return null;
    }

    protected buildApps() {

        this.log(LogLevel.Debug, this.toString(), "Building apps");
        this.apps = this.container.getAll<App<any>>(appSymbols.App);
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

    protected log(level: LogLevel, topic: string, message: any = null) {

        this.platform.log(level, topic, message);
    }

    protected getServiceProviderConstructors(): ServiceProviderStatic<ServiceProvider>[] {

        return _.chain(this.serviceProviders)
            .concat(_.flatMap(this.appConstructors, app => app.serviceProviders))
            .uniq()
            .value()
        ;
    }

    public toString() {

        // Note: I'm not trying to invent some kind of URI-like convention here, but this is sortable and splittable and can be used for things like logs & user agents
        return `protoculture:${this.platform.name}@${this.name}:${this.platform.environment.name}/${this.platform.environment.debug}#`;
    }
}