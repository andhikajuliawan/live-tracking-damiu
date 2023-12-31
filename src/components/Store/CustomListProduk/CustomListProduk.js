import React, {useState, useRef, useContext} from 'react';
import {
  VStack,
  Image,
  Text,
  HStack,
  Divider,
  Pressable,
  AlertDialog,
  Button,
  Box,
  Center,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

// untuk keperluan axios
import {AuthContext} from '../../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../../config';
import {TouchableOpacity} from 'react-native';

const CustomListProduk = ({
  customer_id,
  depo_id,
  produk_id,
  nama,
  harga,
  stock,
  // onPressAddProduct,
}) => {
  // Alert Dialog
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  const onPressAddProduct1 = () => {
    setIsOpen(!isOpen);

    onPressAddProduct();
  };

  const onPressAddProduct = () => {
    console.log(customer_id, depo_id, produk_id, nama, harga);
    axios
      .post(
        `${BASE_URL}/cart`,
        {
          customer_id: customer_id,
          depo_id: depo_id,
          product_id: produk_id,
          product_amount: 1,
          product_price: harga,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(res => console.log(res))
      .catch(e => {
        console.log(`register error ${e}`);
      });
  };

  // Make to Rupiah
  let number_string = harga.toString(),
    sisa = number_string.length % 3,
    rupiah = number_string.substr(0, sisa),
    ribuan = number_string.substr(sisa).match(/\d{3}/g);
  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
  let toRupiah = rupiah;

  const {userInfo, isLoading, logout} = useContext(AuthContext);

  return (
    <VStack
      backgroundColor="#fff"
      shadow={3}
      width="45%"
      my={2}
      borderRadius={10}
      py={2}>
      <Image
        source={
          stock > 5
            ? require('../../../../assets/images/aqua.png')
            : require('../../../../assets/images/club.png')
        }
        alt="produk"
        size="xl"
        m="auto"
        mb={2}
      />
      <VStack px={3}>
        <Text fontFamily="Poppins-Regular" fontSize={14}>
          {nama}
        </Text>
        <Text fontFamily="Poppins-Bold" fontSize={14} color="#3DADE2">
          Rp {toRupiah}
        </Text>
        <Text
          fontFamily="Poppins-Regular"
          fontSize={11}
          color={stock > 5 ? '#525252' : '#FF0000'}>
          Stock : {stock} buah
        </Text>
      </VStack>
      <Divider my={2} />
      <TouchableOpacity onPress={onPressAddProduct1}>
        <HStack
          py={2}
          mb={1}
          mx={2}
          bgColor="#3DADE2"
          borderRadius={10}
          // borderTopLeftRadius={10}
          alignItems="center"
          justifyContent="center">
          <Ionicons name="add-outline" color="white" size={20} />
          <Text color="white" fontFamily="Poppins-Bold" fontSize={12}>
            Keranjang
          </Text>
        </HStack>
      </TouchableOpacity>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.Body>
            <VStack textAlign="center">
              <HStack justifyContent="center">
                <Image
                  source={require('../../../../assets/images/successIcon.png')}
                  alt="successIcon"
                  width={10}
                  height={10}
                  resizeMode="stretch"
                />
              </HStack>

              <Text textAlign="center" my={3}>
                Barang berhasil ditambahkan
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Box
                  borderRadius={50}
                  bgColor="#3DADE2"
                  alignItems="center"
                  py={2}
                  width="100%">
                  <Text color="#fff">Oke</Text>
                </Box>
              </TouchableOpacity>
            </VStack>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </VStack>
  );
};

export default CustomListProduk;
