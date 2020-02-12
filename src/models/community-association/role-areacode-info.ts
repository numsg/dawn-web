export class RoleAreaCodeInfo {
    id!: string;

    // 冗余code
    code!: string;

    name!: string;

    // 存储行政区划code集合
    administrativeCodes!: string;

    // 存储角色信息集合
    rolesInformation!: string ;

    createTime!: string;

    updateTime!: string;

    operateUser!: string ;

    // 多租户
    multiTenancy!: string ;
    // 描述
    description!: string ;
    constructor() {
        this.id = '';
        this.name = '';
        this.administrativeCodes = '';
        this.rolesInformation = '';
        this.operateUser = '';
        this.description = '';
    }
}
