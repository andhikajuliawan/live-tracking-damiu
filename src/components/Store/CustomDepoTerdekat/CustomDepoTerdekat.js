import {Box, HStack, Image, Text, VStack} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomDepoTerdekat = ({nama, alamat, jarak, onPressDepo}) => {
  return (
    <Box marginX={0.5} bgColor="white" marginBottom={2} shadow={1} rounded={9}>
      <TouchableOpacity onPress={onPressDepo}>
        <HStack alignItems="center" justifyContent="space-around" mx={3} my={2}>
          <HStack alignItems="center">
            <Image
              source={require('../../../../assets/images/icon-shop.png')}
              size="sm"
              alt="icon-shop"
            />
            <VStack marginLeft={2} width="70%">
              <Text fontSize={14} fontFamily="Poppins-Regular">
                {nama}
              </Text>
              <Text fontSize={10} fontFamily="Poppins-Regular">
                {alamat}
              </Text>
              <Text fontSize={12} fontFamily="Poppins-Regular">
                {jarak}
              </Text>
            </VStack>
          </HStack>

          <Ionicons name="chevron-forward-outline" color="#3DADE2" size={30} />
        </HStack>
      </TouchableOpacity>
    </Box>
  );
};

export default CustomDepoTerdekat;
