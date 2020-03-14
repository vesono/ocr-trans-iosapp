/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOcrImage = /* GraphQL */ `
  mutation CreateOcrImage(
    $input: CreateOcrImageInput!
    $condition: ModelOcrImageConditionInput
  ) {
    createOcrImage(input: $input, condition: $condition) {
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
export const updateOcrImage = /* GraphQL */ `
  mutation UpdateOcrImage(
    $input: UpdateOcrImageInput!
    $condition: ModelOcrImageConditionInput
  ) {
    updateOcrImage(input: $input, condition: $condition) {
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
export const deleteOcrImage = /* GraphQL */ `
  mutation DeleteOcrImage(
    $input: DeleteOcrImageInput!
    $condition: ModelOcrImageConditionInput
  ) {
    deleteOcrImage(input: $input, condition: $condition) {
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
