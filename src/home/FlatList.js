import React from 'react';
import { StyleSheet, FlatList} from 'react-native';
import { Button, Text, View } from 'native-base';

import CardCom from '../home/Card';
import { listData, listDataAddObj } from '../db_function/query';

const FlatListCom = props => {

  const images = props.images;
  const dispatch = props.dispatch;
  const listToken = props.listToken;
  const setListToken = props.setListToken;

  const endReachedFetchData = async () => {
    console.log("end reached");
    if (listToken !== null) {
      const result = await listData(listToken);
      console.log(result)
      const arrayData = result.data.mainList.items;
      const images = await listDataAddObj(arrayData);
      setListToken(result.data.mainList.nextToken);
      dispatch({ type: 'LIST_PN', images });
    }
  }

  return (
    <View style={styles.view}>
    { props.images.length >0 ?
      <FlatList data={images}
                extraData={images}
                renderItem={({ item }) => (
                    <CardCom
                    image={item}
                    navigation={props.navigation}
                    edit={props.edit} 
                    dispatch={dispatch}
                    />
                )}
                keyExtractor={item => item.id}
                onEndReached={() => endReachedFetchData()}
                onEndReachedThreshold={0.01}
      >
      </FlatList>
      : <Text></Text>
    }
    </View>
  );
}

const styles = StyleSheet.create({
    view: {
      paddingTop: 5,
      flex: 1,
    }
  });

export default FlatListCom;
