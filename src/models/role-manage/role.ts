export default class Role {
    public id: string = '';
    public name: string = '';
    public description: string = '';
    public code: string = '';
    public configuration: string = '';
    public usedStatus: number = 0;
    public choose?: boolean;
    public roles?: Array<any>;
    public disabled: boolean = false;
}


