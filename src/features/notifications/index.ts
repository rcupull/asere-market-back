import {
  createConfiguration,
  DefaultApi,
  Notification,
} from "@onesignal/node-onesignal";
import { NotificationData, NotificationType } from "../../types/notifications";

/**TODO put in env vars */
const ONESIGNAL_APP_ID = "902b9855-f697-4a7a-aa2b-1e970a9034c4";
const ONESIGNAL_REST_API_KEY =
  "NzM1OGZlNmEtNDI5NS00ZjBmLThiNGItNzlhZjkwMGVhNmQ0";

const configuration = createConfiguration({
  authMethods: {
    app_key: {
      tokenProvider: {
        getToken: () => ONESIGNAL_REST_API_KEY,
      },
    },
  },
});

const client = new DefaultApi(configuration);

const sendNotification = async (args: { title: string; message: string }) => {
  const { title, message } = args;

  const notification = new Notification();
  notification.app_id = ONESIGNAL_APP_ID;
  notification.included_segments = ["All"];

  notification.headings = {
    en: title,
  };
  notification.contents = {
    en: message,
  };

  notification.data = {
    type: "POST_AMOUNT_STOCK_CHANGE",
    data: {},
  };

  await client.createNotification(notification);
};

const sendNotificationToUpdate = async (args: {
  type: NotificationType;
  data?: NotificationData;
}) => {
  const { type, data } = args;

  const notification = new Notification();
  notification.app_id = ONESIGNAL_APP_ID;
  notification.included_segments = ["All"];

  notification.contents = {
    en: "-",
  };

  notification.data = {
    type,
    data,
  };

  await client.createNotification(notification);
};

export const notificationsServices = {
  sendNotification,
  sendNotificationToUpdate,
};
