import React, { useState } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Text, View,
         Card, CardItem, Icon, Left, Body, Right } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { s3GetObject } from '../db_function/storage';
import { updOcrResult, sendCloudVison } from '../db_function/query';

export const ImageDetail = props => {
  const navigation = props.navigation;
  const image = props.route.params.image;
  const [ocrText, setOcr] = useState(image.ocr_result);

  /**
   * 画像ocr処理
   * @param {string} id 
   * @param {string} imageName 
   */
  const ocrImage = async (id, imageName) => {
    const imageData = await s3GetObject(imageName)
    const imageDataBase64 = imageData.Body.toString('base64')
    const result = await sendCloudVison(imageDataBase64);
    console.log(result);
    await updOcrResult(id, result);
    setOcr(result);
  }

  return (
    <Container>
      <Content>
        <View>
          <Card>
            <CardItem>
              <Left>
                <Text>{image.image_name}</Text>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: image.s3_url}} style={{height: 250, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left />
              <Right>
                <Button bordered success small
                        onPress={() => ocrImage(image.id, image.image_url)}>
                  <Text>読み取り</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          {ocrText !== '' ?
            <Card>
              <CardItem header>
                  <Text>・読み取り結果</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>{ocrText}</Text>
                </Body>
              </CardItem>
            </Card>
            : <Text></Text>
          }
        </View>
      </Content>
    </Container>
    );
}
