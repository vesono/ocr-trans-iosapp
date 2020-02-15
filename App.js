import React, { useReducer, useEffect } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Button, Text, Thumbnail,
         Card, CardItem, Icon, Left, Body, Right } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

// 初期値設定
const initialState = {
  image: null
}

const App = () => {

  const reducer = (state, action) => {
    /**
     * reducer定義
     */
    switch (action.type) {
      case 'ADD':
        return {image: action.image};
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
      quality: 1
    });
    console.log(result);
  
    if (!result.cancelled) {
      dispatch({ type: 'ADD', image: result.uri });
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    getPermissionAsync();
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
      { state.image &&
      <Card>
        <CardItem>
          <Left>
            <Body>
              <Text>NativeBase</Text>
              <Text note>GeekyAnts</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image source={{uri: state.image}} style={{height: 200, width: null, flex: 1}}/>
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
      }
    </Content>
  </Container>
  );
}

export default App;
