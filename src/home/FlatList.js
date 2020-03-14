import React from 'react';
import { StyleSheet, FlatList} from 'react-native';
import { Button, Text, Icon, View } from 'native-base';
import CardCom from '../home/Card';

const FlatListCom = props => {
  return (
    <View style={styles.view}>
    { props.images.length >0 ?
      <FlatList data={props.images}
                extraData={props.images}
                renderItem={({ item }) => (
                    <CardCom
                    image={item}
                    navigation={props.navigation}
                    edit={props.edit} 
                    dispatch={props.dispatch}
                    />
                )}
                keyExtractor={item => item.id}
      >
      </FlatList>
      : <Text></Text>
    }
    </View>
  )
}

const styles = StyleSheet.create({
    view: {
      paddingTop: 5,
      flex: 1,
    }
  });

export default FlatListCom;
