import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Footer, Icon, Left, Body, Right } from 'native-base';

const FooterCom = () => {

    return (
      <Footer style={styles.headfooter}>
        <Left></Left>
        <Body></Body>
        <Right>
        <Button transparent>
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
