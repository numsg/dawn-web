import { Message } from 'element-ui';
import {ElMessageComponent } from 'element-ui/types/message';

export default class LimitMessage {
  static instance: ElMessageComponent;
  static showMessage(options: any) {
    if (LimitMessage.instance) {
      LimitMessage.closeMessage();
    }
    LimitMessage.instance = Message(options);
  }
  static closeMessage() {
    LimitMessage.instance.close();
  }

}

