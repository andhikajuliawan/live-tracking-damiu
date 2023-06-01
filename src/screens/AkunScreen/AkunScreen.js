import {HStack, Text, Divider, Image, VStack, Box, Button} from 'native-base';
import React, {useState, useEffect, useContext} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';

const AkunScreen = () => {
  const navigation = useNavigation();

  //

  const [nama, setNama] = useState('');
  const [akun, setAkun] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Untuk Logout
  const {userInfo, isLoading, logout} = useContext(AuthContext);

  console.log(userInfo.user.user_category);

  return (
    <Box bgColor="#fff" flex={1}>
      <Box px={4}>
        <HStack mt={10} alignItems="center" justifyContent="space-between">
          <HStack alignItems="center">
            <Box shadow="1" borderRadius="full">
              <Image
                source={require('../../../assets/images/icon-user.png')}
                borderRadius="full"
                alt="profile"
                size="sm"
              />
            </Box>

            <VStack ml={3}>
              <Text color="#223263" fontFamily="Poppins-Bold" fontSize={16}>
                {userInfo.user.user_category == 3
                  ? userInfo.information.owner_name
                  : userInfo.information.customer_name}
              </Text>
              <Text color="#9098B1" fontFamily="Poppins-Regular" fontSize={12}>
                @{userInfo.information.username}
              </Text>
            </VStack>
          </HStack>
        </HStack>
        <Divider my={5} thickness={0.5} />
        <HStack justifyContent="space-between" alignItems="center" width="100%">
          <HStack width="40%">
            <Ionicons name="mail-outline" size={20} color="#3DADE2" />
            <Text
              ml={2}
              color="#223263"
              fontFamily="Poppins-Bold"
              fontSize={14}>
              Email
            </Text>
          </HStack>
          <Text
            textAlign="right"
            width="60%"
            color="#9098B1"
            fontFamily="Poppins-Regular"
            fontSize={12}>
            {userInfo.user.user_category == 3
              ? userInfo.information.owner_email
              : userInfo.information.customer_email}
          </Text>
        </HStack>
        <HStack
          mt={4}
          justifyContent="space-between"
          alignItems="center"
          width="100%">
          <HStack width="40%">
            <Ionicons name="phone-portrait-outline" size={20} color="#3DADE2" />
            <Text
              ml={2}
              color="#223263"
              fontFamily="Poppins-Bold"
              fontSize={14}>
              Phone Number
            </Text>
          </HStack>
          <Text
            textAlign="right"
            width="60%"
            color="#9098B1"
            fontFamily="Poppins-Regular"
            fontSize={12}>
            {userInfo.user.user_category == 3
              ? userInfo.information.owner_phone
              : userInfo.information.customer_phone}
          </Text>
        </HStack>
        <HStack mt={4} justifyContent="space-between" width="100%">
          <HStack width="40%">
            <Ionicons name="location-outline" size={20} color="#3DADE2" />
            <Text
              ml={2}
              width="60%"
              color="#223263"
              fontFamily="Poppins-Bold"
              fontSize={14}>
              Address
            </Text>
          </HStack>
          <Text
            textAlign="right"
            width="50%"
            color="#9098B1"
            fontFamily="Poppins-Regular"
            fontSize={12}>
            {userInfo.user.user_category == 3
              ? userInfo.information.owner_address
              : userInfo.information.customer_address}
          </Text>
        </HStack>
      </Box>
      <Button mx={4} mt={20} bgColor="#3DADE2" onPress={logout}>
        Logout
      </Button>
    </Box>
  );
};

export default AkunScreen;
