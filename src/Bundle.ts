import _ from "lodash";
import ContainerOptions = interfaces.ContainerOptions;
import { Container, interfaces } from "inversify";
import { protocultureSymbols, App, StaticServiceProvider, ServiceProvider, LogServiceProvider, LogService } from "./index";
import { ProtocultureServiceProvider } from "./ProtocultureServiceProvider";


export abstract class Bundle {

    //
    // Configurable by Subclasses

    public abstract get name(): string;

    protected get containerConfiguration(): ContainerOptions { return null; }

    protected get heartbeatInterval(): number { return 1; }

    protected get serviceProviders(): StaticServiceProvider[] {

        return [];
    }

    //
    // Internal

    private _container: Container;

    private logger: LogService;

    private loadedServiceProviders: ServiceProvider[];

    private apps: App[];

    private booted: boolean;

    //
    // External

    public get container(): Container {

        return this._container;
    }

    public get workingApps() {

        return _.filter(this.apps, (app) =>
            app.working);
    }

    public get longRunning() {

        return !!this.workingApps.length;
    }

    public constructor() {

        this.loadServiceProviders();
    }

    public async boot(): Promise<void> {

        this.booted = false;

        this.bootContainer();

        await this.bootServiceProviders();
        await this.bootLogging();

        this.booted = true;
    }

    public async run(): Promise<void> {

        if (!this.booted) {

            await this.boot();
        }

        if (!_.isEmpty(this.apps)) {

            this.logger.log("Bundle already run", null);

            return;
        }

        this.logger.log("Running bundle", null);

        try {

            await this.buildApps();
        }
        catch (error) {

            this.logger.log(`Unable to build apps: ${error}`, null);
        }

        try {

            await this.runApps();
        }
        catch (error) {

            this.logger.log(`Error running apps: ${error}`, null);
        }
    }

    public async bootChild(): Promise<Container> {

        const childContainer = this.container.createChild();

        const bootPromises = _.map(this.loadedServiceProviders, (serviceProvider: ServiceProvider) =>
            serviceProvider.bootChild(childContainer));

        await Promise.all(bootPromises);

        return childContainer;
    }

    public async stop(): Promise<void> {

        try {

            this.logger.log("Teardown APIs have not been implemented yet.", null);
        }
        catch (error) {

            this.logger.log(error.stack, null);
        }
    }

    protected loadServiceProviders() {

        const internalServiceProviders = [
            ProtocultureServiceProvider,
            LogServiceProvider,
        ] as StaticServiceProvider[];

        const serviceProviders = _.concat(internalServiceProviders, this.serviceProviders);

        this.loadedServiceProviders = _.map(serviceProviders, (serviceProvider: StaticServiceProvider) =>
            new serviceProvider(this));
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

    protected async bootLogging() {

        this.logger = this.container.get<LogService>(protocultureSymbols.LogService) || this.logger;
    }

    protected buildApps() {

        this.logger.log("Building apps", null);
        this.apps = this.container.getAll<App>(protocultureSymbols.App);
    }

    protected startHeartbeat() {

        const interval = this.heartbeatInterval * 1000;

        let timer: any;
        let complete: () => void;
        const deferred = new Promise((resolve) => complete = resolve);

        timer = setInterval(() => this.tick(timer, complete), interval);

        return deferred;
    }

    protected tick(timer: any, complete: () => void) {

        this.logger.log("Beat...", null);

        if (!this.longRunning) {

            this.logger.log("...Heart beat.", null);
            clearInterval(timer);
            complete();
        }
    }

    protected async runApps() {

        this.logger.log("Running apps", null);

        const appPromises = _.map(this.apps, (app: App) => this.runApp(app));

        this.logger.log("All apps started", null);

        await Promise.all(appPromises);

        await this.longRunning 
            ? this.startHeartbeat() 
            : null;

        await this.stop();
    }

    protected async runApp(app: App) {

        this.logger.log("Starting app", app);

        app.bundle = this;

        try {

            await app.run();
        }
        catch (error) {

            this.logger.log(error.stack, app);
        }
    }
}
