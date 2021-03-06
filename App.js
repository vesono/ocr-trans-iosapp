import React, { useState, useReducer, useEffect } from 'react';
import { Container, Content, Button, Icon } from 'native-base';
import Amplify, { Auth, I18n } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import awsconfig from './aws-exports';
import PubSub from '@aws-amplify/pubsub';
import { withAuthenticator } from 'aws-amplify-react-native';
import { onCreateOcrImage, onUpdateOcrImage } from './src/graphql/subscriptions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FlatListCom from './src/home/FlatList';
import FooterCom from './src/home/Footer';
import { ImageDetail } from './src/detail/ImageDetail'
import { listData, listDataAddObj } from './src/db_function/query';
import { s3Get } from './src/db_function/storage';

Amplify.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

// 初期値設定
const initialState = {
  images: []
}

const HomeCom = props => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'ADD':
        return {...state, images: [action.image, ...state.images]};
      case 'UPD':
        return {...state, images: [...state.images.map(v => {
          if (v.id === action.image.id) {
            return action.image;
          } else {
            return v;
          }
        })]};
      case 'LIST':
        return {...state, images: action.images};
      case 'LIST_PN':
        return {...state, images: [...state.images, ...action.images]};
      case 'DEL':
        return {...state, images: state.images.filter(item => item.id != action.kid)};
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState(null);    // ユーザーのstate管理
  const [edit, setEdit] = useState(false);   // 編集モードのstate管理
  const [listToken, setListToken] = useState(null);

  const navigation = props.navigation;
  navigation.setOptions({
    headerRight: () => (
      <Button transparent 
        onPress={() => setEdit(!edit)}>
        <Icon type="AntDesign" name="ellipsis1" />
      </Button>
    )
  });

  useEffect(() => {
    const getUser = async () => {
      const user = await Auth.currentUserInfo();
      setUser(user);
      return user
    }

    // 初回データ取得
    const getData = async () => {
      const listDataImage = await listData();
      const arrayData = listDataImage.data.mainList.items;
      const arrayDataGetUrl = await listDataAddObj(arrayData);
      if (listDataImage.data.mainList.nextToken !== null) {
        setListToken(listDataImage.data.mainList.nextToken);
      }
      dispatch({ type: 'LIST', images: arrayDataGetUrl });
    }

    let subscriptionAdd;
    let subscriptionUpd;
    getUser().then(user => {
      subscriptionAdd = API.graphql(graphqlOperation(onCreateOcrImage, {owner: user.username})).subscribe({
        next: async eventData => {
          const image = eventData.value.data.onCreateOcrImage;
          image.s3_url = await s3Get(image.image_url);
          dispatch({ type: 'ADD', image });
        }
      });
      subscriptionUpd = API.graphql(graphqlOperation(onUpdateOcrImage, {owner: user.username})).subscribe({
        next: async eventData => {
          const image = eventData.value.data.onUpdateOcrImage;
          dispatch({ type: 'UPD', image });
        }
      });
    });

    getData();
    return () => {
      subscriptionAdd.unsubscribe();
      subscriptionUpd.unsubscribe();
    }
  }, []);

  return (
    <Container>
      <FlatListCom images={state.images}
                   navigation={navigation}
                   edit={edit} 
                   dispatch={dispatch}
                   listToken={listToken}
                   setListToken={setListToken}/>
      <FooterCom onStateChange={props.extraData.onStateChange}/>
    </Container>
  );
}

const Stack = createStackNavigator();

const App = props => {
  const onStateChange = props.onStateChange;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {props => <HomeCom {...props} extraData={{onStateChange: onStateChange}} />}
        </Stack.Screen>
        <Stack.Screen name="Detail"
                      component={ImageDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
