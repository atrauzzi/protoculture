#!/usr/bin/env ts-node
import {Suite} from "../src/Suite";
import {App} from "../src/App";
import {ServiceProvider} from "../src/ServiceProvider";


class ConsoleDemoSuite extends Suite {

    protected get name(): string {

        return "console-demo";
    }

    protected get appConstructors(): (typeof App & {new(suite: Suite): App<any>})[] {

        return undefined;
    }

    protected get serviceProviders(): ServiceProvider[] {

        return [


        ];
    }

}

const suite = new ConsoleDemoSuite();


suite.run();