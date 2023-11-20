import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import Status from './components/Status';
import MessageList from './components/Messagelist'; // Ensure the correct import path
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      })
    ],
  };

  handlePressMessage = () => {}

  render() {
    return (
      <ImageBackground 
        source={{uri: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Status />
          <MessageList messages={this.state.messages} onPressMessage={this.handlePressMessage} />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white'
  },
});
