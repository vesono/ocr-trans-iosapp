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
      ocr_crops
      trans_result
      owner
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
        ocr_crops
        trans_result
        owner
      }
      nextToken
    }
  }
`;
export const nameListSelect = /* GraphQL */ `
  query NameListSelect(
    $image_url: String
    $user_name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOcrImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    NameListSelect(
      image_url: $image_url
      user_name: $user_name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        user_name
        image_name
        image_url
        ocr_result
        ocr_crops
        trans_result
        owner
      }
      nextToken
    }
  }
`;
