import React, { useState } from 'react';
import { StyleSheet, Image,  View, SafeAreaView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons'
import { theme_gradient, regular, bold, api_url, waiting_icon, right, rejected_icon, doctor_change_status, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview'; 
import Moment from 'moment';
import Loader from '../components/Loader';
import axios from 'axios';

const MyBookingDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [booking_details, setBookingDetails] = useState(route.params.data);
  const [loading, setLoading] = useState(false);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  
  const change_request = async(slug) =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_change_status,
      data:{ booking_request_id: booking_details.id, slug : slug }
    })
    .then(async response => {
      setLoading(false);
      handleBackButtonClick();
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const navigate_patient_histories = () =>{
	  navigation.navigate("PatientHistories", {booking_data:booking_details})
  }

  return (
  <SafeAreaView style={styles.container}>
  <Loader visible={loading}/>
    <ImageBackground source={theme_gradient} resizeMode="cover" style={styles.image}>
      {booking_details.slug == "waiting_for_confirmation" &&
        <Image source={waiting_icon} style={{ height:100, width:100 }} />
      }
      {booking_details.slug == "booking_confirmed" &&
        <Image source={right} style={{ height:100, width:100 }} />
      }
      {booking_details.slug == "booking_rejected" &&
        <Image source={rejected_icon} style={{ height:100, width:100 }} />
      }
      {booking_details.slug == "booking_completed" &&
        <Image source={right} style={{ height:100, width:100 }} />
      }
      <View style={{ margin:10 }} />
      <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:18}}>{booking_details.status_name}</Text>
    </ImageBackground>
    <CardView
      cardElevation={4}
      cardMaxElevation={4}
      style={{ padding:20, justifyContent:'center', width:'90%', marginLeft:'5%', marginRight:'5%', position:'absolute', top:250 }}
      cornerRadius={5}>
      <View>
        <Text style={{ fontFamily:bold, color:colors.theme_fg, fontSize:15}}>Booking ID : #{booking_details.id}</Text>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'30%', alignItems:'flex-start', justifyContent:'center'}}>
            <Image source={{ uri : img_url+booking_details.profile_picture}} style={{ height:70, width:70, borderRadius:5 }} />
          </View>
          <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:14}}>{booking_details.customer_name}</Text>
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13}}>{booking_details.title}</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <Text  style={{ fontFamily:regular, color:colors.grey, fontSize:13}}>{booking_details.description}</Text>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row', width:'100%'}}>
          <View style={{ flexDirection:'row', width:'55%', alignItems:'center', justifyContent:'flex-start'}}>
            <Icon type={Icons.AntDesign} name="calendar"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg }} />
            <View style={{ margin:5 }} />
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13, alignSelf:'center', justifyContent:'flex-end'}}>Appointment Date</Text>
          </View>
          <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:13, alignSelf:'flex-start'}}>{Moment(booking_details.start_time).format('DD MMMM-YYYY')}</Text>
          </View>
        </View>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row', width:'100%'}}>
          <View style={{ flexDirection:'row', width:'55%', alignItems:'center', justifyContent:'flex-start'}}>
            <Icon type={Icons.AntDesign} name="clockcircleo"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg }} />
            <View style={{ margin:5 }} />
            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13, alignSelf:'center', justifyContent:'flex-end'}}>Appointment Time</Text>
          </View>
          <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}>
            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:13, alignSelf:'flex-start'}}>{Moment(booking_details.start_time).format('hh:mm A')}</Text>
          </View>
        </View>
      </View>
    </CardView>
    <View style={{ flexDirection:'row', width:'100%', padding:10, position:'absolute', bottom:100}}>
      <TouchableOpacity onPress={navigate_patient_histories.bind(this)} style={{ width:'100%',margin:2, borderWidth:0.2, padding:10, borderRadius:10, borderColor:colors.theme_fg, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
        <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_three}}>Patient Medical Histories</Text>  
      </TouchableOpacity>
    </View>
    {booking_details.slug != 'booking_completed' && booking_details.slug != 'booking_rejected' &&
      <TouchableOpacity onPress={change_request.bind(this,'booking_completed')} style={styles.button}>
        <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Complete</Text>
      </TouchableOpacity>
    }
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three
  },
  image: {
    justifyContent: "center",
    alignItems:'center',
    height:300,
    width:'100%'
  },
  button: {
    padding:10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    position:'absolute',
    bottom:10, 
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
  },
});

export default MyBookingDetails;