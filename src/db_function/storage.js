import Amplify, { Storage } from 'aws-amplify';
import API from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import awsconfig from '../../aws-exports';
import { Buffer } from 'buffer'

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

export const s3Upload = async (imageName, base64Data) => {
    /**
     * s3追加処理
     * @param {string} imageName - s3 keyname
     * @param {string} base64Data - 画像データ(base64形式)
     */
    const imagename = imageName;
    const decodedFile = Buffer.from(base64Data, 'base64');
    const option = { 
      level: 'public',
      contentType: 'image/jpeg'
    };
    await Storage.put(imagename, decodedFile, option);
  }
  
export const s3Get = async imageName => {
  /**
   * s3get処理
   * @param {string} imageName - s3 keyname
   * @return {string} 署名付きURLを返す
   */
  const presignedUrl = await Storage.get(imageName, {
    expire: 3600
  });
  return presignedUrl;
}

export const s3GetObject = async imageName => {
  /**
   * s3get処理(バイナリ)
   * @param {string} imageName - s3 keyname
   * @return {binary} 画像のバイナリデータを返却
   */
  const returnObject = await Storage.get(imageName, {
    download: true
  });
  return returnObject;
}
