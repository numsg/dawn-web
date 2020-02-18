import PlotBrief from './plot-brief';

export class CommunityBrief {
    communityName: string = '';
    communityCode: string = '';
    plotTotal: number = 0; // 社区下面的小区数量
    troubleshootTotal: number = 0; // 应填报总人数
    dailyTroubleshootTotal: number = 0; // 当日填报总人数
    abnormalTotal: number = 0; // 异常人数
    plotBriefModels: PlotBrief[] = [];
}
export default CommunityBrief;

