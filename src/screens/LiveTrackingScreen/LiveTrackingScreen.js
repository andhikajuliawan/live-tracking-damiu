import {
  Text,
  Box,
  HStack,
  Divider,
  ScrollView,
  Spinner,
  FlatList,
  Button,
  View,
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

// untuk keperluan axios
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {BASE_URL} from '../../config';
import {CustomListOrder} from '../../components/Riwayat';

const LiveTrackingScreen = ({route}) => {
  const navigation = useNavigation();
  const [firebaseData, setFirebaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {userInfo, logout} = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
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
        <Ionicons
          name="chevron-back-outline"
          size={25}
          color="#9098B1"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text fontFamily="Poppins-Bold" fontSize={16} color="#223263" ml={3}>
          Proses Pengiriman
        </Text>
      </HStack>
      <Divider thickness={0.5} />
      {isLoading ? (
        <>
          <Spinner color="cyan.500" flex={1} size="lg" />
        </>
      ) : (
        <>
          <Box
            // mx={4}
            px={8}
            pb={3}
            bg="#fff"
            pt={3}>
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
              latitude: parseInt(firebaseData.destination_X),
              longitude: parseInt(firebaseData.destination_Y),
              latitudeDelta: 0.01,
              longitudeDelta: 0.04,
            }}>
            <Marker
              key={'customer'}
              coordinate={{
                latitude: parseInt(firebaseData.destination_X),
                longitude: parseInt(firebaseData.destination_Y),
              }}
              title={'Lokasi saya'}
              description={'lokasi pengiriman'}
            />
            {/* <Marker
              pinColor="#FFEB3B"
              key={'driver'}
              coordinate={{
                latitude: this.state.latitudeDriver,
                longitude: this.state.longitudeDriver,
              }}
              title={'Driver'}
              description={'Prengiriman'}
            /> */}
            {/* <MapViewDirections
              origin={{
                latitude: this.state.latitudeCustomer,
                longitude: this.state.longitudeCustomer,
              }}
              destination={{
                latitude: this.state.latitudeDriver,
                longitude: this.state.longitudeDriver,
              }}
              apikey={'AIzaSyC_TYQGvtlUhwyhc2umVM-GjsgFjJk0j-Y'}
              strokeWidth={5}
              strokeColor="#4A89F3"
            /> */}
          </MapView>
        </>
      )}
    </View>
  );
};

export default LiveTrackingScreen;
