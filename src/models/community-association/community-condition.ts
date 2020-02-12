export class CommunityConditionInfo {
    page!: number;
    pageSize!: number;
    total!: number;
    roleIds!: string[];
    areaCodes!: string[];
    constructor() {
        this.page = 1;
        this.pageSize = 10;
        this.total = 0;
        this.roleIds = [];
        this.areaCodes = [];
    }
}
