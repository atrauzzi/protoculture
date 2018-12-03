import _ from "lodash";
import { ConnectionConfiguration, ServerRoutes } from "./ApiConfiguration";
import { ApiConnection } from "./ApiConnection";


export interface ConfiguredConnections { 

    // note: Use declaration merging to extend this type for type hinting on APIs.
}

export type ConnectionConfigurations = { [name: string]: ConnectionConfiguration<any> };

export class ApiConnections {

    private configuredConnections: ConfiguredConnections;

    public constructor(
        connectionConfigurations: ConnectionConfigurations[]
    ) {

        this.configuredConnections = _.chain(connectionConfigurations)
            .merge()
            .mapValues((apiConfiguration) =>  new ApiConnection(apiConfiguration))
            .value();
    }

    public connection(name: keyof ConfiguredConnections): ConfiguredConnections[typeof name] {

        return this.configuredConnections[name];
    }
}
