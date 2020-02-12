import cellTypeService from '@/api/base-data-define/cell-type.service';
import axios from 'axios';

import RoleManageService from '@/api/role-manage/role-manage.service';
import ComAssocService from '@/api/community-association/community-association-service';

import { RoleAreaCodeInfo } from '@/models/community-association/role-areacode-info';
import { CommunityConditionInfo } from '@/models/community-association/community-condition';

import { arrayToTreeOhter } from '@/common/utils/utils';
import { AreaInfo } from '@/models/community-association/area-info';

const communityAssociation = {
  state: {
      roleInfos: [],
      areacodes: [],
      relationships: [],
      condition: new CommunityConditionInfo(),
  },
  getters: {
      getCommunityRoles(state: any) {
        return state.roleInfos;
      },
      getCommunityAreacodes(state: any) {
        return state.areacodes;
      },
      getCommunityRelationships(state: any) {
        return state.relationships;
      },
      getCommunitycondition(state: any) {
        return state.condition;
      },
      getCommunityRoleName(state: any) {
        return (id: string) => {
          const role = state.roleInfos.find(( role: any) => role.id === id);
          return role ? role.name : '';
        };
      },
  },
  mutations: {
    SET_COMMUNITY_ROLES_INFO(state: any, payloads: any) {
        state.roleInfos = payloads;
    },
    SET_COMMUNITY_AREA_CODE_INFO(state: any, payloads: any) {
        state.areacodes = payloads;
    },
    SET_COMMUNITY_REATIONSHIPS(state: any, payloads: any) {
        state.relationships = payloads;
    },
    SET_COMMUNITY_CONDITION(state: any, payloads: CommunityConditionInfo ) {
        state.condition = payloads;
    },
    SET_COMMUNITY_TOTAL(state: any, payloads: number) {
      state.condition.total = payloads;
    }
  },
  actions: {
      /**
       * 查询所有角色信息
       * @param context
       */
      async  getAllRolesInfoCommunity(context: any) {
        const roleInfo = await RoleManageService.getRoleList();
        context.commit('SET_COMMUNITY_ROLES_INFO', roleInfo);
      },
      /**
       * 查询所有区划信息
       * @param context
       */
      async getAllAreaCodeInfos(context: any) {
        const areaCodeInfos = await ComAssocService.getAreaCodeInfos('000000');
        context.commit('SET_COMMUNITY_AREA_CODE_INFO', areaCodeInfos.value);
      },
      /**
       * 查询所有角色与区划的关联关系
       * @param context
       */
      async getAllRelationsInfos(context: any) {
        const condition = context.state.condition;
        const relationships = await ComAssocService.getAllRelationsInfos(condition);
        console.log(relationships, '-----------relationships');
        context.commit('SET_COMMUNITY_REATIONSHIPS', relationships.value);
        context.commit('SET_COMMUNITY_TOTAL', relationships.count);
      },
      async addRelationsInfo(context: any, pyload: any) {
        const result = await ComAssocService.addRelationsInfo(pyload);
        if ( result ) {
            context.dispatch('getAllRelationsInfos');
        }
        return result;
      },
      /**
       * 修改校色与区划的关联关系
       */
      async editRelationsInfos(context: any, info: RoleAreaCodeInfo) {
        const result = await ComAssocService.editRelationsInfo(info);
        if (result) {
            context.dispatch('getAllRelationsInfos');
        }
        return result;
      },
      /**
       * 删除角色与区划的关联关系
       */
      async deleteRelatinsInfo(context: any, infoId: string) {
        const result = await ComAssocService.deleteRelationInfos(infoId);
        if ( result ) {
            context.dispatch('getAllRelationsInfos');
        }
        return result;
      }
  }
};

export default communityAssociation;
