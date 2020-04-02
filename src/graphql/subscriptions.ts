// tslint:disable
// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateOcrImage = /* GraphQL */ `
  subscription OnCreateOcrImage($owner: String!) {
    onCreateOcrImage(owner: $owner) {
      id
      user_name
      image_name
      image_url
      ocr_result
      ocr_crops
      ocr_lang
      trans_result
      createdAt
      owner
    }
  }
`;
export const onUpdateOcrImage = /* GraphQL */ `
  subscription OnUpdateOcrImage($owner: String!) {
    onUpdateOcrImage(owner: $owner) {
      id
      user_name
      image_name
      image_url
      ocr_result
      ocr_crops
      ocr_lang
      trans_result
      createdAt
      owner
    }
  }
`;
export const onDeleteOcrImage = /* GraphQL */ `
  subscription OnDeleteOcrImage($owner: String!) {
    onDeleteOcrImage(owner: $owner) {
      id
      user_name
      image_name
      image_url
      ocr_result
      ocr_crops
      ocr_lang
      trans_result
      createdAt
      owner
    }
  }
`;
