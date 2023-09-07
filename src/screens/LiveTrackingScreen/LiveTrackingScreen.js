import {
  Text,
  Box,
  HStack,
  Divider,
  ScrollView,
  Spinner,
  FlatList,
  Image,
  View,
  Skeleton,
} from 'native-base';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import OrderDetailsScreen from '../OrderDetailsScreen';
import {TouchableOpacity} from 'react-native';

// Firebase
import database from '../../config/FIREBASE/index.js';
import {ref, set, remove, onValue} from 'firebase/database';

// GMaps
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';
import {CustomListOrder} from '../../components/Riwayat';
import { API_KEY } from '../../apikey';

const LiveTrackingScreen = ({route}) => {
  const navigation = useNavigation();
  const [firebaseData, setFirebaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {userInfo, logout} = useContext(AuthContext);

  useEffect(() => {
    const starCountRef = ref(database, 'damiu-order/');
    onValue(starCountRef, snapshot => {
      const data = snapshot.val();
      const newData = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      // console.log(newData);
      const findData = newData.find(i => i.id == route.params.info.id.no_order);
      console.log(findData);
      setFirebaseData(findData);
      setIsLoading(false);
    });

    return () => {};
  }, []);

  console.log(route.params.info.id.order_datetime);

  return (
    // <
    <View h="full" backgroundColor="#fff">
      <HStack mt={5} mb={4} alignItems="center" px={4}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="chevron-back-outline" size={25} color="#9098B1" />
        </TouchableOpacity>

        <Text fontFamily="Poppins-Bold" fontSize={16} color="#223263" ml={3}>
          Proses Pengiriman
        </Text>
      </HStack>
      <Divider thickness={0.5} />
      {isLoading ? (
        <>
          {/* <Spinner color="cyan.500" flex={1} size="lg" /> */}
          <Box px={8} pb={3} bg="#fff" pt={3}>
            <HStack justifyContent="space-between" mb={3}>
              <Skeleton h={3} rounded="full" w="50%" />
              <Skeleton h={3} rounded="full" w="40%" />
            </HStack>
            <HStack justifyContent="space-between" mb={3}>
              <Skeleton h={3} rounded="full" w="40%" />
              <Skeleton h={3} rounded="full" w="40%" />
            </HStack>
            <HStack justifyContent="space-between" mb={3}>
              <Skeleton h={3} rounded="full" w="40%" />
              <Skeleton h={3} rounded="full" w="30%" />
            </HStack>
          </Box>
          <Skeleton flex={1} />
        </>
      ) : (
        <>
          <Box px={8} pb={3} bg="#fff" pt={3}>
            <HStack justifyContent="space-between">
              <Text
                fontSize={14}
                fontFamily="Poppins-Bold"
                mb={2}
                color="#223263">
                Order No. {firebaseData.no_order}
              </Text>
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                {route.params.info.id.order_datetime}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text
                fontSize={12}
                fontFamily="Poppins-Regular"
                mb={2}
                color="#9098B1">
                kurir :
              </Text>
              <HStack>
                <Text
                  fontSize={12}
                  fontFamily="Poppins-Regular"
                  mb={2}
                  color="#9098B1">
                  {firebaseData.employee_name}
                </Text>
              </HStack>
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
                  {route.params.info.id.order_status}
                </Text>
              </HStack>
            </HStack>
          </Box>

          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{flex: 1}}
            region={{
              latitude: Number(firebaseData.coordinate_X),
              longitude: Number(firebaseData.coordinate_Y),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              pinColor="#4A89F3"
              key={'customer'}
              coordinate={{
                latitude: Number(firebaseData.destination_X),
                longitude: Number(firebaseData.destination_Y),
              }}
              title={'Lokasi pengiriman'}
              description={'lokasi pengiriman'}>
              <Image
                source={require('../../../assets/images/rumah.png')}
                alt="lokasi pengiriman"
                w={35}
                h={35}
                resizeMode="contain"
              />
            </Marker>
            <Marker
              pinColor="#FFEB3B"
              key={'driver'}
              coordinate={{
                latitude: Number(firebaseData.coordinate_X),
                longitude: Number(firebaseData.coordinate_Y),
              }}
              title={'Driver'}
              description={'Prengiriman'}>
              <Image
                source={require('../../../assets/images/kurir.png')}
                alt="lokasi pengiriman"
                w={35}
                h={35}
                resizeMode="contain"
              />
            </Marker>
            <MapViewDirections
              origin={{
                latitude: Number(firebaseData.coordinate_X),
                longitude: Number(firebaseData.coordinate_Y),
              }}
              destination={{
                latitude: Number(firebaseData.destination_X),
                longitude: Number(firebaseData.destination_Y),
              }}
              apikey={API_KEY}
              strokeWidth={5}
              strokeColor="#4A89F3"
            />
          </MapView>
        </>
      )}
    </View>
  );
};

export default LiveTrackingScreen;
