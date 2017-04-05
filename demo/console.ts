#!/usr/bin/env ts-node
import {BaseServiceProvider, StaticServiceProvider} from "../src";
import {App} from "../src/App";
import {Suite} from "../src/Suite";
import {ConsoleServiceProvider} from "../src/Console/ConsoleServiceProvider";


//
// Here's a boring console demo app.
class BoringConsoleDemoApp extends App {

    public name = "console-demo";

    protected async onRun(): Promise<void> {

        console.log("This is from the boring console demo app!");
    }
}

//
// Here's another app that is asynchronous. But still boring.
class AsynchronousConsoleDemoApp extends App {

    public name = "async-demo";

    protected _working: boolean;

    protected timeout = 20;

    public get working(): boolean {

        return this._working;
    }

    protected async onRun(): Promise<void> {

        this._working = true;

        let resolveDeferred: any;
        const deferred = new Promise((resolve) => resolveDeferred = resolve);

        const timeout = setTimeout(
            () => {
                console.log(`${this.timeout} second timeout elapsed!`);
                resolveDeferred();
            },
            this.timeout * 1000
        );

        console.log(`${this.timeout} second timeout started.`);

        await deferred;

        this._working = false;
    }
}

//
// This is how we declare a service provider.
class ConsoleDemoServiceProvider extends BaseServiceProvider {

    public async boot(suite: Suite): Promise<void> {

        this.bindApp(BoringConsoleDemoApp);
        this.bindApp(AsynchronousConsoleDemoApp);
    }
}

//
// Here's a suite that acts as the composition root for the ServiceProvider.
class ConsoleDemoSuite extends Suite {

    protected name = "console-demo";

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
suite.run();