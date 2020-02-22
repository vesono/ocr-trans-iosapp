import React, { useState, useReducer, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Container, Content, Button, Text, Header,
         Card, CardItem, Icon, Left, Body, Right, View } from 'native-base';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Amplify, { Auth, I18n } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import FooterCom from './src/home/Footer';
import { deleteImage, listImage } from './src/db_function/query';
import { s3Get } from './src/db_function/storage';
import PubSub from '@aws-amplify/pubsub';
import { onCreateOcrImage } from './src/graphql/subscriptions'

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

// 初期値設定
const initialState = {
  images: []
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

  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await Auth.currentUserInfo();
      setUser(user);
      return user
    }

    const getData = async () => {
      const listData = await listImage();
      const arrayData = listData.data.listOcrImages.items;
      const arrayDataGetUrl = await Promise.all(arrayData.map( async value => ({
        ...value, image_url: await s3Get(value.image_url)
      })));
      dispatch({ type: 'LIST', images: arrayDataGetUrl });
    }

    let subscription;
    getUser().then(user => {
      subscription = API.graphql(graphqlOperation(onCreateOcrImage, {owner: user.username})).subscribe({
        next: async eventData => {
          const image = eventData.value.data.onCreateOcrImage;
          image.image_url = await s3Get(image.image_url);
          dispatch({ type: 'ADD', image });
        }
      });
    });

    getPermissionAsync();
    getData();
    console.log(state);
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <Container>
    <Header />
    <Content>
      <View style={styles.content}>
      { state.images.length >0 ?
          state.images.map( image => (
          <Card key={image.id} style={styles.card}>
            <CardItem>
              <Left />
              <Right>
                <Button bordered small danger
                        onPress={() => deleteImage(image.id)}>
                  <Icon type="AntDesign" name="delete" />
                </Button>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: image.image_url}}
                     style={styles.image}/>
            </CardItem>
            <CardItem>
              <Left />
              <Right>
                <Text>11h ago</Text>
              </Right>
            </CardItem>
          </Card>
          )) :
        <Text></Text>
      }
      </View>
    </Content>
    <FooterCom />
  </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  card: {
    width: '49%'
  },
  image: {
    height: 150,
    width: null,
    flex: 1
  }
});

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
