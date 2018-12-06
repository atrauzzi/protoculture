import "./Data/Authorization/Bearer";
import "./Data/Authorization/Oauth2";
import _ from "lodash";
import mitt from "mitt";
import { ServiceProvider } from "./ServiceProvider";
import { BaseApp } from "./App";
import { protocultureSymbols } from "./Symbols";
import { ApiConnections } from "./Data/ApiConnections";


export class ProtocultureServiceProvider extends ServiceProvider {

    public async boot(): Promise<void> {

        this.makeInjectable(BaseApp);

        this.bundle.container.bind(protocultureSymbols.Bundle)
            .toConstantValue(this.bundle);

        this.configureEventBusDispatcher();
        this.configureApiConnections();
    }

    private configureEventBusDispatcher() {

        const eventBus = new mitt();

        eventBus.on("*", ((type: string, event: any) => {

            const eventKey = `protoculture.event.${type}`;

            if (this.bundle.container.isBound(eventKey)) {

                const eventMethod = _.camelCase(`${type}`);

                this.bundle.container
                    .getAll(eventKey)
                    .forEach((handler: any) =>
                        handler[eventMethod](event));
            }
        }) as any);

        this.bundle.container
            .bind<mitt.Emitter>(protocultureSymbols.EventBus)
            .toConstantValue(eventBus);
    }

    private configureApiConnections() {

        this.makeInjectable(ApiConnections);
        this.bindConstructor(protocultureSymbols.ApiConnections, ApiConnections);
        this.bindConstructorParameter([protocultureSymbols.ApiConfiguration], ApiConnections, 0);
    }
}
