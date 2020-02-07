import eventTypeService from '@/api/base-data-define/event-type.service';

const eventTypes = {
  state: {
    eventTypes: [],
    eventsNext: {
      eventId: null,
      result: null
    },
    allEventTypes: []
  },
  mutations: {
    EVENT_TYPES: (state: any, data: any) => {
      state.eventTypes = data;
    },
    EVENTSNEXT: (state: any, payloads: any) => {
      state.eventsNext.result = payloads.data;
      state.eventsNext.eventId = payloads.eventId;
    },
    ALL_EVENTS: (state: any , payloads: any) => {
      state.allEventTypes = payloads;
    }
  },
  actions: {
    /**
     * 加载模板数据
     *
     * @param {*} { commit }
     * @param {*} payloads 有效载荷，包含预案模板类型和加载数量
     */
    LoadEventTypes: async ({ commit }: any, payloads: any) => {
      const result = await eventTypeService.LoadEventTypes();
      const eventsType1: any[] = [];
      // 一级节点
      for (const i of result) {
        if (i.pid === '-1') {
          eventsType1.push(i);
        }
      }
      const result1 = JSON.parse(JSON.stringify(eventsType1));
      commit('EVENT_TYPES', {
        data: result1
      });
    },

    /**
     * 加载节点的下一级节点
     *
     */
    LoadEventNode: async ({ commit }: any, payloads: any) => {
      // let result = await eventTypeService.LoadEventNode();
      const result = await eventTypeService.QueryByEventId(payloads.eventId);
      commit('EVENTSNEXT', {
        data: result,
        eventId: payloads.eventId
      });
    },

    LoadAllEventTypes: async ({ commit }: any) => {
      const result = await eventTypeService.HttpLoadEventTypes();
      commit('ALL_EVENTS', result);
    }
  },
  getters: {
    event_types: (state: any) => state.eventTypes,
    events_next: (state: any) => state.eventsNext.result,
    all_events: (state: any) => state.allEventTypes
  }
};

export default eventTypes;
