import "./Data/Authorization/Bearer";
import "./Data/Authorization/Oauth2";
import mitt from "mitt";
import { ServiceProvider } from "./ServiceProvider";
import { BaseApp } from "./App";
import { protocultureSymbols } from "./Symbols";
import { ApiConnections } from "./Data/ApiConnections";
import { Handler } from "./Event/Handler";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.bundle.container.bind(protocultureSymbols.Bundle)
            .toConstantValue(this.bundle);

        this.configureEventBusDispatcher();
        this.configureApiConnections();
    }

    private configureEventBusDispatcher() {

        this.bundle.container
            .bind<mitt.Emitter>(protocultureSymbols.EventBus)
            .toConstantValue(new mitt())
            .onActivation((context, mitt) => {

                // see: https://github.com/developit/mitt/issues/82
                mitt.on("*", ((type: string, event: any) => {

                    const eventKey = `protoculture.event.${type}`;

                    if (context.container.isBound(eventKey)) {

                        context.container
                            .getAll(eventKey)
                            .forEach((handler: Handler) =>
                                handler.handleEvent(event));
                    }
                }) as any);

                return mitt;
            });
    }

    private configureApiConnections() {

        this.makeInjectable(ApiConnections);
        this.bindConstructor(protocultureSymbols.ApiConnections, ApiConnections);
        this.bindConstructorParameter([protocultureSymbols.ApiConfiguration], ApiConnections, 0);
    }
}
