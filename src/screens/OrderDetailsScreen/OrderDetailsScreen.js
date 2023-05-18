import {HStack, Divider, Text, Box, Spinner, Pressable} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {CustomListProduk} from '../../components/OrderDetails';

import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';

const OrderDetailsScreen = ({route}) => {
  const navigation = useNavigation();

  const [listProduk, setListProduk] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {userInfo} = useContext(AuthContext);

  useEffect(() => {
    console.log(route.params.id);
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/customer_order_detail/ ${route.params.id.id}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      })
      .then(res => res.data)
      .then(data => setListProduk(data.order_detail))

      .catch(e => {
        console.log(`register error ${e}`);
      });
    setIsLoading(false);

    return () => {};
  }, []);

  onPressLihatUpdatePengiriman = () => {
    navigation.navigate('LiveTracking', {info: route.params});
  };

  return (
    <Box bgColor="#fff" flex={1}>
      <HStack mt={5} mb={4} alignItems="center" px={4}>
        <Ionicons
          name="chevron-back-outline"
          size={25}
          color="#9098B1"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text fontFamily="Poppins-Bold" fontSize={16} color="#223263" ml={3}>
          Order Details
        </Text>
      </HStack>
      <Divider thickness={0.5} />

      {isLoading ? (
        <Spinner color="#3DADE2" my={5} flex={1} size="lg" />
      ) : (
        <>
          <Box
            mx={4}
            px={5}
            py={4}
            bg="#fff"
            borderRadius={10}
            shadow={3}
            mt={3}>
            <HStack justifyContent="space-between">
              <Text
                fontSize={14}
                fontFamily="Poppins-Bold"
                mb={2}
                color="#223263">
                Order No {route.params.id.no_order}
              </Text>
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                {route.params.id.order_datetime}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                status :
              </Text>
              <HStack>
                <Text
                  fontSize={12}
                  fontFamily="Poppins-Regular"
                  mb={2}
                  color="#2AA952">
                  {route.params.id.order_status}
                </Text>
              </HStack>
            </HStack>
            <Divider my={2} />

            {route.params.id.order_status == 'Dikirim' ? (
              <Pressable onPress={onPressLihatUpdatePengiriman}>
                <HStack justifyContent="space-between">
                  <Text
                    fontSize={12}
                    fontFamily="Poppins-Regular"
                    mb={2}
                    color="#3DADE2">
                    lihat Update Pengiriman
                  </Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="#3DADE2"
                  />
                </HStack>
              </Pressable>
            ) : route.params.id.order_status == 'Belum Diproses' ? (
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Pesanan anda akan segera kami proses
              </Text>
            ) : route.params.id.order_status == 'Diproses' ? (
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Pesanan anda sedang kami proses
              </Text>
            ) : route.params.id.order_status == 'Menunggu Dikirim' ? (
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Pesanan anda sudah kami proses dan menunggu pengiriman
              </Text>
            ) : (
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Pesanan anda telah sampai ditujuan
              </Text>
            )}
          </Box>

          {listProduk.map((list, index) => (
            <CustomListProduk
              key={index}
              source={list}
              namaProduk={list.product.product_name}
              jumlah={list.order_amount}
              hargaProduk={list.order_price}
            />
          ))}

          <Box
            mx={4}
            px={5}
            py={4}
            bg="#fff"
            borderRadius={10}
            shadow={3}
            mt={3}>
            <HStack justifyContent="space-between">
              <Text
                fontSize={10}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Alamat :
              </Text>
              <Text
                fontSize={10}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#000"
                width="60%"
                textAlign="left">
                {route.params.id.order_location}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                fontSize={10}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Metode Pembayaran :
              </Text>
              <HStack>
                <Text
                  fontSize={10}
                  fontFamily="Poppins-Regular"
                  mb={2}
                  color="#000"
                  width="60%"
                  textAlign="left">
                  COD (Bayar Ditempat)
                </Text>
              </HStack>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                fontSize={10}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Total Harga :
              </Text>
              <HStack>
                <Text
                  fontSize={10}
                  fontFamily="Poppins-Regular"
                  mb={2}
                  color="#000"
                  width="60%"
                  textAlign="left">
                  Rp. {route.params.id.order_price}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default OrderDetailsScreen;
