import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { Button, Card, CardItem, Icon, Left, Body, Right,View } from 'native-base';
import { deleteImage } from '../db_function/query';
import { s3Delete } from '../db_function/storage';

const ITEM_WIDTH = Dimensions.get('window').width;

const CardCom = props => {
  const navigation = props.navigation;
  const image = props.image;
  const edit = props.edit;

  /**
   * 削除処理
   */
  const imageDel = async kid => {
    await s3Delete(kid);
    await deleteImage(kid);
    props.dispatch({ type: 'DEL', kid })
  }

  return (
    <Card key={image.id} style={styles.card}>
      {edit === true ?
      <CardItem>
        <Left />
        <Right>
        <Button bordered small danger
                onPress={() => imageDel(image.id)}>
          <Icon type="AntDesign" name="delete" />
        </Button>
        </Right>
      </CardItem>
        : <View />
      }  
      <CardItem cardBody>
        <Image source={{uri: image.s3_url}}
               resizeMode='contain'
               style={styles.image}/>
      </CardItem>
      <CardItem>
        <Left />
        <Right>
          <Button bordered small
                  onPress={() => navigation.navigate('Detail', {
                    image: image
                  })}>
           <Icon type="AntDesign" name="ellipsis1" />
         </Button>
        </Right>
      </CardItem>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 0.5
  },
  image: {
    height: 150,
    width: null,
    flex: 1
  }
});

export default CardCom;
