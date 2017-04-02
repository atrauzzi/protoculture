import * as _ from "lodash";
import {suiteSymbols} from "./";
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

    protected abstract get appConstructors(): (typeof App & {new(base: Base): App<any>})[];

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

    protected serviceProviders: ServiceProvider[];

    //
    // External

    public get container(): Container {

        return this._container;
    }

    //
    // Initialization Phase

    public constructor() {

        this.loadApps();
        this.loadServiceProviders();
    }

    protected loadApps() {

        this.apps = _.map(this.appConstructors, app => new app(this));
    }

    protected loadServiceProviders() {

        this.serviceProviders = _.map(this.getServiceProviderConstructors(), serviceProvider => new serviceProvider);
    }

    //
    // Boot Phase

    public async boot(): Promise<void> {

        this.bootContainer();
        await this.bootServiceProviders();
        await this.bootPlatform();
    }

    public async bootChild(): Promise<Container> {

        const childContainer = this.container.createChild();

        const reduxServiceProvider = new ReduxServiceProvider();
        await reduxServiceProvider.bootChild(childContainer);

        const bootPromises = _.map(this.serviceProviders, serviceProvider => serviceProvider.bootChild(childContainer));
        await Promise.all(bootPromises);

        return childContainer;
    }

    protected bootContainer() {

        this._container = new Container(this.containerConfiguration);
    }

    protected async bootServiceProviders() {

        const bootPromises = _.map(this.serviceProviders, serviceProvider => serviceProvider.boot(this));

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

        // ToDo: Redux event.

        this.startHeartbeat();

        try {

            const appPromises = _.map(this.apps, app => app.run());
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

    protected startHeartbeat() {

        const heartBeat = setInterval(
            async () => {

                this.log(LogLevel.Debug, "protoculture", "Beat...");

                if(!this.working) {

                    this.log(LogLevel.Debug, "heartbeat", "...Heart beat.");

                    clearInterval(heartBeat);
                    await this.stop();
                }
            },
            this.heartbeatInterval * 1000
        );
    }

    protected get working() {

        return _.some(this.apps, app => app.working);
    }

    //
    // Utils

    protected log(level: LogLevel, topic: string, message: any) {

        this.platform.log(level, topic, message);
    }

    protected getServiceProviderConstructors(): ServiceProviderStatic<ServiceProvider>[] {

        return _.chain(this.serviceProviders)
            .concat(_.flatMap(this.apps, app => app.serviceProviders))
            .flatMap(app => app.serviceProviders)
            .uniq()
            .value()
        ;
    }

    public toString() {

        // I'm not trying to make any kind of URI here, but this is at least splittable and can be used for things like user agents.
        return `protoculture:${this.platform.name}@${this.name}:${this.platform.environment.name}/${this.platform.environment.debug}#`;
    }
}