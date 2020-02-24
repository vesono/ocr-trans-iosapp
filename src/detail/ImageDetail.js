import React from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Text, View,
         Card, CardItem, Icon, Left, Body, Right } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

export const ImageDetail = props => {
  const navigation = props.navigation;
  const image = props.route.params.image;

  const ocrImage = async imageName => {
    /**
     * 画像OCR処理
     */
    // const result = await sendCloudVison(url);
    // console.log(result);
  }

  return (
    <Container>
      <Content>
        <View>
          <Card>
            <CardItem>
              <Left>
                <Body>
                  <Text>{image.image_name}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: image.s3_url}} style={{height: 250, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left />
              <Right>
                <Button bordered success small
                        onPress={() => ocrImage(image.image_url)}>
                  <Text>読み取り</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </View>
      </Content>
    </Container>
    );
}