import React, { Component } from 'react';
import { Container, View, Header, Left,
         Body, Right, Button, Title, Text, Thumbnail } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {image: null,};
    this.showPicker = this.showPicker.bind(this);
  }

  showPicker() {
    alert("アラート表示");
    console.log("コンソールログ")
  }

  render() {
    return (
      <View style={{flex:1, paddingVertical:80, alignItems:'center'}}>
        <Text>Open up App.js to start working on your app!</Text>
         <Button title="Click Me" onPress={this.showPicker} />
      </View>
    );
  }
}
