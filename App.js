import React, { useReducer, useEffect } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Button, Text, Thumbnail,
         Card, CardItem, Icon, Left, Body, Right } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Buffer } from 'buffer'
import Amplify, { Storage, Auth } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import awsconfig from './aws-exports';
import { listOcrImages } from './src/graphql/queries';
import { createOcrImage } from './src/graphql/mutations';

Amplify.configure(awsconfig);
API.configure(awsconfig);

// 初期値設定
const initialState = {
  images: []
}

const nowtime = () => {
  /**
   * 現在時刻取得
   */
  const moment = require('moment');
  return moment().format('YYYYMMDDHHmmssSSS');
}

const insertNewImage = async (imageName, imageS3Name) => {
  /**
   * DB追加処理
   */
  const newImage = {
    user_name: 'test_user',
    image_name: imageName,
    image_url: imageS3Name,
    ocr_result: 'test_ocr_result',
    trans_result: 'test_trans_result',
  };
  await API.graphql(graphqlOperation(createOcrImage, { input: newImage }));
}

const s3Upload = async (imageName, base64Data) => {
  /**
   * s3追加処理
   */
  const imagename = imageName;
  const decodedFile = Buffer.from(base64Data, 'base64');
  const option = { 
    level: 'public',
    contentType: 'image/jpeg'
  };
  await Storage.put(imagename, decodedFile, option);
}

const s3Get = async imageName => {
  /**
   * s3get処理
   */
  console.log(imageName);
  const presignedUrl = await Storage.get(imageName, {
    expire: 1800
  });
  return presignedUrl;
}

const App = () => {
  const reducer = (state, action) => {
    /**
     * reducer定義
     */
    switch (action.type) {
      case 'ADD':
        return {...state, images: [...state.images]};
      case 'LIST':
        return {...state, images: action.images};
      default:
        return state;
    }
  }

  const getPermissionAsync = async () => {
    /**
     * カメラロールpermission取得
     */
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  
  const pickImage = async () => {
    /**
     * ライブラリーから選択して画像取得
     */
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
    console.log(result.uri);
  
    if (!result.cancelled) {
      // s3追加
      const imageFileName = result.uri.split('/').slice(-1)[0];
      const s3fileName = nowtime() + '_' + imageFileName;
      await s3Upload(s3fileName, result.base64);
      // url取得
      const s3PresignedUrl = await s3Get(s3fileName);
      // DB追加
      await insertNewImage(imageFileName, s3fileName);
      dispatch({ type: 'ADD', images: s3PresignedUrl });
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const getData = async () => {
      const listData = await API.graphql(graphqlOperation(listOcrImages));
      arrayData = listData.data.listOcrImages.items;
      arrayData[0].image_url = await s3Get(arrayData[0].image_url);
      dispatch({ type: 'LIST', images: arrayData });
    }
    getPermissionAsync();
    getData();
    console.log(state);
  }, []);

  return (
    <Container>
    <Header />
    <Content>
      <Button light
       onPress={() => pickImage()}
      >
        <Text>Pick an image from camera roll</Text>
      </Button>
      { state.images.length >0 ?
          state.images.map( image => (
          <Card key={image.id}>
            <CardItem>
              <Left>
                <Body>
                  <Text></Text>
                  <Text note>{image.image_name}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
            <Image source={{uri: image.image_url}}
                    style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active name="thumbs-up" />
                  <Text>12 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>11h ago</Text>
              </Right>
            </CardItem>
          </Card>
          )) :
        <Text></Text>
      }
    </Content>
  </Container>
  );
}

export default App;
