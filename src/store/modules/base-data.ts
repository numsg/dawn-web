import dSourceDataService from '@/api/data-source/d-data-source.service';
import { treeToArray, arrayToTree } from '@/common/utils/utils';
import District from '@/models/data-define/district';
import store from '@/store';
const baseData = {

    state: {
        communities: [], // 社区数据
        diagnosisSituations: [], // 诊断情况
        medicalSituations: [], // 医疗情况
        specialSituations: [], // 特殊情况
        genderClassification: [],
        otherSymptoms: [], // 其他症状
        medicalOpinions: [], // 医疗意见
    },

    mutations: {
        SET_COMMUNITIES: (state: any, payloads: any) => {
            state.communities = payloads;
        },
        SET_DIAGNOSIS_SITUTIONS: (state: any, payloads: any) => {
            state.diagnosisSituations = payloads;
        },
        SET_MEDICAL_SITUATIONS: (state: any, payloads: any) => {
            state.medicalSituations = payloads;
        },
        SET_SPECIAL_SITUATIONS: (state: any, payloads: District[]) => {
            state.specialSituations = payloads;
        },
        SET_GENDER_CLASSIFICATION: (state: any, payloads: District[]) => {
            state.genderClassification = payloads;
        },
        SET_OTHER_SYMPTOMS: (state: any, payloads: District[]) => {
            state.otherSymptoms = payloads;
            console.log(state);
        },
        SET_MEDICAL_OPINIONS: (state: any, payloads: District[]) => {
            state.medicalOpinions = payloads;
            console.log(state);
        },
    },
    actions: {

        SetCommunities: async ({ commit }: any) => {
            const dataSourceId = store.getters.configs.communityDataSourceId;
            const result = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
            commit('SET_COMMUNITIES', result);
        },
        SetDiagnosisSituations: async ({ commit }: any) => {
            const dataSourceId = store.getters.configs.diagnosisDataSourceId;
            const result = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
            commit('SET_DIAGNOSIS_SITUTIONS', result);
        },
        SetMedicalSituations: async ({ commit }: any) => {
            const dataSourceId = store.getters.configs.medicalConditionDataSourceId;
            const result = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
            commit('SET_MEDICAL_SITUATIONS', result);
        },
        SetSpecialSituations: async ({ commit }: any) => {
            const dataSourceId = store.getters.configs.specialCaseDataSourceId;
            const result = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
            commit('SET_SPECIAL_SITUATIONS', result);
        },
        SetGenderClassification: async ({ commit }: any) => {
            const dataSourceId = store.getters.configs.genderDataSourceId;
            const result = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
            commit('SET_GENDER_CLASSIFICATION', result);
        },
        SetOtherSymptoms: async ({ commit }: any) => {
            const dataSourceId = store.getters.configs.otherSymptomsId;
            const result = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
            commit('SET_OTHER_SYMPTOMS', result);
        },
        SetMedicalOpinions: async ({ commit }: any) => {
            const dataSourceId = store.getters.configs.medicalOpinionsId;
            const result = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
            commit('SET_MEDICAL_OPINIONS', result);
        }

    },
    getters: {
        baseData_communities: (state: any) => state.communities,
        baseData_diagnosisSituations: (state: any) => state.diagnosisSituations,
        baseData_medicalSituations: (state: any) => state.medicalSituations,
        baseData_specialSituations: (state: any) => state.specialSituations,
        baseData_genderClassification: (state: any) => state.genderClassification,
        baseData_otherSymptoms: (state: any) => state.otherSymptoms,
        baseData_medicalOpinions: (state: any) => state.medicalOpinions,
    }
};

export default baseData;
