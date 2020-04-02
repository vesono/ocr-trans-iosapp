// tslint:disable
// eslint-disable
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
      ocr_lang
      trans_result
      createdAt
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
        ocr_lang
        trans_result
        createdAt
        owner
      }
      nextToken
    }
  }
`;
export const mainList = /* GraphQL */ `
  query MainList(
    $user_name: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOcrImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    mainList(
      user_name: $user_name
      createdAt: $createdAt
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
        ocr_lang
        trans_result
        createdAt
        owner
      }
      nextToken
    }
  }
`;
