import { BooleanFlag } from 'meow';

export type Package = {
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
};

export type CopyFlag = 'onlyDep' | 'onlyDev' | 'both';
export type PasteFlag = 'asDep' | 'asDev' | 'asEach';

export type AppFlags = {
  [K in CopyFlag | PasteFlag]: BooleanFlag;
};
