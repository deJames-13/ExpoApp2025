import admin from '#firebase/utils';
import { Service } from '#lib';
import NotificationModel from './notification.model.js';

class NotificationService extends Service {
  model = NotificationModel;

  async saveDevice({ user, fcmToken }) {}

  async sendNotification({deviceToken, title = '', body='' }) {
    const message = {
      notification: {
        title, body
      },
      token: deviceToken
    }

    return admin.messaging().send(message).then((response) => {
      console.log('Successfully sent message:', response);
      return response;
    }).catch((e)=>{
      console.log('Error sending message:', e);
    })
    
  }
  
  async sendNotifications() {}
}

export default new NotificationService();
