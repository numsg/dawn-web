import AppendixGraph from './appendix-graph';
import { ComponentDefine } from './component-define';
import AppendixContact from './appendix-contacts';

class DocumentItem {
    id!: string;
    title!: string;
    level: number = 1;
    appendixGraph!: AppendixGraph;
    appendixContact!: AppendixContact;
    componentList: ComponentDefine[] = [];
    dataList: any[] = [];
    nodeContent!: string;
    textareaValue!: string;
}

export default DocumentItem;
