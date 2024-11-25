import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput,} from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, api_url, doctor_booking_settings, doctor_booking_settings_update } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentDetails = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [online_booking_fee, setOnlineBookingFee] = useState(0);
  const [online_booking_time, setOnlieBookingTime] = useState(0);
  const [online_booking_status, setOnlineBookingStatus] = useState(0);

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await show_booking_settings();
    });
    return unsubscribe;
  },[]); 

  const show_booking_settings = async() =>{
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + doctor_booking_settings,
      data:{ doctor_id:global.id }
    })
    .then(async (response) => {
      setLoading(false);
      setOnlineBookingFee(response.data.result.online_booking_fee.toString())
      setOnlieBookingTime(response.data.result.online_booking_time)
      setOnlineBookingStatus(response.data.result.online_booking_status)
    })
    .catch(async(error) => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const update_booking_settings = async() =>{
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + doctor_booking_settings_update,
      data:{ doctor_id:global.id, online_booking_fee:online_booking_fee, online_booking_time:online_booking_time,
            online_booking_status:online_booking_status }
    })
    .then(async (response) => {
      await setLoading(false);
      if(response.data.status == 1){
        alert('updated Successfully');
        setOnlineBookingFee(response.data.result.online_booking_fee.toString())
        setOnlieBookingTime(response.data.result.online_booking_time)
        setOnlineBookingStatus(response.data.result.online_booking_status)
      }else{
        alert(response.data.message)
      }
    })
    .catch(async(error) => {
      await setLoading(false);
      alert('Sorry something went wrong')
    }); 
  }

return( 
  <SafeAreaView style={styles.container}>
  <Loader visible={loading}/>
    <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false} > 
      <View style={{ alignItems:'flex-start', justifyContent:'center',}}>
        <Text style={{ fontSize:18, color:colors.theme_fg_two, fontFamily:bold }}>Online booking status</Text> 
        <View style={{ margin:20 }}/>
        <View
          style={styles.textFieldcontainer}>
          <Icon type={Icons.FontAwesome5} name="business-time" style={{ fontSize:18, color:colors.theme_fg }} />  
          <View style={{ margin:5 }} />
          <TextInput
            style={styles.textField}
            placeholder="Enter Booking Duration"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setOnlieBookingTime(text)}
            value={online_booking_time}
          />
        </View>
      </View>
      <View style={{ margin:10 }}/>
      <View style={{ alignItems:'center', justifyContent:'center',}}>
        <View
          style={styles.textFieldcontainer}>
          <Icon type={Icons.FontAwesome5} name="money-bill" style={{ fontSize:18, color:colors.theme_fg }} />  
          <View style={{ margin:5 }} />
          <TextInput
            style={styles.textField}
            placeholder="Enter Booking Fee"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setOnlineBookingFee(text)}
            value={online_booking_fee}
          />
        </View>
      </View>
      <View style={{ alignItems:'center', justifyContent:'center',}}>
      </View>
      <View style={{ margin:20 }}/>
      <View style={{ alignItems:'center', height:50, justifyContent:'center'}}>
        <TouchableOpacity onPress={update_booking_settings} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_fg_three,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.light_blue,
    color:colors.theme_fg_two,
    fontSize:14
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
  },
});

export default AppointmentDetails;
