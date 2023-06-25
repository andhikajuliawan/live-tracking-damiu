import {
  Image,
  Text,
  Box,
  ScrollView,
  HStack,
  VStack,
  Flex,
  Skeleton,
  Divider,
} from 'native-base';
import React, {useState, useEffect, useContext} from 'react';
import {
  CustomDepoTerdekat,
  CustomHeader,
  CustomListProduk,
} from '../../components/Store';

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';

import {useNavigation} from '@react-navigation/native';

const ProdukScreen = ({route}) => {
  const [search, setSearch] = useState('');
  const [produkDepo, setProdukDepo] = useState([]);
  const [isLoadingProduk, setIsLoadingProduk] = useState(false);

  useEffect(() => {
    setIsLoadingProduk(true);
    axios
      .get(`${BASE_URL}/product/${route.params.depo_id}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      })
      .then(res => res.data)
      .then(data => setProdukDepo(data.data))

      .catch(e => {
        console.log(`register error ${e}`);
      })
      .finally(() => {
        setIsLoadingProduk(false);
      });

    return () => {};
  }, []);

  const navigation = useNavigation();

  const onPressMail = () => {
    console.warn(produkDepo);
  };
  const onPressBasket = () => {
    navigation.navigate('Keranjang', {
      depo_id: route.params.depo_id,
      nama: route.params.nama,
      alamat: route.params.alamat,
    });
  };
  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressSearch = () => {
    // render halaman
  };

  // const onPressAddProduct = () => {
  //   console.log();
  //   axios;
  // };

  // Data Dummy Store
  // const listProduk = [];
  // for (let index = 0; index < 10; index++) {
  //   listProduk.push({
  //     nama: 'Air Minum - ' + [index + 1],
  //     harga: [index + 3000],
  //     stock: [index + 2],
  //     // gambar: require('../../../assets/images/icon-shop.png'),
  //   });
  // }

  const {userInfo, isLoading, logout} = useContext(AuthContext);

  // membatasi teks di Place Holder
  const placeholder = `cari di ${route.params.nama} `;

  // Untuk Skeleton
  let listProduk = [];
  for (let i = 0; i < 5; i++) {
    listProduk.push(
      <VStack
        backgroundColor="#fff"
        shadow={3}
        width="45%"
        my={2}
        borderRadius={10}
        pb={2}
        key={i}>
        <Skeleton h={128} borderTopRadius={10} />
        <VStack px={3} mt={2}>
          <Skeleton h={3} mb={3} rounded="full" />
          <Skeleton h={4} mb={3} rounded="full" />

          <Skeleton h={3} width="70%" rounded="full" />
        </VStack>
        <Divider my={2} />
        <HStack py={1} mx={2} alignItems="center" justifyContent="center">
          <Skeleton rounded="lg" h={9} startColor="#3DADE2" />
        </HStack>
      </VStack>,
    );
  }

  return (
    <Box px={3} flex={1} bgColor="#fff">
      <CustomHeader
        onPressMail={onPressMail}
        onPressBasket={onPressBasket}
        keranjang={true}
        onPressBack={onPressBack}
        value={search}
        setValue={setSearch}
        onPressSearch={onPressSearch}
        placeholder={placeholder.substring(0, 30) + '.....'}
      />
      <HStack
        alignItems="center"
        bgColor="white"
        shadow={3}
        marginX={0.5}
        py={2}
        borderRadius="xl"
        mb={1}>
        <Image
          source={require('../../../assets/images/icon-shop.png')}
          size="sm"
          alt="icon-shop"
          mx={3}
        />
        <VStack>
          <Text fontSize={14} fontFamily="Poppins-Regular">
            {route.params.nama}
          </Text>
          <Text fontSize={10} fontFamily="Poppins-Regular">
            {route.params.alamat}
          </Text>
        </VStack>
      </HStack>
      <ScrollView bgColor="#fff" showsVerticalScrollIndicator={false}>
        <Text
          fontFamily="Poppins-Bold"
          mb={2}
          mt={5}
          fontSize={14}
          fontWeight="bold"
          ml={2}>
          Semua Produk
        </Text>
        <Flex direction="row" flexWrap="wrap" justifyContent="space-around">
          {isLoadingProduk
            ? listProduk
            : produkDepo.map((produk, index) => {
                console.log(index);
                return (
                  <CustomListProduk
                    key={index}
                    source={produk}
                    // digunakan mengambil gambar
                    // gambar={produk.gambar}
                    customer_id={userInfo.information.id}
                    produk_id={produk.id}
                    depo_id={route.params.depo_id}
                    nama={produk.product_name}
                    harga={produk.product_price}
                    stock={produk.product_stock}
                    // onPressAddProduct={onPressAddProduct}
                  />
                );
              })}
        </Flex>
      </ScrollView>
    </Box>
  );
};

export default ProdukScreen;
