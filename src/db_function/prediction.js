import Amplify from '@aws-amplify/core';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

/**
 * 翻訳処理
 * @param {string} textToTranslate 翻訳対象テキスト
 * @return {string} 翻訳結果 
 */
export const textTranslate = async (textToTranslate) => {
  const result = Predictions.convert({
    translateText: {
      source: {
        text: textToTranslate,
          language : "en" // defaults configured on aws-exports.js
        // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
      },
      targetLanguage: "ja"
    }
  })
  return result;
}
