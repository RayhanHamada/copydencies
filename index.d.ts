import { CopyFlag, PasteFlag } from './types';
declare function copyden(dest: string, source: string, copyFlag?: CopyFlag, pasteFlag?: PasteFlag): Promise<void>;
export default copyden;
