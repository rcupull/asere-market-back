import { join } from "path";
import { NotificationToUpdatePayload } from "../../types/notifications";
import firebase from "firebase-admin";

const credentialsPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  join(process.cwd(), "../firebase-adminsdk-dev.json");
const serviceAccount = require(credentialsPath);

const init = () => {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  });
  console.info("Initialized Firebase SDK");
};

const sendNotification = async (args: { title: string; message: string }) => {
  // try {
  //   await firebase.messaging().send({
  //     data: { score: "850", time: "2:45" },
  //     token:
  //       "eP3HI4GAUz1jBJ_8AzdWZ1:APA91bE6eQA3wRzIBANvhHJ1jBlXDhRuAHEAS_-CQzExqgaqbh14GqmEPs2ZE_hnVY4-sWpkd6vQnn-lgCKaHNdY1vxPMMVq5Mw1nepuFsEKdwLIpGXEKFDjLTIiCKGuCRUm4SO6r1va",
  //   });
  // } catch (error) {
  //   console.log("some firebase error");
  // }
  // const { title, message } = args;
  // const notification = new Notification();
  // notification.app_id = ONESIGNAL_APP_ID;
  // notification.included_segments = ["All"];
  // notification.headings = {
  //   en: title,
  // };
  // notification.contents = {
  //   en: message,
  // };
  // notification.data = {
  //   type: "POST_AMOUNT_STOCK_CHANGE",
  //   data: {},
  // };
  // await client.createNotification(notification);
};

const sendNotificationToUpdate = async (
  payload: NotificationToUpdatePayload
) => {
  try {
    await firebase.messaging().send({
      data: { payload: JSON.stringify(payload) },
      token:
        "fbt89zlObvNEwAWsbwtxTj:APA91bH-OYMXJspmVzryDny8vIWuLzDJd6VntBBBnX3f9HpLQ-IWXolGSs1vdVfVU3kyKllukG03YmBQIasyDIlrdwlBnyVMEZIT2AQNU82uuCq9TkvMk2S7LT5BnuQUiCu3RNdITW0s",
    });
  } catch (error) {
    console.log("some firebase error");
  }
};

export const notificationsServices = {
  sendNotification,
  sendNotificationToUpdate,
  init,
};
