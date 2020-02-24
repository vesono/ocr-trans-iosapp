import React, { useState, useReducer, useEffect } from 'react';
import { StyleSheet} from 'react-native';
import { Container, Content, Button, Text, Icon, View } from 'native-base';
import Amplify, { Auth, I18n } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import awsconfig from './aws-exports';
import PubSub from '@aws-amplify/pubsub';
import { withAuthenticator } from 'aws-amplify-react-native';
import { onCreateOcrImage } from './src/graphql/subscriptions'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CardCom from './src/home/Card';
import FooterCom from './src/home/Footer';
import { ImageDetail } from './src/detail/ImageDetail'
import { listImage } from './src/db_function/query';
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

  const { navigation } = props;
  navigation.setOptions({
    headerRight: () => (
      <Button transparent >
        <Icon type="SimpleLineIcons" name="menu" />
      </Button>
    )
  });

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
        ...value, s3_url: await s3Get(value.image_url)
      })));
      dispatch({ type: 'LIST', images: arrayDataGetUrl });
    }

    let subscription;
    getUser().then(user => {
      subscription = API.graphql(graphqlOperation(onCreateOcrImage, {owner: user.username})).subscribe({
        next: async eventData => {
          const image = eventData.value.data.onCreateOcrImage;
          image.s3_url = await s3Get(image.image_url);
          dispatch({ type: 'ADD', image });
        }
      });
    });

    getData();
    console.log(state);
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <Container>
      <Content>
        <View style={styles.content}>
        { state.images.length >0 ?
            state.images.map( image => (
            <CardCom image={image}
                     navigation={navigation} />
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
  }
});

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeCom} />
        <Stack.Screen name="Detail" component={ImageDetail} />
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
