import React from 'react';
import { StyleSheet, View, ImageBackground, Image, Alert, TouchableHighlight, BackHandler, KeyboardAvoidingView, Platform } from 'react-native';
import Status from './components/Status';
import MessageList from './components/Messagelist'; 
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import Toolbar from './components/Toolbar';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default class App extends React.Component {
  state = {
    messages: [
    ],
    fullscreenImageId: null,
    isInputFocused: false,
  };

  handlePressToolbarCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is not granted');
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log("Camera result:", result); 
  
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      console.log('Captured image URI:', result.assets[0].uri);
      this.setState({
        messages: [createImageMessage(result.assets[0].uri), ...this.state.messages],
      });
    }
  };

  
  handlePressToolbarLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      messages: [createLocationMessage({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }), ...this.state.messages],
    });
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };
  
  renderToolbar() {
    const { isInputFocused } = this.state;

    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

    
  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null })
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
  
    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;
  
    const { uri } = image;
    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
        underlayColor="transparent"
      >
        <Image style={styles.fullscreenImage} source={{ uri }} resizeMode="contain" />
      </TouchableHighlight>
    );
  };
  
  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert('Delete', 'Are you sure you want to delete this message?',
          [{ text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive',
              onPress: () => this.handleDeleteMessage(item.id)},]
        );
        break;
      
      case 'image':
        this.setState({ fullscreenImageId: id });
        break;
      
      default:
        break;
    }
  };
  
  handleDeleteMessage = (id) => {
    this.setState((state) => ({
      messages: state.messages.filter(message => message.id !== id),
    }));
  };

  componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    return (
      <ImageBackground 
        source={{uri: 'https://www.nawpic.com/media/2020/minimalist-iphone-nawpic.jpg'}}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Status />
          {this.renderFullscreenImage()}
          <MessageList messages={this.state.messages} onPressMessage={this.handlePressMessage} />
          {this.renderToolbar()} 
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
    borderTopColor: 'rgba(0,0,0,0.5)',
    backgroundColor: 'white',
    width: '100%',
    height: 30, 
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
});
