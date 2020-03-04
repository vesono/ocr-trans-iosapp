import Amplify, { Storage } from 'aws-amplify';
import API from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import awsconfig from '../../aws-exports';
import { Buffer } from 'buffer'

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

/**
 * s3追加処理
 * @param {string} imageName s3 keyname
 * @param {string} base64Data 画像データ(base64形式)
 */
export const s3Upload = async (imageName, base64Data) => {
    const imagename = imageName;
    const decodedFile = Buffer.from(base64Data, 'base64');
    const option = { 
      level: 'public',
      contentType: 'image/jpeg'
    };
    await Storage.put(imagename, decodedFile, option);
  }

/**
 * s3get処理_URL
 * @param {string} imageName s3 keyname
 * @returns {string} 署名付きURL
 */
export const s3Get = async imageName => {
  const presignedUrl = await Storage.get(imageName, {
    expire: 3600
  });
  return presignedUrl;
}

/**
 * s3get処理_バイナリ
 * @param {*} imageName s3 keyname
 * @returns {binary} 画像のバイナリデータ
 */
export const s3GetObject = async imageName => {
  const returnObject = await Storage.get(imageName, {
    download: true
  });
  return returnObject;
}

/**
 * s3delete処理
 * @param {string} imageId 
 */
export const s3Delete = async imageId => {
  await Storage.remove(imageId);
}
