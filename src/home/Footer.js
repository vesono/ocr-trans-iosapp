import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Footer, Icon, Left, Body, Right } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { insertNewImage, sendCloudVison } from '../../src/db_function/query';
import { s3Upload } from '../../src/db_function/storage';

const nowtime = () => {
  /**
   * 現在時刻取得
   */
  const moment = require('moment');
  return moment().format('YYYYMMDDHHmmssSSS');
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

const FooterCom = () => {

  const pickImage = async () => {
    /**
     * ライブラリーから選択して画像取得
     */
    await getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
  
    if (!result.cancelled) {
      // s3追加
      const imageFileName = result.uri.split('/').slice(-1)[0];
      const s3fileName = nowtime() + '_' + imageFileName;
      await s3Upload(s3fileName, result.base64);
      // OCR処理
      const ocrResult = await sendCloudVison(result.base64);
      console.log(ocrResult);
      // DB追加
      await insertNewImage(imageFileName, s3fileName, ocrResult);
    }
  }

  return (
    <Footer style={styles.headfooter}>
      <Left />
      <Body />
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
