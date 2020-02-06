export const eventTypeUrl = {
  // 加载所有事件类型
  LoadEventTypes: 'event-types',

  // 根据事件id获取其子事件
  QueryByEventId: 'event-types/all-children/{id}',

  // 新增事件类型
  AddEventType: 'event-types',

  // 根据事件类型id 修改事件类型名称
  UpdateEventNameById: 'event-types/{id}/{name}',

  // 根据事件类型id 删除事件类型及其子事件
  DeleteEventsById: 'event-types/children/{id}',

  // 节点拖拽到其他节点
  DraggleNodeToNode: 'event-types/drag/{id}/{pid}',

  // 上传或重置图片
  UploadImg: 'event-types/event-image/{id}',

  // 修改事件类型
  UpdateEventType: 'event-types',

  // 修改图片
  UpdatEventTypeImage: 'event-types/img/{id}',



  // 添加一个事件
  addEvent: 'event-types',
  // 修改一个事件
  updateEvent: 'event-types',
  // 删除一个事件
  deleteEvent: 'event-types/{eventId}'

};
