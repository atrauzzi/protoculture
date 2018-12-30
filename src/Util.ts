

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function createDeferred<ReturnType = any>() {

    const deferred = {
        promise: null as Promise<ReturnType>,
        resolve: null as (data?: ReturnType) => void,
        reject: null as (error: any) => void,
    };

    deferred.promise = new Promise<ReturnType>((resolve: (data: ReturnType) => void, reject: (error: any) => void) => {

        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}
