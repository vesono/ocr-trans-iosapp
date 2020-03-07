import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Footer, Icon, Left, Body, Right } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { insertNewImage } from '../db_function/query';
import { s3Upload } from '../db_function/storage';
import { logOut } from '../home/Auth';

/**
 * 現在時刻取得
 */
const nowtime = () => {
  const moment = require('moment');
  return moment().format('YYYYMMDDHHmmssSSS');
}
/**
 * カメラロールpermission取得
 */
const getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
}

const FooterCom = props => {

  /**
   * ログアウト処理
   */
  const _logOut = async () => {
    await logOut();
    props.onStateChange('signedOut')
  }

  /**
   * 画像追加処理
   */
  const pickImage = async () => {
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
      // DB追加
      await insertNewImage(imageFileName, s3fileName);
    }
  }

  return (
    <Footer style={styles.headfooter}>
      <Left>
        <Button transparent
                onPress={() => _logOut()}>
          <Icon type="Entypo" name="log-out" />
        </Button>
      </Left>
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
