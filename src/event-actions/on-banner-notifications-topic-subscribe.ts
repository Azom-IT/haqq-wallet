import {Banner} from '@app/models/banner';
import {VariablesBool} from '@app/models/variables-bool';
import {PushNotifications} from '@app/services/push-notifications';

export async function onBannerNotificationsTopicSubscribe(
  id: string,
  topic: string,
) {
  await PushNotifications.instance.subscribeToTopic(topic);

  VariablesBool.set(`notificationsTopic:${topic}`, true);

  Banner.remove(id);
}
