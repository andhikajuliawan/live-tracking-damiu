import {ActivityIndicator, View} from 'react-native';
import React from 'react';
import {Image} from 'native-base';

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#3DADE2',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../../assets/images/Logo-Damiu.png')}
        borderRadius="full"
        alt="profile"
        size="lg"
        mb={3}
      />
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default SplashScreen;
