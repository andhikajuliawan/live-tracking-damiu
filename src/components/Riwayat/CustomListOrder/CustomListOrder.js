import {HStack, Text, Button, Box, VStack, Center} from 'native-base';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomListOrder = ({
  order,
  tanggal,
  jumlah,
  harga,
  onPressDetails,
  status,
  alamat,
  onPressBelumDiproses,
  onPressDiproses,
  onPressMenungguDikirim,
  onPressDikirim,
  getCoordinate,
  coordinate,
}) => {
  // Make Hitung Mundur
  const date = tanggal;
  const date1 = new Date(date);
  const date2 = new Date();
  const secondDifference = (date2 - date1) / 1000;
  let totalMinutes = Math.floor(secondDifference / 60);
  let seconds = Math.floor(secondDifference % 60);
  let hours = Math.floor(totalMinutes / 60);
  let minutes = Math.floor(totalMinutes % 60);
  let jumlahJam = 0;
  if (hours == 0) {
    jumlahJam = minutes + ' menit ' + seconds + 'detik';
  } else {
    jumlahJam = hours + ' jam ' + minutes + ' menit ' + seconds + 'detik';
  }

  // Make to rupiah
  let number_string = harga.toString(),
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
          {status == 'Selesai' ? tanggal : jumlahJam}
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
            Rp. {toRupiah}
          </Text>
        </HStack>
      </HStack>
      <Text fontSize={12} fontFamily="Poppins-Regular" mb={2} color="#9098B1">
        Alamat :
      </Text>
      <Text fontSize={14} fontFamily="Poppins-Regular" mb={2}>
        {alamat}
      </Text>
      {status == 'Belum Diproses' ? (
        <HStack width="100%" justifyContent="space-between" mb={4}>
          <VStack>
            {coordinate == '' ? (
              <Text
                fontSize={12}
                fontFamily="Poppins-SemiBold"
                mb={2}
                width="100%">
                Klik untuk mendapatkan lokasi saat ini
              </Text>
            ) : (
              <Text
                color="#28a745"
                fontSize={12}
                fontFamily="Poppins-SemiBold"
                mb={2}
                width="100%">
                lokasi sudah didapatkan
              </Text>
            )}
          </VStack>

          <Button rounded="lg" width={12} height={10} onPress={getCoordinate}>
            <Ionicons name="locate-outline" color="#fff" size={20} />
          </Button>
        </HStack>
      ) : (
        <></>
      )}

      <HStack justifyContent="space-between" alignItems="center">
        <Button
          borderRadius={50}
          variant="outline"
          borderColor="#000"
          onPress={onPressDetails}>
          <Text mx={3}>Details</Text>
        </Button>
        {status == 'Belum Diproses' ? (
          coordinate == '' ? (
            <Button
              isDisabled
              borderRadius={50}
              variant="outline"
              bg="#f0ad4e"
              onPress={onPressBelumDiproses}>
              <Text mx={3} color="#fff">
                Dikirim
              </Text>
            </Button>
          ) : (
            <Button
              borderRadius={50}
              variant="outline"
              bg="#f0ad4e"
              onPress={onPressBelumDiproses}>
              <Text mx={3} color="#fff">
                Dikirim
              </Text>
            </Button>
          )
        ) : status == 'Dikirim' ? (
          <Button
            borderRadius={50}
            variant="outline"
            bg="#5cb85c"
            onPress={onPressDikirim}>
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
        )}
      </HStack>
    </Box>
  );
};

export default CustomListOrder;
