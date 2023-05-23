import {
  Text,
  Box,
  HStack,
  Divider,
  ScrollView,
  Spinner,
  FlatList,
  Button,
} from 'native-base';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomListPembelian from '../../components/Riwayat/CustomListPembelian/CustomListPembelian';
import {useNavigation} from '@react-navigation/native';
import OrderDetailsScreen from '../OrderDetailsScreen';
import {PermissionsAndroid, TouchableOpacity} from 'react-native';

// Firebase
import database from '../../config/FIREBASE/index.js';
import {ref, set, remove, onValue} from 'firebase/database';

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';
import {CustomListOrder} from '../../components/Riwayat';

// untuk mendapatkan titik koordinat
import Geolocation from 'react-native-geolocation-service';

const OrderScreen = () => {
  const navigation = useNavigation();

  const [listRiwayatPembelian, setListRiwayatPembelian] = useState([]);
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);
  const [activeCategories, setActiveCategories] = useState(0);
  const [filterCategories, setfilterCategories] = useState([]);
  const [categorie, setCategorie] = useState('Semua');
  const categories = [
    'Semua',
    'Belum Diproses',
    'Diproses',
    'Menunggu Dikirim',
    'Dikirim',
    'Selesai',
  ];
  const [coordinate, setCoordinate] = useState([]);

  useEffect(() => {
    setIsLoadingRiwayat(true);
    console.log(userInfo.information.depo_id);
    getOrderDepo();
    setIsLoadingRiwayat(false);

    setfilterCategories(listRiwayatPembelian);

    return () => {};
  }, []);

  const getOrderDepo = () => {
    setIsLoadingRiwayat(true);
    axios
      .get(`${BASE_URL}/history_order_depo/ ${userInfo.information.depo_id}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      })
      .then(res => res.data)
      .then(data => setListRiwayatPembelian(data.history_order_depo.reverse()))

      .catch(e => {
        console.log(`register error ${e}`);
      });
    setIsLoadingRiwayat(false);
  };

  const onPressCategories = (index, item) => {
    setActiveCategories(index);
    setCategorie(item);
    let filteredCategories = [];

    for (let i = 0; i < listRiwayatPembelian.length; i++) {
      if (listRiwayatPembelian[i].order_status == item) {
        filteredCategories.push(listRiwayatPembelian[i]);
      }
      setfilterCategories(filteredCategories);
    }
  };

  const onPressDetails = list => {
    navigation.navigate('OrderDetails', {id: list});
    // console.log(list);
  };
  const onPressBelumDiproses = list => {
    axios
      .put(
        `${BASE_URL}/customer_order/${list.id}`,
        {
          order_status: 'Diproses',
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
    getOrderDepo();
  };

  const onPressDiproses = list => {
    axios
      .put(
        `${BASE_URL}/customer_order/${list.id}`,
        {
          order_status: 'Menunggu Dikirim',
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
    getOrderDepo();
  };

  const onPressMenungguDikirim = list => {
    set(ref(database, 'damiu-order/' + list.no_order), {
      order_id: list.id,
      no_order: list.no_order,
      employee_name: userInfo.user.username,
      destination_X: list.destination_X,
      destination_Y: list.destination_Y,
      coordinate_X: coordinate.coords.latitude,
      coordinate_Y: coordinate.coords.longitude,
    });

    // axios
    //   .put(
    //     `${BASE_URL}/customer_order/${list.id}`,
    //     {
    //       order_status: 'Dikirim',
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${userInfo.token}`,
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //     },
    //   )
    //   .then(res => console.log(res))
    //   .catch(e => {
    //     console.log(`register error ${e}`);
    //   });
    getOrderDepo();
  };

  const onPressDikirim = list => {
    axios
      .put(
        `${BASE_URL}/customer_order/${list.id}`,
        {
          order_status: 'Selesai',
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
    getOrderDepo();
  };

  hasLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Cool Weather App',
        message: 'Cool Weather App needs access to use your location',
        buttonNegative: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the app');
      return true;
    } else {
      console.log('Location Permission Denied');
      return false;
    }
  };

  const getCoordinate = () => {
    hasLocationPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          setCoordinate(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  const {userInfo, isLoading, logout} = useContext(AuthContext);

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
          Order
        </Text>
      </HStack>
      <Divider thickness={0.5} />

      <Box>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <HStack>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onPressCategories(index, item)}>
                <Box
                  my={3}
                  ml={index == 0 ? 4 : 0}
                  mr={2}
                  bgColor={activeCategories == index ? '#3DADE2' : '#9098B1'}
                  rounded="xl"
                  px={4}
                  py={2}>
                  <Text color="#fff">{item}</Text>
                </Box>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>
      </Box>

      {isLoadingRiwayat ? (
        <Spinner color="#3DADE2" flex={1} size="lg" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} bgColor="#fff" mb={69}>
          {(categorie == 'Semua' ? listRiwayatPembelian : filterCategories).map(
            (list, index) => (
              <CustomListOrder
                key={index}
                source={list}
                order={list.no_order}
                tanggal={list.order_datetime}
                jumlah={list.order_total_product}
                alamat={list.order_location}
                harga={list.order_price}
                status={list.order_status}
                coordinate={coordinate}
                getCoordinate={() => getCoordinate()}
                onPressDetails={() => onPressDetails(list)}
                onPressBelumDiproses={() => onPressBelumDiproses(list)}
                onPressDiproses={() => onPressDiproses(list)}
                onPressMenungguDikirim={() => onPressMenungguDikirim(list)}
                onPressDikirim={() => onPressDikirim(list)}
              />
            ),
          )}
        </ScrollView>
      )}
    </Box>
  );
};

export default OrderScreen;
