

export function domReady() {

    let resolveDeferred: () => void;
    let rejectDeferred: (error: any) => void;
    const deferred = new Promise<void>((resolve, reject) => {
        resolveDeferred = resolve;
        rejectDeferred = reject;
    });

    document.onreadystatechange = () => {

        if(document.readyState === "complete") {

            resolveDeferred();
        }
    };

    if(document.readyState === "complete") {
        
        resolveDeferred();
    }

    return deferred;
}