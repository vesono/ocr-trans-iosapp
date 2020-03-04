import Amplify from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import awsconfig from '../../aws-exports';
import { listOcrImages } from '../graphql/queries';
import { createOcrImage, updateOcrImage, deleteOcrImage } from '../graphql/mutations';
import gcp_env from '../gcp_config/api_gcp_config';

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

/**
 * DB追加処理
 * @param {string} imageName 画像名
 * @param {string} imageS3Name s3 key名
 */
export const insertNewImage = async (imageName, imageS3Name) => {
  const newImage = {
    user_name: 'test_user',
    image_name: imageName,
    image_url: imageS3Name,
  };
  await API.graphql(graphqlOperation(createOcrImage, { input: newImage }));
}

/**
 * OCR結果更新処理
 * @param {string} id
 * @param {string} ocrResult ocr結果
 */
export const updOcrResult = async (id, ocrResult) => {
  const updData = {
    id: id,
    ocr_result: ocrResult
  };
  await API.graphql(graphqlOperation(updateOcrImage, {input: updData}));
}

/**
 * DB削除処理
 * @param {string} delid key id
 */
export const deleteImage = async delid => {
  const deleteId = { id: delid };
  await API.graphql(graphqlOperation(deleteOcrImage, {input: deleteId}));
}

/**
 * list取得
 * @returns {array} 画像リスト表示用データ
 */
export const listImage = async () => {
  const listData = await API.graphql(graphqlOperation(listOcrImages));
  return listData;
}

/**
 * google cloud vision api呼び出し関数
 * @param {string} data 画像データ(base64形式)
 * @returns {string} ocr結果テキスト
 */
export const sendCloudVison = async data => {
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
