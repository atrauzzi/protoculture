import * as es6Promise from "es6-promise";
import "isomorphic-fetch";
import "reflect-metadata";
//
import * as _ from "lodash";
import {symbols, ServiceProvider} from "../index";
import {bundleSymbols} from "./index";
import {appSymbols, App} from "../App";
import {Container, interfaces} from "inversify";
import ContainerOptions = interfaces.ContainerOptions;
import {Platform} from "../Platform";
import {LogLevel} from "../Log/LogLevel";
import {StaticServiceProvider} from "../ServiceProvider";
import {ProtocultureServiceProvider} from "./ProtocultureServiceProvider";
import {logSymbols, LogServiceProvider, LogService} from "../Log";
import {ReduxServiceProvider} from "../Redux/ReduxServiceProvider";


es6Promise.polyfill();

export abstract class Bundle {

    //
    // Configurable by Subclasses

    public abstract get name(): string;

    protected get containerConfiguration(): ContainerOptions { return null; }

    protected get heartbeatInterval(): number { return 5; }

    protected get serviceProviders(): StaticServiceProvider<any>[] {

        return [];
    }

    //
    // Internal

    protected _platform: Platform;

    protected _container: Container;

    protected _logger: LogService;

    protected loadedServiceProviders: ServiceProvider[];

    protected apps: App[];

    protected booted: boolean;

    //
    // External

    public get logger(): LogService {

        return this._logger;
    }

    public get platform(): Platform {

        return this._platform;
    }

    public get container(): Container {

        return this._container;
    }

    public get working() {

        return _.filter(this.apps, (app) => app.working);
    }

    public constructor() {

        this.loadServiceProviders();
    }

    public async boot(): Promise<void> {

        this.booted = false;

        this.bootContainer();

        await this.bootServiceProviders();
        await this.bootPlatform();

        this.booted = true;
    }

    public async run(): Promise<void> {

        if (!this.booted) {

            await this.boot();
        }

        if (!_.isEmpty(this.apps)) {

            this._logger.log("Bundle already run", null, LogLevel.Error);

            return;
        }

        this._logger.log("Bundle started", null, LogLevel.Debug);

        // ToDo: Redux event?

        try {

            await this.buildApps();
        }
        catch (error) {

            this._logger.log(`Unable to build apps: ${error}`, null, LogLevel.Error);
        }

        try {
            await this.runApps();
        }
        catch (error) {
            this._logger.log(`Error running apps: ${error}`, null, LogLevel.Error);
        }
    }

    public async bootChild(): Promise<Container> {

        const childContainer = this.container.createChild();

        const bootPromises = _.map(this.loadedServiceProviders, (serviceProvider: ServiceProvider) => serviceProvider.bootChild(childContainer));
        await Promise.all(bootPromises);

        return childContainer;
    }

    public async stop(): Promise<void> {

        try {

            // todo
        }
        catch (error) {

            this._logger.log(error.stack, null, LogLevel.Error);
        }

        return null;
    }

    protected loadServiceProviders() {

        const internalServiceProviders = [
            ProtocultureServiceProvider,
            LogServiceProvider,
            ReduxServiceProvider,
        ];

        const serviceProviders = _.concat(internalServiceProviders, this.serviceProviders);

        this.loadedServiceProviders = _.map(serviceProviders, (serviceProvider: StaticServiceProvider<any>) => new serviceProvider(this));
    }

    protected bootContainer() {

        if (this.containerConfiguration) {

            this._container = new Container(this.containerConfiguration);
        }
        else {

            this._container = new Container();
        }
    }

    protected async bootServiceProviders() {

        await _.reduce(
            this.loadedServiceProviders,
            (previous: Promise<void>, current) => previous.then(() => current.boot()),
            new Promise<void>((resolve) => resolve())
        );
    }

    protected async bootPlatform() {

        const currentPlatform = _.find(
            this.container.getAll<Platform>(symbols.AvailablePlatform),
            (platform: Platform) => platform.current
        );

        if (!currentPlatform) {

            throw new Error("Unable to determine current platform.");
        }

        // ToDo: Property injection!
        currentPlatform.bundle = this;

        if (currentPlatform.boot) {

            await currentPlatform.boot();
        }

        this.container.bind<Platform>(symbols.CurrentPlatform)
            .toConstantValue(currentPlatform);

        this._platform = this.container.get<Platform>(symbols.CurrentPlatform);
        // With a platform selected and booted, logging is now available.
        this._logger = this.container.get<LogService>(logSymbols.LogService);
    }

    protected buildApps() {

        this._logger.log("Building apps", null, LogLevel.Debug);
        this.apps = this.container.getAll<App>(appSymbols.App);
    }

    protected startHeartbeat() {

        this._logger.log("Starting heartbeat", null, LogLevel.Debug);
        const heartBeat = setInterval(
            () => {

                this._logger.log("Beat...", null, LogLevel.Debug);

                const workingApps = this.working;

                if (_.isEmpty(workingApps)) {

                    this._logger.log("...Heart beat.", null, LogLevel.Debug);

                    clearInterval(heartBeat);
                    this.stop();
                }
                else {

                    _.forEach(workingApps, (app: App) => this._logger.log("Still working", app, LogLevel.Debug));
                }
            },
            this.heartbeatInterval * 1000
        );
    }

        protected async runApps() {

        this._logger.log("Running apps", null, LogLevel.Debug);

        const appPromises = _.map(this.apps, (app: App) => {

            this._logger.log("Starting app", app, LogLevel.Info);

            try {

                app.bundle = this;

                return app.run();
            }
            catch (error) {

                this._logger.log(error.stack, app, LogLevel.Error);
            }
        });

        this._logger.log("All apps started", null, LogLevel.Debug);

        if (!_.isEmpty(this.working)) {

            this._logger.log("An asynchronous app was detected", null, LogLevel.Info);
            this.startHeartbeat();
        }

        await Promise.all(appPromises);
    }
}