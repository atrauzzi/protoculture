import {ServiceProvider} from "../ServiceProvider";
import { LogService} from "../";
import { MockTracer, Tracer } from "opentracing";
import { protocultureSymbols } from "..";


export class LogServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(Tracer);
        this.makeInjectable(MockTracer);
        this.bindConstructor<MockTracer>(protocultureSymbols.Tracer, MockTracer);

        this.makeInjectable(LogService);
        this.bindConstructor<LogService>(protocultureSymbols.LogService, LogService);

        this.bindConstructorParameter(protocultureSymbols.Bundle, LogService, 0);
        this.bindConstructorParameter(protocultureSymbols.Tracer, LogService, 1);
    }
}
