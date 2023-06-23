import React from 'react';
import {Box, HStack, VStack, Text, Image} from 'native-base';

const CustomListProduk = ({namaProduk, jumlah, hargaProduk}) => {
  // Make to rupiah
  let number_string = hargaProduk.toString(),
    sisa = number_string.length % 3,
    rupiah = number_string.substr(0, sisa),
    ribuan = number_string.substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
  let toRupiah = rupiah;
  return (
    <Box
      bgColor="#fff"
      mx={4}
      borderRadius={10}
      py={4}
      px={1}
      mt={3}
      shadow={3}>
      <HStack>
        <Image
          width="30%"
          source={require('../../../../assets/images/aqua.png')}
          size="md"
          alt="produk"
        />
        <VStack justifyContent="space-evenly" width="70%">
          <Text fontFamily="Poppins-SemiBold" fontSize={14}>
            {namaProduk}
          </Text>
          <HStack justifyContent="space-between">
            <Text fontFamily="Poppins-Regular" fontSize={12} color="#9B9B9B">
              Jumlah : {jumlah}
            </Text>
            <Text fontFamily="Poppins-Regular" fontSize={12} color="#3DADE2">
              Rp. {toRupiah}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CustomListProduk;
