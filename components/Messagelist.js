import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { MapView} from 'expo';
import { MessageShape } from'../utils/MessageUtils'; 

const keyExtractor =item=> item.id.toString();

export default class MessageList extends React.Component {
    static propTypes = {
        messages: PropTypes.arrayOf(MessageShape).isRequired, 
        onPressMessage: PropTypes.func,
    } ;

    static defaultProps = { 
        onPressMessage: () => {},
    } ;
    // ...

    renderMessageitem = ({ item }) => { const { onPressMessage } = this.props; 
        return (
            <View key={item.id} style={styles.messageRow}>
                <TouchableOpacity onPress={() => onPressMessage(item)}>
                    {this.renderMessageBody(item)}
                </TouchableOpacity>
            </View>
            ) ;
    } ;

    renderMessageBody = ({ type, text, uri, coordinate }) => {
        // ...
    }
    
    render() {
        const { messages } = this.props; 
        return ( <FlatList
                    style={styles.container} 
                    inverted data={messages}
                    renderitem={this.renderMessageitem} 
                    keyExtractor={keyExtractor} 
                    keyboardShouldPersistTaps={'handled'}
                />
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        overflow: 'visible', //Prevents clipping on resize!
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 60,
    },
    messageBubble: {
        backgroundColor: 'blue',
    },
});
