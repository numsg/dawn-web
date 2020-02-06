export class ImageModel {
    public isIcon: boolean = false;
    public iconfont: string = '';
    public iconColor: string = '';
}
export class FormatDSourceDataModel {
    public id: string = '';
    public name: string = '';
    public pid: string = '';
    public dataSourceId: string = '';
    public image: ImageModel = new ImageModel();
    public imgColor?: string = '';
}
export default FormatDSourceDataModel;
