import Amplify, { Auth } from 'aws-amplify';
import API from '@aws-amplify/api';
import awsconfig from '../../aws-exports';
import PubSub from '@aws-amplify/pubsub';

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

/**
 * ログアウト処理
 */
export const logOut = async () => {
  await Auth.signOut();
}
