import {
  HStack,
  Text,
  Divider,
  Box,
  VStack,
  Image,
  Button,
  AlertDialog,
  ScrollView,
  Spinner,
  Center,
  Pressable,
  Input,
  View,
  Fab,
} from 'native-base';
import React, {useEffect, useState, useContext} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomListProduk} from '../../components/Keranjang';
import {useNavigation} from '@react-navigation/native';

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';
import {FlatList, PermissionsAndroid, TouchableOpacity} from 'react-native';

// untuk mendapatkan titik koordinat
import Geolocation from 'react-native-geolocation-service';

// Untuk Google Maps API
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';

const KeranjangScreen = ({route}) => {
  const navigation = useNavigation();

  const [listKeranjang, setListKeranjang] = useState([]);
  const [hargaOngkosKirim, setHargaOngkosKirim] = useState([]);
  // const [hargaSubTotal, setHargaSubTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alamat, setAlamat] = useState('');
  const [notes, setNotes] = useState('');
  const [coordinate, setCoordinate] = useState([]);
  const [coordinateX, setCoordinateX] = useState(0);
  const [coordinateY, setCoordinateY] = useState(0);
  const [inputCoordinate, setInputCoordinate] = useState('');
  const [miniMap, setMiniMap] = useState(false);

  // Alert Dialog
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  // Untuk Ambil Data akun
  const {userInfo} = useContext(AuthContext);

  useEffect(() => {
    getListCartProduk();

    const ongkosKirim = 2000;

    setHargaOngkosKirim(ongkosKirim);

    return () => {};
  }, []);

  const getListCartProduk = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/cart/${route.params.depo_id}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      })
      .then(res => res.data)
      .then(data => setListKeranjang(data.cart))
      .catch(e => {
        console.log(`register error ${e}`);
      });
    setIsLoading(false);
    // console.log(listKeranjang);
  };

  let subTotal = 0;
  for (let index = 0; index < listKeranjang.length; index++) {
    subTotal += parseInt(listKeranjang[index].product_price);
  }

  const onPressBeli = () => {
    if (subTotal == 0) {
    } else {
      setIsOpen(!isOpen);
      onPressBeliProduk();
    }
  };

  const onPressBeliProduk = () => {
    // console.log(
    //   userInfo.information.id,
    //   route.params.depo_id,
    //   listKeranjang.length,
    //   hargaOngkosKirim + subTotal,
    //   alamat,
    //   coordinate.coords.latitude,
    //   coordinate.coords.longitude,
    //   notes,
    // );

    axios
      .post(
        `${BASE_URL}/customer_order`,
        {
          customer_id: userInfo.information.id,
          depo_id: route.params.depo_id,
          order_total_product: listKeranjang.length,
          order_price: hargaOngkosKirim + subTotal,
          order_location: alamat,
          destination_X: coordinateX,
          destination_Y: coordinateY,
          notes: notes,
          order_status: 'Belum Diproses',
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

  const onPressDeleteProduk = item => {
    axios
      .delete(`${BASE_URL}/cart/${item.id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(res => console.log(res))
      .catch(e => {
        console.log(`register error ${e}`);
      });

    getListCartProduk();
  };

  const onPressAddProduk = item => {
    const hargaTambah =
      parseInt(item.product_price) +
      parseInt(item.product_price) / parseInt(item.product_amount);
    const tambah = parseInt(item.product_amount) + 1;

    console.log(tambah);
    console.log(hargaTambah);
    console.log(item.product_id);

    axios
      .put(
        `${BASE_URL}/cart/${item.id}`,
        {
          product_amount: tambah,
          product_price: hargaTambah,
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

    getListCartProduk();

    // console.warn('tambah');
  };

  const onPressReduceProduk = item => {
    if (item.product_amount == 1) {
    } else {
      const hargaKurang =
        parseInt(item.product_price) -
        parseInt(item.product_price) / parseInt(item.product_amount);
      const kurang = parseInt(item.product_amount) - 1;
      // const hasil = parseInt(item.product_price) / kurang;

      console.log(kurang);
      console.log(hargaKurang);

      axios
        .put(
          `${BASE_URL}/cart/${item.id}`,
          {
            product_amount: kurang,
            product_price: hargaKurang,
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

      getListCartProduk();
    }
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

  // const getCoordinate = () => {
  //   hasLocationPermission();
  //   if (hasLocationPermission) {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         setCoordinate(position);
  //       },
  //       error => {
  //         // See error code charts below.
  //         console.log(error.code, error.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //     );
  //   }
  // };

  // Function untuk MiniMap

  getLocation = () => {
    hasLocationPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        posisi => {
          setCoordinateX(posisi.coords.latitude),
            setCoordinateY(posisi.coords.longitude);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };
  getCoordinateFromInput = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?&address=' +
        inputCoordinate +
        '&key=AIzaSyC_TYQGvtlUhwyhc2umVM-GjsgFjJk0j-Y',
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'ADDRESS GEOCODE is BACK!! => ' +
            JSON.stringify(responseJson.results[0].geometry.location),
        );

        setCoordinateX(responseJson.results[0].geometry.location.lat);

        setCoordinateY(responseJson.results[0].geometry.location.lng);
      });
  };
  getAddress = e => {
    console.log(e.nativeEvent.coordinate);
    setCoordinateX(e.nativeEvent.coordinate.latitude);
    setCoordinateY(e.nativeEvent.coordinate.longitude);
  };

  return (
    <Box flex={1} bgColor="#fff">
      <HStack mt={5} mb={4} alignItems="center" px={4}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={25} color="#9098B1" />
        </TouchableOpacity>

        <Text fontFamily="Poppins-Bold" fontSize={16} color="#223263" ml={3}>
          Keranjang
        </Text>
      </HStack>
      <Divider thickness={0.5} />

      {isLoading ? (
        <Center flex={1}>
          <Spinner color="#3DADE2" size="lg" />
        </Center>
      ) : (
        <ScrollView>
          {/* <FlatList
            data={listKeranjang}
            renderItem={({item, index}) => (
              <HStack
                bgColor="#fff"
                mx={4}
                borderRadius={10}
                shadow={3}
                py={2}
                mt={3}
                mb={1}>
                <Image
                  source={require('../../../assets/images/aqua.png')}
                  size="md"
                  alt="produk"
                />
                <VStack justifyContent="space-evenly" width="100%">
                  <HStack justifyContent="space-between" width="70%">
                    <Text fontFamily="Poppins-Bold" fontSize={14}>
                      {item.product.product_name}
                    </Text>
                    <Ionicons
                      name="trash-outline"
                      color="#9098B1"
                      size={25}
                      onPress={() => onPressDeleteProduk(item)}
                    />
                  </HStack>
                  <HStack justifyContent="space-between" width="70%">
                    <Text
                      fontFamily="Poppins-Medium"
                      fontSize={14}
                      color="#3DADE2">
                      Rp. {item.product_price}
                    </Text>
                    <HStack bgColor="#EBF0FF" borderRadius={5} p={1}>
                      <Pressable
                        bgColor="#fff"
                        borderLeftRadius={5}
                        onPress={() => onPressAddProduk(item)}>
                        <Ionicons
                          name="add-outline"
                          color="#9098B1"
                          size={23}
                        />
                      </Pressable>
                      <Text mx={4} color="#9098B1">
                        {item.product_amount}
                      </Text>
                      {item.product_amount == 1 ? (
                        <Pressable
                          bgColor="#EBF0FF"
                          borderRightRadius={5}
                          onPress={() => onPressReduceProduk(item)}>
                          <Ionicons
                            name="remove-outline"
                            color="#9098B1"
                            size={23}
                          />
                        </Pressable>
                      ) : (
                        <Pressable
                          bgColor="#fff"
                          borderRightRadius={5}
                          onPress={() => onPressReduceProduk(item)}>
                          <Ionicons
                            name="remove-outline"
                            color="#9098B1"
                            size={23}
                          />
                        </Pressable>
                      )}
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>
            )}
            keyExtractor={item => item.id}
          /> */}

          {listKeranjang.map((item, index) => {
            key = {index};
            source = {item};
            return (
              <HStack
                bgColor="#fff"
                mx={4}
                borderRadius={10}
                shadow={3}
                py={2}
                mt={3}
                mb={1}>
                <Image
                  source={require('../../../assets/images/aqua.png')}
                  size="md"
                  alt="produk"
                />
                <VStack justifyContent="space-evenly" width="100%">
                  <HStack justifyContent="space-between" width="70%">
                    <Text fontFamily="Poppins-Bold" fontSize={14}>
                      {item.product.product_name}
                    </Text>
                    <Ionicons
                      name="trash-outline"
                      color="#9098B1"
                      size={25}
                      onPress={() => onPressDeleteProduk(item)}
                    />
                  </HStack>
                  <HStack justifyContent="space-between" width="70%">
                    <Text
                      fontFamily="Poppins-Medium"
                      fontSize={14}
                      color="#3DADE2">
                      Rp. {item.product_price}
                    </Text>
                    <HStack bgColor="#EBF0FF" borderRadius={5} p={1}>
                      <Pressable
                        bgColor="#fff"
                        borderLeftRadius={5}
                        onPress={() => onPressAddProduk(item)}>
                        <Ionicons
                          name="add-outline"
                          color="#9098B1"
                          size={23}
                        />
                      </Pressable>
                      <Text mx={4} color="#9098B1">
                        {item.product_amount}
                      </Text>
                      {item.product_amount == 1 ? (
                        <Pressable
                          bgColor="#EBF0FF"
                          borderRightRadius={5}
                          onPress={() => onPressReduceProduk(item)}>
                          <Ionicons
                            name="remove-outline"
                            color="#9098B1"
                            size={23}
                          />
                        </Pressable>
                      ) : (
                        <Pressable
                          bgColor="#fff"
                          borderRightRadius={5}
                          onPress={() => onPressReduceProduk(item)}>
                          <Ionicons
                            name="remove-outline"
                            color="#9098B1"
                            size={23}
                          />
                        </Pressable>
                      )}
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>
            );
          })}

          <Box
            mx={4}
            px={5}
            py={2}
            bg="#fff"
            borderRadius={10}
            shadow={3}
            mt={3}>
            <Text
              fontSize={12}
              fontWeight="bold"
              fontFamily="Poppins-Bold"
              mb={2}>
              Dikirim dari Toko :
            </Text>
            <HStack alignItems="center">
              <Image
                source={require('../../../assets/images/icon-shop.png')}
                size="sm"
                alt="icon-shop"
              />
              <VStack marginLeft={2}>
                <Text fontSize={12} fontFamily="Poppins-Regular">
                  {route.params.nama}
                </Text>
                <Text fontSize={10} fontFamily="Poppins-Regular">
                  {route.params.alamat}
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box
            mx={4}
            px={5}
            py={3}
            bg="#fff"
            borderRadius={10}
            shadow={3}
            mt={3}>
            <Text
              fontSize={12}
              fontWeight="bold"
              fontFamily="Poppins-Bold"
              mb={2}>
              Identitas penerima :
            </Text>
            <Text fontSize={12} fontFamily="Poppins-SemiBold" mb={2}>
              {userInfo.information.customer_name}
            </Text>
            <Text fontSize={10} fontFamily="Poppins-Regular" mb={2}>
              {userInfo.information.customer_phone}
            </Text>
            <Text fontSize={12} fontWeight="bold" fontFamily="Poppins-Bold">
              Lokasi pengiriman :
            </Text>
            <Input
              placeholder="Masukkan Alamat pengiriman"
              variant="underlined"
              w="100%"
              size="sm"
              py={1}
              px={1}
              mb={2}
              onChangeText={text => setAlamat(text)}
              value={alamat}
            />
            <Input
              placeholder="catatan tambahan (opsional)"
              variant="underlined"
              w="100%"
              size="sm"
              py={1}
              px={1}
              mb={2}
              onChangeText={text => setNotes(text)}
              value={notes}
            />
            {/* <HStack width="100%">
              <VStack>
                <Text
                  fontSize={12}
                  fontFamily="Poppins-SemiBold"
                  mb={2}
                  width="80%">
                  Klik untuk mendapatkan lokasi saat ini
                </Text>
                {coordinate == '' ? (
                  <></>
                ) : (
                  <Text
                    color="#28a745"
                    fontSize={12}
                    fontFamily="Poppins-SemiBold"
                    mb={2}
                    width="80%">
                    lokasi sudah didapatkan
                  </Text>
                )}
              </VStack>
              <Box width="30%">
                <Center>
                  <Button
                    rounded="lg"
                    width={12}
                    height={10}
                    onPress={getCoordinate}>
                    <Ionicons name="locate-outline" color="#fff" size={20} />
                  </Button>
                </Center>
              </Box>
            </HStack> */}
            {coordinateX == 0 && coordinateY == 0 ? (
              <Text
                color="#9098B1"
                fontSize={12}
                fontFamily="Poppins-SemiBold"
                mb={2}
                width="80%">
                lokasi belum didapatkan
              </Text>
            ) : (
              <Text
                color="#28a745"
                fontSize={12}
                fontFamily="Poppins-SemiBold"
                mb={2}
                width="80%">
                lokasi sudah didapatkan
              </Text>
            )}

            <Box>
              <TouchableOpacity
                onPress={() => {
                  miniMap ? setMiniMap(false) : setMiniMap(true);
                }}>
                <HStack justifyContent="space-between" my={2}>
                  <Text
                    fontSize={12}
                    fontFamily="Poppins-SemiBold"
                    mb={2}
                    color="#3DADE2">
                    Klik untuk mendapatkan lokasi saat ini
                  </Text>
                  {miniMap ? (
                    <Ionicons name="arrow-up" color="#3DADE2" size={23} />
                  ) : (
                    <Ionicons name="arrow-down" color="#3DADE2" size={23} />
                  )}
                </HStack>
              </TouchableOpacity>
              {miniMap ? (
                <Box flex={1} height={600}>
                  <Input
                    value={inputCoordinate}
                    onChangeText={newText => setInputCoordinate(newText)}
                    variant="filled"
                    placeholder="silahkan masukkan alamat anda"
                    fontSize={14}
                    mb={1}
                    width="100%"
                    color="#525252"
                    bgColor="#FCFEFF"
                    InputRightElement={
                      inputCoordinate == '' ? (
                        <Ionicons name="search" color="#9098B1" size={23} />
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            getCoordinateFromInput();
                          }}>
                          <Ionicons name="search" color="#3DADE2" size={23} />
                        </TouchableOpacity>
                      )
                    }
                  />

                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{flex: 1}}
                    region={{
                      latitude: coordinateX,
                      longitude: coordinateY,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}>
                    {/* Draggable  Marker*/}

                    {coordinateX == 0 ? (
                      <></>
                    ) : (
                      <Marker
                        draggable
                        key={'input'}
                        coordinate={{
                          latitude: coordinateX,
                          longitude: coordinateY,
                        }}
                        title={'input'}
                        description={'Prengiriman'}
                        onDragEnd={e =>
                          // this.setState({x: e.nativeEvent.coordinate})
                          // console.log(e.nativeEvent.coordinate)
                          this.getAddress(e)
                        }
                      />
                    )}
                  </MapView>

                  <Fab
                    renderInPortal={false}
                    shadow={2}
                    size="sm"
                    icon={
                      <Ionicons name="locate-outline" color="#fff" size={23} />
                    }
                    onPress={() => {
                      getLocation();
                    }}
                  />
                </Box>
              ) : (
                <></>
              )}
            </Box>
          </Box>
          <Box
            mx={4}
            px={5}
            py={2}
            bg="#fff"
            borderRadius={10}
            shadow={3}
            mt={3}>
            <HStack justifyContent="space-between">
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Subtotal
              </Text>
              <Text fontSize={12} fontFamily="Poppins-Regular" mb={2}>
                Rp. {subTotal}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Diskon
              </Text>
              <Text fontSize={12} fontFamily="Poppins-Regular" mb={2}>
                Rp. 0
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                Total Ongkos Kirim
              </Text>
              <Text fontSize={12} fontFamily="Poppins-Regular" mb={2}>
                Rp. {hargaOngkosKirim}
              </Text>
            </HStack>
            <Divider my={3} />
            <HStack justifyContent="space-between">
              <Text
                fontSize={12}
                fontFamily="Poppins-Bold"
                mb={2}
                color="#223263">
                Total Belanja
              </Text>
              <Text
                fontSize={12}
                fontFamily="Poppins-Bold"
                mb={2}
                color="#40BFFF">
                Rp. {hargaOngkosKirim + subTotal}
              </Text>
            </HStack>
          </Box>
          {subTotal == 0 ? (
            <Button
              isDisabled
              mx={4}
              bgColor="#3DADE2"
              mt={4}
              mb={4}
              borderRadius={10}>
              <Text fontSize={14} color="#fff" fontFamily="Poppins-Bold" my={1}>
                Beli
              </Text>
            </Button>
          ) : alamat == '' ? (
            <Button
              isDisabled
              mx={4}
              bgColor="#3DADE2"
              mt={4}
              mb={4}
              borderRadius={10}
              onPress={onPressBeli}>
              <Text fontSize={14} color="#fff" fontFamily="Poppins-Bold" my={1}>
                Beli
              </Text>
            </Button>
          ) : coordinateX == 0 && coordinateY == 0 ? (
            <Button
              isDisabled
              mx={4}
              bgColor="#3DADE2"
              mt={4}
              mb={4}
              borderRadius={10}
              onPress={onPressBeli}>
              <Text fontSize={14} color="#fff" fontFamily="Poppins-Bold" my={1}>
                Beli
              </Text>
            </Button>
          ) : (
            <Button
              mx={4}
              bgColor="#3DADE2"
              mt={4}
              mb={4}
              borderRadius={10}
              onPress={onPressBeli}>
              <Text fontSize={14} color="#fff" fontFamily="Poppins-Bold" my={1}>
                Beli
              </Text>
            </Button>
          )}

          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}>
            <AlertDialog.Content>
              <AlertDialog.Body>
                <VStack>
                  <HStack justifyContent="center">
                    <Text></Text>
                    <Image
                      source={require('../../../assets/images/successIcon.png')}
                      alt="successIcon"
                      width={10}
                      height={10}
                      resizeMode="stretch"
                    />
                    <Text></Text>
                  </HStack>

                  <Text textAlign="center" my={3}>
                    Pemesanan Sukses
                  </Text>
                  <Button
                    borderRadius={50}
                    size="sm"
                    bgColor="#3DADE2"
                    onPress={
                      (onClose,
                      () => {
                        navigation.navigate('Home');
                      })
                    }>
                    oke
                  </Button>
                </VStack>
              </AlertDialog.Body>
            </AlertDialog.Content>
          </AlertDialog>
        </ScrollView>
      )}
    </Box>
  );
};

export default KeranjangScreen;
