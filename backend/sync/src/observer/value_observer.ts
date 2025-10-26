import logger from "../logging/logger.js";

export class ValueObserver<V> {
    private observer_: undefined | ((value: V) => void);

    constructor(observer: (value: V) => void) {
        this.observer_ = observer;
    }

    notify(value: V): void {
        if (this.observer_) {
            logger.debug('Observer notified. Running observer.');
            this.observer_(value);
        }
    }

    dispose(): void {
        this.observer_ = undefined;
    }
}