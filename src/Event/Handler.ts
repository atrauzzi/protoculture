

export interface Handler<EventType = any> {

    handleEvent(event: EventType): void;
}
