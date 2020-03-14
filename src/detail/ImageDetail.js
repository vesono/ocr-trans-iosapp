import React, { useState } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { Container, Content, Button, Text, View,
         Card, CardItem, Icon, Left, Body, Right } from 'native-base';

import { s3GetObject } from '../db_function/storage';
import { updOcrResult, updTsrResult, sendCloudVison } from '../db_function/query';
import { textTranslate } from '../db_function/prediction';

const ITEM_WIDTH = Dimensions.get('window').width;

export const ImageDetail = props => {
  const navigation = props.navigation;
  const image = props.route.params.image;
  const [ocrText, setOcr] = useState(image.ocr_result);
  const [tsrText, setTsr] = useState(image.trans_result);

  return (
    <Container>
      <Content>
          <ImageDetailCom image={image}
                          setOcr={setOcr}/>
        <OcrCom id={image.id}
                ocrText={ocrText}
                setTsr={setTsr}/>
        <TranslateCom tsrText={tsrText}/>
      </Content>
    </Container>
    );
}

const ImageDetailCom = props => {
  const setOcr = props.setOcr;
  const image = props.image;

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
    const ocrText = result.responses["0"].fullTextAnnotation.text;
    await updOcrResult(id, ocrText);
    setOcr(ocrText);
  }

  return(
    <View>
      <Card>
        <CardItem>
          <Left>
            <Text>{image.image_name}</Text>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image source={{uri: image.s3_url}}
                 resizeMode='contain'
                 style={styles.image}/>
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
    </View>
  );
}

const OcrCom = props => {
  const id = props.id;
  const ocrText = props.ocrText;
  const setTsr = props.setTsr;

  /**
   * 翻訳処理
   * @param {string} text 
   */
  const translate = async (id, text) => {
    const result = await textTranslate(text);
    await updTsrResult(id, result.text)
    setTsr(result.text);
  }

  return(
    <View>
      {ocrText !== null ?
        <Card>
          <CardItem header>
              <Text>・読み取り結果</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{ocrText}</Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left />
            <Right>
              <Button bordered success small
                      onPress={() => translate(id, ocrText)}>
                <Text>翻訳</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
        : <Text></Text>
      }
    </View>
  );
}

const TranslateCom = props => {
  const tsrText = props.tsrText;

  return(
    <View>
      {tsrText !== null ?
        <Card>
          <CardItem header>
              <Text>・翻訳結果</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{tsrText}</Text>
            </Body>
          </CardItem>
        </Card>
        : <Text></Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: ITEM_WIDTH,
    flex: 1
  }
});
