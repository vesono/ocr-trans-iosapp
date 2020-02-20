import React from 'react';
import { StyleSheet } from 'react-native';
import { Header, Button, Text,
         Icon, Left, Body, Right } from 'native-base';

const HeaderCom = () => {

    return (
      <Header style={styles.header}>
        <Left>
        </Left>
        <Body>
          <Text>Home</Text>
        </Body>
        <Right>
          <Button transparent>
            <Icon type="AntDesign" name="ellipsis1" />
          </Button>
        </Right>
      </Header>
    );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default HeaderCom;
