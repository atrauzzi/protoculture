import * as _ from "lodash";
import {suiteSymbols} from "./";
import {BaseStatic as AppStatic} from "../App/BaseStatic";
import {Base as App} from "../App/Base";
import {Container, interfaces} from "inversify";
import ContainerOptions = interfaces.ContainerOptions;
import {ServiceProviderStatic} from "../ServiceProviderStatic";
import {ServiceProvider} from "../";
import {ReduxServiceProvider} from "../Redux/ReduxServiceProvider";
import {Platform} from "./Platform";
import {Runtime} from "./Runtime";


export abstract class Base {

    protected abstract get name(): string;

    protected abstract get appConstructors(): AppStatic<any>[];

    protected platform: Platform;

    protected runtime: Runtime;

    protected container: Container;

    protected get containerConfiguration(): ContainerOptions { return null; }

    protected apps: App<any>[];

    protected serviceProviders: ServiceProvider[];

    public constructor() {

        this.loadApps();
        this.loadServiceProviders();
    }

    protected loadApps() {

        this.apps = _.map(this.appConstructors, app => new app());
    }

    protected loadServiceProviders() {

        const serviceProviderConstructors = this.getServiceProviderConstructors();

        serviceProviderConstructors.push(ReduxServiceProvider);

        this.serviceProviders = _.map(this.getServiceProviderConstructors(), serviceProvider => new serviceProvider);
    }

    protected getServiceProviderConstructors(): ServiceProviderStatic<ServiceProvider>[] {

        return _.chain(this.apps)
            .flatMap(app => app.serviceProviders)
            .uniq()
            .value()
        ;
    }

    //
    // Boot

    public async boot(): Promise<void> {

        this.bootContainer();
        await this.bootServiceProviders();

        this.loadRuntimeMetadata();
        this.loadPlatformMetadata();
    }

    protected bootContainer() {

        this.container = new Container(this.containerConfiguration);
    }

    protected async bootServiceProviders() {

        const bootPromises = _.map(this.serviceProviders, serviceProvider => serviceProvider.boot(this.container));

        await Promise.all(bootPromises);
    }

    protected loadRuntimeMetadata() {

        this.runtime = _.find(this.container.getAll<Runtime>(suiteSymbols.Runtime), runtime => runtime.current);
    }

    protected loadPlatformMetadata() {

        this.platform = _.find(this.container.getAll<Platform>(suiteSymbols.Platform), platform => platform.current);
    }

    //
    // Run

    public async run(): Promise<void> {

        // ToDo: Redux event.

        const appPromises = _.map(this.apps, app => app.run());

        await Promise.all(appPromises);
    }
}