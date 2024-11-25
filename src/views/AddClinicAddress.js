import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, Platform, PermissionsAndroid, } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location, doctor_clinic_address, api_url } from '../config/Constants';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader'; 

const AddClinicAddress = () => {

  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [mapRegion, setmapRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clinic_address, setClinicAddress] = useState('');
  const [clinic_lat, setClinicLat] = useState('');
  const [clinic_lng, setClinicLng] = useState(''); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  
  const ref_variable = async() =>{
    await setTimeout(() => {
      mapRef.current.focus();
    }, 200);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await requestCameraPermission();
    });
    return unsubscribe;
  },[]);

  const add_clinic_address = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_clinic_address,
      data:{ doctor_id:global.id, clinic_address:clinic_address, clinic_lat:clinic_lat, clinic_lng:clinic_lng }
    })
    .then(async response => {
      await setLoading(false);
      if(response.data.status == 1){
        handleBackButtonClick();
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const requestCameraPermission = async() =>{
    if(Platform.OS === "android"){
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': global.app_name+' needs to Access your location for tracking'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await findType();
        } else {
            await handleBackButtonClick();
        }
    } catch (err) {
        await handleBackButtonClick();
    }
    }else{
      await getInitialLocation();
    }
  }

  const findType = async() =>{
    getInitialLocation();
  }

  const getInitialLocation = async() =>{
    await Geolocation.getCurrentPosition( async(position) => {
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      setmapRegion( region )
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  const onRegionChange = async(value) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              let address = await responseJson.results[0].formatted_address;
              setClinicAddress(address);
              setClinicLat(value.latitude);
              setClinicLng(value.longitude);
           }else{
            alert('Sorry something went wrong')
           }
    }) 
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignItems:'center', justifyContent:'center', height:'100%'}} >
        <MapView
          provider={PROVIDER_GOOGLE} 
          ref={mapRef}
          style={{width: '100%',height: '100%'}}
          initialRegion={ mapRegion }
          onRegionChangeComplete={region => onRegionChange(region)}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
        </MapView>
        <View style={{position: 'absolute',}}>
          <View style={{height:30, width:25, top:-15 }} >
            <Image
              style= {{flex:1 , width: undefined, height: undefined}}
              source={location}
            />
          </View>
        </View>
        <View style={{position: 'absolute', backgroundColor:colors.theme_fg_three, borderRadius:10, width:'96%', height:50, top:10, flexDirection:'row', padding:10  }}>
          <View style={{ width:'85%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12 }}>{clinic_address}</Text>
          </View>
        </View>
        <View style={{ left:0, right:0, bottom:0, alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
          <TouchableOpacity onPress={add_clinic_address} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Loader visible={loading} />
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
   button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%'
  },
});

export default AddClinicAddress;
