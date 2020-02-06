export class TemplateIntro {

    id: string = '';
    name: string = '';
    templateType: any;
    templateTypeName: any;
    eventType: any;
    eventTypeName = '';
    district: any;
    districtName: any;
    planUse: any;
    planUseName: any;
    responseSub: any;
    responseSubName: any;
    createTime: any;
    createPerson: any;
    updateTime: any;
    updatePerson: any;
    tags: Array<any> = [];
    isGuide: boolean = false;
    isNew: boolean = false;
    isDefault: boolean = false;
}

export default TemplateIntro;
