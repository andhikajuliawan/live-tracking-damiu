import {
  Text,
  Box,
  HStack,
  Divider,
  ScrollView,
  Spinner,
  Skeleton,
  VStack,
} from 'native-base';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomListPembelian from '../../components/Riwayat/CustomListPembelian/CustomListPembelian';
import {useNavigation} from '@react-navigation/native';
import OrderDetailsScreen from '../OrderDetailsScreen';

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';
import {TouchableOpacity} from 'react-native';

const RiwayatScreen = () => {
  const navigation = useNavigation();

  const [listRiwayatPembelian, setListRiwayatPembelian] = useState([]);
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/history_order/ ${userInfo.information.id}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      })
      .then(res => res.data)
      .then(data => setListRiwayatPembelian(data.history_order.reverse()))

      .catch(e => {
        console.log(`register error ${e}`);
      })
      .finally(() => {
        setIsLoadingRiwayat(false);
      });
    return () => {};
  }, []);

  const onPressDeatils = list => {
    navigation.navigate('OrderDetails', {id: list});
    // console.log(list);
  };

  const {userInfo, isLoading, logout} = useContext(AuthContext);

  // Untuk Skeleton
  let skeletonRiwayat = [];
  for (let i = 0; i < 5; i++) {
    skeletonRiwayat.push(
      <Box
        mx={4}
        px={5}
        py={4}
        bg="#fff"
        borderRadius={10}
        shadow={3}
        mt={2}
        mb={2}
        key={i}>
        <HStack justifyContent="space-between">
          <Skeleton h={3} mb={3} rounded="full" width="60%" />
          <Skeleton h={3} rounded="full" width="30%" />
        </HStack>
        <HStack justifyContent="space-between">
          <Skeleton h={3} mb={3} rounded="full" width="60%" />
          <Skeleton h={3} rounded="full" width="30%" />
        </HStack>
        <HStack justifyContent="space-between">
          <Skeleton h={3} mb={3} rounded="full" width="60%" />
          <Skeleton h={3} mb={3} rounded="full" width="30%" />
        </HStack>
        <Skeleton h={3} mb={3} rounded="full" width="30%" />

        <Skeleton h={4} mb={3} rounded="full" />

        <HStack justifyContent="space-between" alignItems="center">
          <Skeleton w="30%" rounded="full" />
          {/* <Skeleton w="30%" rounded="full" /> */}
        </HStack>
      </Box>,
    );
  }

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
          Riwayat
        </Text>
      </HStack>
      <Divider thickness={0.5} />
      <ScrollView showsVerticalScrollIndicator={false} bgColor="#fff" mb={69}>
        {isLoadingRiwayat
          ? skeletonRiwayat
          : listRiwayatPembelian.map((list, index) => (
              <CustomListPembelian
                key={index}
                source={list}
                order={list.no_order}
                tanggal={list.order_datetime}
                jumlah={list.order_total_product}
                harga={list.order_price}
                status={list.order_status}
                alamat={list.order_location}
                onPressDetails={() => onPressDeatils(list)}
              />
            ))}
      </ScrollView>
    </Box>
  );
};

export default RiwayatScreen;
