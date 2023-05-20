import {HStack, Text, Button, Box} from 'native-base';
import React from 'react';

const CustomListPembelian = ({
  order,
  tanggal,
  jumlah,
  harga,
  onPressDetails,
  status,
  alamat,
}) => {
  return (
    <Box
      mx={4}
      px={5}
      py={4}
      bg="#fff"
      borderRadius={10}
      shadow={3}
      mt={2}
      mb={2}>
      <HStack justifyContent="space-between">
        <Text
          fontSize={14}
          fontFamily="Poppins-Bold"
          mb={2}
          color="#223263"
          fontWeight="bold">
          Order No {order}
        </Text>
        <Text fontSize={12} fontFamily="Poppins-Regular" mb={2} color="#9098B1">
          {tanggal}
        </Text>
      </HStack>
      <HStack justifyContent="space-between">
        <Text fontSize={12} fontFamily="Poppins-Regular" mb={2} color="#9098B1">
          Jumlah : {jumlah}
        </Text>
        <HStack>
          <Text
            fontSize={12}
            fontFamily="Poppins-Regular"
            mb={2}
            color="#9098B1">
            Total Harga :{' '}
          </Text>
          <Text fontSize={12} fontFamily="Poppins-Regular" mb={2}>
            Rp. {harga}
          </Text>
        </HStack>
      </HStack>
      <HStack justifyContent="space-between">
        <Text fontSize={12} fontFamily="Poppins-Regular" mb={2} color="#9098B1">
          Status :
        </Text>
        <Text fontSize={12} fontFamily="Poppins-Regular" mb={2}>
          {status}
        </Text>
      </HStack>
      <Text fontSize={12} fontFamily="Poppins-Regular" mb={2} color="#9098B1">
        Alamat :
      </Text>
      <Text fontSize={14} fontFamily="Poppins-Regular" mb={2}>
        {alamat}
      </Text>
      <HStack justifyContent="space-between" alignItems="center">
        <Button
          borderRadius={50}
          variant="outline"
          borderColor="#000"
          onPress={onPressDetails}>
          <Text mx={3}>Details</Text>
        </Button>
        {/* {status == 'Belum Diproses' ? (
          <Button
            success
            borderRadius={50}
            bg="#f0ad4e"
            onPress={() => {
              alert('proses');
            }}>
            <Text mx={3} color="#fff">
              Diproses
            </Text>
          </Button>
        ) : status == 'Diproses' ? (
          <Button
            borderRadius={50}
            variant="outline"
            bg="#f0ad4e"
            onPress={onPressDetails}>
            <Text mx={3} color="#fff">
              Menunggu Dikirim
            </Text>
          </Button>
        ) : status == 'Menunggu Dikirim' ? (
          <Button
            borderRadius={50}
            variant="outline"
            bg="#f0ad4e"
            onPress={onPressDetails}>
            <Text mx={3} color="#fff">
              Dikirim
            </Text>
          </Button>
        ) : status == 'Dikirim' ? (
          <Button
            borderRadius={50}
            variant="outline"
            bg="#5cb85c"
            onPress={onPressDetails}>
            <Text mx={3} color="#fff">
              Selesai
            </Text>
          </Button>
        ) : (
          <Button borderRadius={50} variant="outline" bg="#5cb85c" isDisabled>
            <Text mx={3} color="#fff">
              Selesai
            </Text>
          </Button>
        )} */}
      </HStack>
    </Box>
  );
};

export default CustomListPembelian;
