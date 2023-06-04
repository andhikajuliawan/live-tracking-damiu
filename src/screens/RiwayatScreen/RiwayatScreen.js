import {Text, Box, HStack, Divider, ScrollView, Spinner} from 'native-base';
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
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);

  useEffect(() => {
    setIsLoadingRiwayat(true);
    console.log(userInfo.information.id);
    axios
      .get(`${BASE_URL}/history_order/ ${userInfo.information.id}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      })
      .then(res => res.data)
      .then(data => setListRiwayatPembelian(data.history_order.reverse()))

      .catch(e => {
        console.log(`register error ${e}`);
      });
    console.log(listRiwayatPembelian);
    setIsLoadingRiwayat(false);

    return () => {};
  }, []);

  const onPressDeatils = list => {
    navigation.navigate('OrderDetails', {id: list});
    // console.log(list);
  };

  const {userInfo, isLoading, logout} = useContext(AuthContext);

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
      {isLoadingRiwayat ? (
        <Spinner color="#3DADE2" flex={1} size="lg" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} bgColor="#fff" mb={69}>
          {listRiwayatPembelian.map((list, index) => (
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
      )}
    </Box>
  );
};

export default RiwayatScreen;
