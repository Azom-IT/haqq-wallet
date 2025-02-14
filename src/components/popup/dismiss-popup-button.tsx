import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

import {Color} from '@app/colors';

import {Icon, IconButton} from '../ui';

export const DismissPopupButton = () => {
  const navigation = useNavigation();
  return (
    <IconButton style={page.container} onPress={navigation.goBack}>
      <Icon i24 name="close_circle" color={Color.graphicSecond2} />
    </IconButton>
  );
};

const page = StyleSheet.create({
  container: {width: 24, height: 24},
});
