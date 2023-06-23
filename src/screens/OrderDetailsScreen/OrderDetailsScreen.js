import {
  HStack,
  Divider,
  Text,
  Box,
  Spinner,
  Pressable,
  Button,
} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {CustomListProduk} from '../../components/OrderDetails';

import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';

// // Firebase
import database from '../../config/FIREBASE/index.js';
import {ref, set, remove, onValue} from 'firebase/database';

// // untuk mendapatkan titik koordinat
import Geolocation from 'react-native-geolocation-service';

// Background Service
import BackgroundService from 'react-native-background-actions';
import {TouchableOpacity} from 'react-native';

const OrderDetailsScreen = ({route}) => {
  const navigation = useNavigation();

  const [listProduk, setListProduk] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {userInfo} = useContext(AuthContext);

  useEffect(() => {
    console.log(userInfo.user.user_category);
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

  // BACKGROUND SERVICE
  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  // You can do anything in your task such as network requests, timers and so on,
  // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
  // React Native will go into "paused" mode (unless there are other tasks running,
  // or there is a foreground app).
  const veryIntensiveTask = async taskDataArguments => {
    // Example of an infinite loop task
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        await BackgroundService.updateNotification({
          taskDesc: 'pengiriman' + route.params.id.no_order,
          progressBar: 2,
        });
        console.log(i);

        // Get Location
        Geolocation.getCurrentPosition(
          info => {
            set(ref(database, 'damiu-order/' + route.params.id.no_order), {
              order_id: route.params.id.id,
              no_order: route.params.id.no_order,
              employee_name: userInfo.user.username,
              destination_X: route.params.id.destination_X,
              destination_Y: route.params.id.destination_Y,
              coordinate_X: info.coords.latitude,
              coordinate_Y: info.coords.longitude,
            });
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Sedang Melakukan Pengiriman',
    taskTitle: 'Sedang Melakukan Pengiriman',
    taskDesc: 'Sedang Melakukan Pengiriman',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 5000,
    },
  };

  const backgroundServiceOn = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
  };
  const backgroundServiceOff = async () => {
    await BackgroundService.stop();
  };

  // Make to Rupiah
  let number_string = route.params.id.order_price.toString(),
    sisa = number_string.length % 3,
    rupiah = number_string.substr(0, sisa),
    ribuan = number_string.substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }
  let toRupiah = rupiah;

  return (
    <Box bgColor="#fff" flex={1}>
      <HStack mt={5} mb={4} alignItems="center" px={4}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={25} color="#9098B1" />
        </TouchableOpacity>

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
              <TouchableOpacity onPress={onPressLihatUpdatePengiriman}>
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
              </TouchableOpacity>
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
                  Rp. {toRupiah}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </>
      )}
      {userInfo.user.user_category == 4 ? (
        ''
      ) : route.params.id.order_status == 'Dikirim' ? (
        <>
          <Button mx={3} my={3} onPress={backgroundServiceOn}>
            Mulai Tracking
          </Button>
          <Button mx={3} onPress={backgroundServiceOff}>
            Stop Tracking
          </Button>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};

export default OrderDetailsScreen;
