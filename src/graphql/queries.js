/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOcrImage = /* GraphQL */ `
  query GetOcrImage($id: ID!) {
    getOcrImage(id: $id) {
      id
      user_name
      image_name
      image_url
      ocr_result
      trans_result
    }
  }
`;
export const listOcrImages = /* GraphQL */ `
  query ListOcrImages(
    $filter: ModelOcrImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOcrImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user_name
        image_name
        image_url
        ocr_result
        trans_result
      }
      nextToken
    }
  }
`;
