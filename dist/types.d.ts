import { BooleanFlag } from 'meow';
export declare type Package = {
    devDependencies?: Record<string, string>;
    dependencies?: Record<string, string>;
    [key: string]: unknown;
};
export declare type CopyFlag = 'onlyDep' | 'onlyDev' | 'both';
export declare type PasteFlag = 'asDep' | 'asDev' | 'asEach';
export declare type AppFlags = {
    [K in CopyFlag | PasteFlag]: BooleanFlag;
};
