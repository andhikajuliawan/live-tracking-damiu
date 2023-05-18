import {
  Text,
  Box,
  HStack,
  Divider,
  ScrollView,
  Spinner,
  FlatList,
} from 'native-base';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomListPembelian from '../../components/Riwayat/CustomListPembelian/CustomListPembelian';
import {useNavigation} from '@react-navigation/native';
import OrderDetailsScreen from '../OrderDetailsScreen';
import {TouchableOpacity} from 'react-native';

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';
import {CustomListOrder} from '../../components/Riwayat';

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

  useEffect(() => {
    setIsLoadingRiwayat(true);
    console.log(userInfo.information.depo_id);
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

    setfilterCategories(listRiwayatPembelian);

    return () => {};
  }, []);

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
  const onPressBelumDiproses = () => {
    alert('Belum Diproses');
  };
  const onPressDiproses = () => {
    alert('Diproses');
  };
  const onPressMenungguDikirim = () => {
    alert('Menunggu Dikirim');
  };
  const onPressDikirim = () => {
    alert('Dikirim');
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
                onPressDetails={() => onPressDetails(list)}
                onPressBelumDiproses={() => onPressBelumDiproses()}
                onPressDiproses={() => onPressDiproses()}
                onPressMenungguDikirim={() => onPressMenungguDikirim()}
                onPressDikirim={() => onPressDikirim()}
              />
            ),
          )}
        </ScrollView>
      )}
    </Box>
  );
};

export default OrderScreen;
