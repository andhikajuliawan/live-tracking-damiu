import {
  View,
  Text,
  Box,
  ScrollView,
  HStack,
  Skeleton,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import {CustomDepoTerdekat, CustomHeader} from '../../components/Store';

import {useNavigation} from '@react-navigation/native';

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';

const StoreScreen = () => {
  const [search, setSearch] = useState('');
  const [listDepo, setListDepo] = useState([]);
  const [isLoadingDepo, setIsLoadingDepo] = useState(false);

  const navigation = useNavigation();

  const onPressMail = () => {
    console.warn('mail');
  };
  const onPressBasket = () => {
    navigation.navigate('Keranjang');
  };
  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressSearch = () => {
    // render halaman
    navigation.navigate('Riwayat');
  };

  // Untuk Skeleton
  let depoTerdekat = [];
  for (let i = 0; i < 10; i++) {
    depoTerdekat.push(
      <Box
        marginX={0.5}
        bgColor="white"
        marginBottom={2}
        shadow={1}
        rounded={9}
        key={i}>
        <HStack alignItems="center" justifyContent="space-around" mx={3} my={2}>
          <HStack alignItems="center">
            <Skeleton size="65" rounded="sm" />

            <VStack marginLeft={2} width="70%">
              <Skeleton.Text />
            </VStack>
          </HStack>
          <Skeleton size={30} rounded="sm" />
        </HStack>
      </Box>,
    );
  }

  useEffect(() => {
    setIsLoadingDepo(true);
    axios
      .get(`${BASE_URL}/depo`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      })
      .then(res => res.data)
      .then(data => setListDepo(data.data))

      .catch(e => {
        console.log(`register error ${e}`);
      });
    setIsLoadingDepo(false);

    // fetch(`https://damiusite.com/example-damiu/api/depo`, {
    //   headers: {Authorization: `Bearer ${userInfo.token}`},
    // })
    //   .then(response => response.json())
    //   .then(json => setTesting(json))
    //   .catch(error => console.error(error));
    // console.log(testing);

    return () => {};
  }, []);

  // Data Dummy Store
  // const listDepodummy = [];
  // for (let index = 0; index < 10; index++) {
  //   listDepo.push({
  //     nama: 'Depo Mama Ami ke - ' + [index],
  //     alamat: 'Jalan Wagir RT ' + [index] + ' RW ' + [index] + ' - Sidoarjo',
  //     jarak: [index] + ' km',
  //   });
  // }

  // Untuk Logout
  const {userInfo, isLoading, logout} = useContext(AuthContext);

  return (
    <Box px={3} flex={1} bgColor="#fff">
      <CustomHeader
        onPressMail={onPressMail}
        // onPressBasket={onPressBasket}
        onPressBack={onPressBack}
        value={search}
        setValue={setSearch}
        onPressSearch={onPressSearch}
        placeholder="Cari Depot Terdekat"
      />
      <ScrollView
        marginBottom={70}
        bgColor="#fff"
        showsVerticalScrollIndicator={false}>
        <Text fontSize={14} fontWeight="bold" my={3}>
          Depo Terdekat Untuk Anda
        </Text>
        {isLoadingDepo
          ? depoTerdekat
          : listDepo.map((depo, index) => (
              <CustomDepoTerdekat
                key={index}
                source={depo}
                nama={depo.depo_name}
                alamat={depo.depo_city}
                onPressDepo={() => {
                  navigation.navigate('Produk', {
                    nama: depo.depo_name,
                    alamat: depo.depo_city,
                    depo_id: depo.id,
                  });
                }}
              />
            ))}
      </ScrollView>
    </Box>
  );
};

export default StoreScreen;
