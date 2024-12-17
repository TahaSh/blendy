export declare type AnimationType = 'dynamic' | 'spring';

export declare interface Blendy {
    toggle(id: string, onDone?: OnDoneCallback): void;
    untoggle(id: string, onDone?: OnDoneCallback): void;
    update(): void;
}

declare type Config = {
    animation: AnimationType;
};

export declare function createBlendy(config?: Partial<Config>): Blendy;

declare type OnDoneCallback = () => void;

export { }
