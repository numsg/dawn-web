const StoreEvents = {
  // vuex 相关actions 事件定义
  TemplatesMgr: {
    LoadTemplates: 'LoadTemplates',
    SortTemplates: 'SortTemplates',
    EventTypeFilter: 'EventTypeFilter',
    KeywordsFilter: 'KeywordsFilter',
    AdvanceFilter: 'AdvanceFilter',
    RelevanceByEventType: 'RelevanceByEventType'
  },

  EventTypes: {
    LoadEventTypes: 'LoadEventTypes',
    LoadEventNode: 'LoadEventNode',
    LoadAllEventTypes: 'LoadAllEventTypes'
  },
  EpidemicTypes: {
    OnLoadEpidemicTypes: 'onLoadEpidemicTypes'
  },
  planManager: {
    LoadPlans: 'LoadPlans',
    SetConditions: 'SetConditions',
    SearchPlansByKeyWords: 'SearchPlansByKeyWords',
    SetTags: 'SetTags',
    ResetConditions: 'ResetConditions',
    ClosePlanListTag: 'ClosePlanListTag',
    UpdateKeyWords: 'UpdateKeyWords',
    EventTypeStatistics: 'EventTypeStatistics',
    InfiniteLoad: 'InfiniteLoad',
    QueryPlanDetail: 'QueryPlanDetail',
    QueryPlanDetailById: 'QueryPlanDetailById',
    SetListStatisticsTags: 'SetListStatisticsTags',
    ResetStatisticsData: 'ResetStatisticsData',
    SetOriginalStatisticsData: 'SetOriginalStatisticsData',
    DeletePlan: 'DeletePlan'
  },
  baseData: {
    SetCommunities: 'SetCommunities',
    SetDiagnosisSituations: 'SetDiagnosisSituations',
    SetMedicalSituations: 'SetMedicalSituations',
    SetSpecialSituations: 'SetSpecialSituations',
    SetGenderClassification: 'SetGenderClassification',
    SetOtherSymptoms: 'SetOtherSymptoms',
    SetMedicalOpinions: 'SetMedicalOpinions'
  },

  Login: {
    Privileges: 'Privileges'
  },

  PMSComponentManage: {
    onLoadComponentTypes: 'onLoadComponentTypes'
  },
  layout: {
    SetLoading: 'SetLoading'
  },
  planDeduction: {
    loadSituations: 'loadSituations',
    RollSituationLoad: 'RollSituationLoad',
    isDeduction: 'isDeduction',
    LoadSituation: 'LoadSituation',
    UpdateSituationKeywords: 'UpdateSituationKeywords',
    ResetDeduction: 'ResetDeduction',
    CreateSituation: 'createSituation',
    SituationClick: 'SituationClick'
  },
  planCensus: {
    LoadDistricts: 'LoadDistricts',
    LoadStatisticsPlans: 'LoadStatisticsPlans',
    SetStatisticsPlansTotal: 'SetStatisticsPlansTotal'
  },
  systemSet: {
    SystemSetData: 'SystemSetData'
  },
  SystemConfig: {
    LoadSystemConfigs: 'LoadSystemConfigs',
    addConfigs: 'addConfigs'
  },
  SystemLog: {
    HandleDataAdd: 'HandleDataAdd',
    HandleDataEdit: 'HandleDataEdit',
    HandleDataDelete: 'HandleDataDelete',
    ImportDataSource: 'ImportDataSource',
    HandelPlanEditSave: 'HandelPlanEditSave',
    HandelCancelEditplan: 'HandelCancelEditplan',
    HandlePlanVersionUpload: 'HandlePlanVersionUpload',
    HandelEnterIntoEditplan: 'HandelEnterIntoEditplan',
    UpdateDSourceDataSort: 'UpdateDSourceDataSort',
    UnloadKnowledge: 'UnloadKnowledge',
    CancelMakeNew: 'CancelMakeNew',
    UploadKnowledge: 'UploadKnowledge',
    UpdateHomePage: 'UpdateHomePage',
    DeleteDeductionResult: 'DeleteDeductionResult'
  },
  UserManage: {
    OnCurChange: 'OnCurChange'
  },
  OutbreakDuty: {
    SetEpidemicStaticalData: 'SetEpidemicStaticalData',
    SetEpidemicPersons: 'SetEpidemicPersons'
  },
  DailyTroubleshooting: {
    SetStatisticsData: 'SetStatisticsData'
  }
};

export default StoreEvents;
