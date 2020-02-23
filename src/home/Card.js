import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Button, Card, CardItem, Icon, Left, Body, Right } from 'native-base';
import { deleteImage } from '../db_function/query';

const CardCom = props => {
  const navigation = props.navigation;
  const image = props.image;

  return (
    <Card key={image.id} style={styles.card}>
      <CardItem>
        <Left />
        <Right>
          <Button bordered small danger
                  onPress={() => deleteImage(image.id)}>
            <Icon type="AntDesign" name="delete" />
          </Button>
        </Right>
      </CardItem>
      <CardItem cardBody>
        <Image source={{uri: image.image_url}}
               style={styles.image}/>
      </CardItem>
      <CardItem>
        <Left />
        <Right>
          <Button bordered small
                  onPress={() => navigation.navigate('Detail')}>
           <Icon type="AntDesign" name="ellipsis1" />
         </Button>
        </Right>
      </CardItem>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '49%'
  },
  image: {
    height: 150,
    width: null,
    flex: 1
  }
});

export default CardCom;
