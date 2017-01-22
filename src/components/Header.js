import React, { PropTypes } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Pacifico } from '../fonts';
import { WINDOW_WIDTH } from '../constants';

export default function Header({ title, iconAction, icon }) {
  return (
    <View style={styles.container}>
      <View style={styles.side} />
      <Pacifico>
        <Text style={styles.title}>
          {title}
        </Text>
      </Pacifico>
      <TouchableOpacity
        style={styles.side}
        onPress={iconAction}
      >
        <Icon name={icon} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconAction: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        shadowRadius: 5,
        shadowColor: '#000000',
        shadowOpacity: 0.8,
      },
      android: {
        elevation: 1,
      },
    }),
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 25,
  },
  side: {
    width: WINDOW_WIDTH / 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
