

export interface Handler<EventType = any> {

    handle(event: EventType): void;
}
