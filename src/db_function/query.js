import Amplify from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import awsconfig from '../../aws-exports';
import { listOcrImages } from '../graphql/queries';
import { createOcrImage, deleteOcrImage } from '../graphql/mutations';
import gcp_env from '../gcp_config/api_gcp_config';

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

export const insertNewImage = async (imageName, imageS3Name, ocrResult) => {
  /**
   * DB追加処理
   */
  const newImage = {
    user_name: 'test_user',
    image_name: imageName,
    image_url: imageS3Name,
    ocr_result: ocrResult,
    trans_result: 'test_trans_result',
  };
  await API.graphql(graphqlOperation(createOcrImage, { input: newImage }));
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

export const sendCloudVison = async data => {
  /**
   * google cloud vision api呼び出し関数
   */
  // json body作成
  const body = JSON.stringify({
    requests: [
      {
        features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
        image: { content: data }
      }
    ]
  });
  // cloud vision api呼び出し
  const response = await fetch(
    "https://vision.googleapis.com/v1/images:annotate?key=" +
    gcp_env["GOOGLE_CLOUD_VISION_API_KEY"],
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: body
    }
  );
  const resjson = await response.json();
  return resjson.responses["0"].fullTextAnnotation.text;
}
