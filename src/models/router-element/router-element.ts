export default class RouterElement {
    id: string = '';
    pid: string = '';
    children: any[] = [];
    name: string = '';
    path: string = '';
    component: any = null;
    hidden = false;
    iconCls = '';
    menuOrder: number = 0;
}
