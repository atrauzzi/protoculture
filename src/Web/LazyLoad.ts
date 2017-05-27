export async function lazyLoad(uri: string) {

    let resolveDeferred: (event: Event) => void;
    let rejectDeferred: (error: any) => void;
    const deferred = new Promise<Event>((resolve, reject) => {
        resolveDeferred = resolve;
        rejectDeferred = reject;
    });

    const scriptTag = document.createElement("script");
    scriptTag.src = uri;
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    scriptTag.defer = true;

    scriptTag.onload = (event: Event) => {

        resolveDeferred(event);
    };

    document.getElementsByTagName("head")[0]
        .appendChild(scriptTag);

    return deferred;
}
