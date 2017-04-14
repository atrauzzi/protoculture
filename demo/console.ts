#!/usr/bin/env ts-node
import {ServiceProvider, StaticServiceProvider, ConsoleServiceProvider, BaseApp, Suite} from "../src";


//
// This is how we declare a service provider.
class ConsoleDemoServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.bindApp(BoringConsoleDemoApp);
        this.bindApp(AsynchronousConsoleDemoApp);
    }
}

//
// Here's a boring console demo app.
class BoringConsoleDemoApp extends BaseApp {

    public name = "boring-app";

    public async run(): Promise<void> {

        this.log("This is from the boring console demo app!");
    }
}

//
// Here's another app that is asynchronous. But still boring.
class AsynchronousConsoleDemoApp extends BaseApp {

    public name = "async-app";

    protected _working: boolean;

    protected timeout = 20;

    public get working(): boolean {

        return this._working;
    }

    public async run(): Promise<void> {

        this._working = true;

        let resolveDeferred: any;
        const deferred = new Promise((resolve) => resolveDeferred = resolve);

        const timeout = setTimeout(
            () => {
                this.log(`${this.timeout} second timeout elapsed!`);
                resolveDeferred();
            },
            this.timeout * 1000
        );

        this.log(`${this.timeout} second timeout started.`);

        await deferred;

        this._working = false;
    }
}

//
// Here's a suite that acts as the composition root for the ServiceProvider.
class ConsoleDemoSuite extends Suite {

    public name = "boring-demo";

    protected get serviceProviders(): StaticServiceProvider<any>[] {

        return [
            ConsoleServiceProvider,
            ConsoleDemoServiceProvider,
        ];
    }
}

//
// And this is how we start it!

const suite = new ConsoleDemoSuite();
suite.run().catch(console.error);