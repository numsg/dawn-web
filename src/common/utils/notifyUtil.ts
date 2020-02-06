import { ElNotificationOptions } from 'element-ui/types/notification';
import { Notification as notify } from 'element-ui';
import { VNode } from 'vue';

export default {

    default(message: string | VNode, title?: string, type?: 'success' | 'warning' | 'info' | 'error',
     closeCallback?: () => void, customClass?: string, iconClass?: string) {
        notify(this.buildNoticeMessage(message, title, type, closeCallback, customClass, iconClass));
    },

    success(message: string, title?: string, closeCallback?: () => void, customClass?: string, iconClass?: string) {
        this.default(message, title, 'success', closeCallback, customClass, iconClass);
    },

    warning(message: string, title?: string, closeCallback?: () => void, customClass?: string, iconClass?: string) {
        this.default(message, title, 'warning', closeCallback, customClass, iconClass);
    },

    info(message: string, title?: string, closeCallback?: () => void, customClass?: string, iconClass?: string) {
        this.default(message, title, 'info', closeCallback, customClass, iconClass);
    },

    error(message: string, title?: string, closeCallback?: () => void, customClass?: string, iconClass?: string) {
        this.default(message, title, 'error', closeCallback, customClass, iconClass);
    },

     /**
      * 构建界面操作的通知消息
      * @param title 消息标题
      * @param message 消息内容
      * @param type 消息类型
      * @param closeCallback 关闭的回调
      * @param customClass 自定义类名
      * @param iconClass 图标类名
      */
    buildNoticeMessage(message: string | VNode, title?: string, type?: 'success' | 'warning' | 'info' | 'error' | undefined,
         closeCallback?: () => void, customClass?: string, iconClass?: string): ElNotificationOptions {
        return {
            title: title,
            message: message,
            type: type,
            onClose: closeCallback,
            customClass,
            iconClass,
            duration: 1000,
            position: 'top-right',
            offset: 120,
            showClose: false,
        } as ElNotificationOptions;

    }
};
