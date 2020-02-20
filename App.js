import React, { useReducer, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Container, Content, Button, Text,
         Card, CardItem, Icon, Left, Body, Right } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Buffer } from 'buffer'
import Amplify, { Storage, I18n } from 'aws-amplify';
import API from '@aws-amplify/api';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import HeaderCom from './src/home/Header';
import FooterCom from './src/home/Footer';
import { insertNewImage, deleteImage, listImage } from './src/db_function/query';

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
        return {...state, images: [...state.images, action.image]};
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
      // DB追加
      await insertNewImage(imageFileName, s3fileName);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getData = async () => {
      const listData = await listImage();
      const arrayData = listData.data.listOcrImages.items;
      const arrayDataGetUrl = await Promise.all(arrayData.map( async value => ({
        ...value, image_url: await s3Get(value.image_url)
      })));
      dispatch({ type: 'LIST', images: arrayDataGetUrl });
    }
    getPermissionAsync();
    getData();
    
    console.log('state');
    console.log(state);
  }, []);

  return (
    <Container>
    <HeaderCom />
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
              <Body>
              </Body>
              <Right>
                <Button bordered
                onPress={() => deleteImage(image.id)}>
                  <Icon type="AntDesign" name="delete"
                        style={{fontSize: 20}}/>
                </Button>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: image.image_url}}
                     style={styles.image}/>
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
    <FooterCom />
  </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: null,
    flex: 1
  }
});


// export default App;

const dict = {
  'ja': {
    'Sign in to your account': "ログイン",
    'Create a new account': "アカウント作成",
    'Username': "メールアドレス",
    'Password': "パスワード"

    
   }
};

I18n.putVocabularies(dict);
I18n.setLanguage('ja');

export default withAuthenticator(App, {
  signUpConfig: {
    hiddenDefaults: ["email", "phone_number"]
}});
