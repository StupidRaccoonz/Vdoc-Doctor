import React, { useState, useEffect } from 'react';
import { StyleSheet,  View, SafeAreaView, Text,  ScrollView, TouchableOpacity, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, doctor_get_bookings, api_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CardView from 'react-native-cardview';
import Moment from 'moment';

const MyBookings = () => {
  const navigation = useNavigation();
  const [booking_list, setBookingList] = useState([]);

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_bookings();
    });
    return unsubscribe;
  },[]); 

  const get_bookings = async() =>{
    await axios({
      method: 'post', 
      url: api_url + doctor_get_bookings,
      data:{ doctor_id:global.id }
    })
    .then(async response => {
      console.log(response.data.result.waiting_for_confirmation)
      setBookingList(response.data.result)
    })
    .catch(error => {
      console.log(error)
      alert('Sorry something went wrong');
    });
  }

  const booking_details = (data) =>{
    if(data.slug == 'waiting_for_confirmation'){
      navigation.navigate('BookingRequest', { data:data })
    }else{
      navigation.navigate('MyBookingDetails', { data:data })
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={booking_details.bind(this, item)} activeOpacity={1} style={{ padding:5 }}>
        <CardView
          cardElevation={2}
          cardMaxElevation={2}
          style={{ padding:20, justifyContent:'center', width:'100%' }}
          cornerRadius={5}>
          <View>
            <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold}}>{item.customer_name}</Text>
            <View style={{ margin:4 }} />
            <View style={{ flexDirection:'row'}}>
              <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}} >
                <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}}>{Moment(item.start_time).format('MMM')}</Text>
                <Text style={{ fontSize:20, color:colors.theme_fg, fontFamily:bold}}>{Moment(item.start_time).format('DD')}</Text>
                <Text style={{ fontSize:11, color:colors.grey, fontFamily:regular}}>{Moment(item.start_time).format('hh:mm A')}</Text>
              </View>
              <View style={{ width:'2%', borderRightWidth:4, borderColor:colors.theme_bg }} />
              <View style={{ width:'78%',  paddingLeft:10, justifyContent:'center'}} >
                <Text numberOfLines={1} style={{ fontSize:12, color:colors.theme_fg, fontFamily:bold}}>Booking Id #{item.id}</Text>
                <View style={{ margin:4 }} />
                <Text numberOfLines={1} style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{item.title}</Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}} >{item.status_name}</Text>
              </View>
            </View>
          </View>
        </CardView>
      </TouchableOpacity>
  );

  return (
  <SafeAreaView style={styles.container}>
    <ScrollView  style={{ padding:10 }} showsVerticalScrollIndicator={false}>
      <View style={{ margin:5 }}/>
      <View style={styles.header}>
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>My Bookings</Text>
      </View>
      <View style={{ margin:5 }} />
      {booking_list.length == 0 ?
          <View style={{marginTop:'30%'}}>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14}}>No Bookings received yet.</Text>
          </View>
          :
          <FlatList
            data={booking_list}
            inverted={true}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
        <View style={{ margin:50 }} />     
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default MyBookings;