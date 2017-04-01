import {Action} from "redux";
import {ApplicationState} from "../Model/ApplicationState";
import {ActionCreatorThunk, thunkActionCreator} from "../../ThunkActionCreator";


export const MessageReceivedActionType = "message-received";

export interface MessageReceivedAction extends Action {
    data: any;
    origin: any;
    responseTargetId: string;
}

export function messageReceived(data: any, origin: string, responseTargetId: string) {
    return thunkActionCreator((): MessageReceivedAction => {
        return {
            type: MessageReceivedActionType,
            data: data,
            origin: origin,
            responseTargetId: responseTargetId,
        };
    });
}