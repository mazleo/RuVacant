import { ValueObserver } from "./value_observer.js";

export class ValueObservable<V> {
    private value_: V | undefined;
    private observers_: Array<ValueObserver<V>>;

    constructor() {
        this.observers_ = [];
    }

    addObserver(observer: ValueObserver<V>): void {
        this.observers_.push(observer);
    }

    removeObserver(observer: ValueObserver<V>): void {
        this.observers_ = this.observers_.filter(obs => obs !== observer);
    }

    removeAllObservers(): void {
        this.observers_.forEach(observer => observer.dispose());
        this.observers_ = [];
    }
    
    setValue(value: V): void {
        this.value_ = value;
        if (this.value_) {
            this.observers_.forEach(observer => {
                observer.notify(this.value_!);
            })
        }
    }

    getValue(): V | undefined {
        return this.value_;
    }

    dispose(): void {
        this.removeAllObservers();
        this.value_ = undefined;
    }
}