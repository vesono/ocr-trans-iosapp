import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Footer, Icon, Left, Body, Right } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { insertNewImage } from '../../src/db_function/query';
import { s3Upload } from '../../src/db_function/storage';

const nowtime = () => {
  /**
   * 現在時刻取得
   */
  const moment = require('moment');
  return moment().format('YYYYMMDDHHmmssSSS');
}

const FooterCom = () => {

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

  return (
    <Footer style={styles.headfooter}>
      <Left></Left>
      <Body></Body>
      <Right>
      <Button transparent
              onPress={() => pickImage()}>
          <Icon type="AntDesign" name="plus" />
        </Button>
      </Right>
    </Footer>
    );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default FooterCom;
