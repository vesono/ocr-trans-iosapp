import Amplify from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import awsconfig from '../../aws-exports';
import { listOcrImages } from '../graphql/queries';
import { createOcrImage, deleteOcrImage } from '../graphql/mutations';

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

export const insertNewImage = async (imageName, imageS3Name) => {
  /**
   * DB追加処理
   */
  const newImage = {
    user_name: 'test_user',
    image_name: imageName,
    image_url: imageS3Name,
    ocr_result: 'test_ocr_result',
    trans_result: 'test_trans_result',
  };
  const result = await API.graphql(graphqlOperation(createOcrImage, { input: newImage }));
  console.log(result);
}

export const deleteImage = async delid => {
  /**
   * DB削除処理
   */
  const deleteId = { id: delid };
  await API.graphql(graphqlOperation(deleteOcrImage, {input: deleteId}));
}

export const listImage = async () => {
  /**
   * list取得
   */
  const listData = await API.graphql(graphqlOperation(listOcrImages));
  return listData;
}
