import {HStack, Box, Input, Icon, Pressable} from 'native-base';

import React from 'react';
import {TouchableOpacity} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({
  onPressMail,
  onPressBasket,
  onPressBack,
  value,
  setValue,
  onPressSearch,
  placeholder,
  keranjang,
}) => {
  return (
    <HStack justifyContent="space-between" my={4} alignItems="center">
      <HStack width="70%" alignItems="center">
        <TouchableOpacity onPress={onPressBack}>
          <Ionicons name="chevron-back-outline" color="#9098B1" size={30} />
        </TouchableOpacity>
        <Input
          InputLeftElement={
            <Icon
              as={<Ionicons name="search-outline" />}
              size={6}
              ml="2"
              color="#525252"
              onPress={onPressSearch}
            />
          }
          value={value}
          onChangeText={setValue}
          variant="filled"
          placeholder={placeholder}
          fontSize={14}
          width="100%"
          color="#525252"
          bgColor="#FCFEFF"
        />
      </HStack>
      <HStack>
        <Ionicons name="mail" color="#3DADE2" size={25} onPress={onPressMail} />
        {keranjang ? (
          <Box marginX={1}>
            <TouchableOpacity onPress={onPressBasket}>
              <Ionicons name="basket" color="#3DADE2" size={25} />
            </TouchableOpacity>
          </Box>
        ) : (
          <></>
        )}
      </HStack>
    </HStack>
  );
};

export default CustomHeader;
