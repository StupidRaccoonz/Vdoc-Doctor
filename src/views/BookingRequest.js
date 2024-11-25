import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import Icon, { Icons } from '../components/Icons'
import * as colors from '../assets/css/Colors';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import {  booking_accept_img, theme_gradient, regular, bold, api_url, doctor_accept_booking, patient_histories } from '../config/Constants';
import CardView from 'react-native-cardview';
import Moment from 'moment';
import Loader from '../components/Loader'; 
import axios from 'axios';

const BookingRequest = () =>{
	const navigation = useNavigation();
	const route = useRoute();
	const [booking_data, setBookingData] = useState(route.params.data);
	const [loading, setLoading] = useState(false);

	const handleBackButtonClick= () => {
	    navigation.goBack()
	}

	const booking_request = async(slug) =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_accept_booking,
      data:{ booking_request_id:booking_data.id, slug:slug }
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
	  navigation.navigate("PatientHistories", {patient_id:booking_data.patient_id})
  }

	return(
		<SafeAreaView style={styles.container}>
			<Loader visible={loading}/>
		    <ImageBackground source={theme_gradient} resizeMode="cover" style={styles.image}>
		      <Image source={booking_accept_img} style={{ height:100, width:100 }} />
		      <View style={{ margin:5 }} />
		      <Text style={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:18}}>{booking_data.status_name}</Text>
		    </ImageBackground>
		    <CardView
		      cardElevation={4}
		      cardMaxElevation={4}
		      style={{ padding:20, justifyContent:'center', width:'90%', marginLeft:'5%', marginRight:'5%', position:'absolute', top:250 }}
		      cornerRadius={5}>
		      <View>
		        <Text style={{ fontFamily:bold, color:colors.theme_fg, fontSize:15}}>Booking ID : #{booking_data.id}</Text>
		        <View style={{ margin:5 }} />
		        <View style={{ flexDirection:'row'}}>
		          <View style={{ width:'30%', alignItems:'flex-start', justifyContent:'center'}}>
		            <Image source={{ uri : "https://www.w3schools.com/howto/img_avatar.png" }} style={{ height:70, width:70, borderRadius:5 }} />
		          </View>
		          <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center'}}>
		            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:14}}>{booking_data.customer_name}</Text>
		            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13}}>{booking_data.title}</Text>
		          </View>
		        </View>
		        <View style={{ margin:10 }} />
		        <Text  style={{ fontFamily:regular, color:colors.grey, fontSize:13}}>{booking_data.description}</Text>
		        <View style={{ margin:10 }} />
		        <View style={{ flexDirection:'row', width:'100%'}}>
		          <View style={{ flexDirection:'row', width:'60%', alignItems:'center', justifyContent:'flex-start'}}>
		            <Icon type={Icons.AntDesign} name="calendar"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg }} />
		            <View style={{ margin:5 }} />
		            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13, alignSelf:'center', justifyContent:'flex-end'}}>Appointment Date</Text>
		          </View>
		          <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}}>
		            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:13, alignSelf:'flex-start'}}>{Moment(booking_data.start_time).format('DD MMM-YYYY')}</Text>
		          </View>
		        </View>
		        <View style={{ margin:5 }} />
		        <View style={{ flexDirection:'row', width:'100%'}}>
		          <View style={{ flexDirection:'row', width:'60%', alignItems:'center', justifyContent:'flex-start'}}>
		            <Icon type={Icons.AntDesign} name="clockcircleo"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg }} />
		            <View style={{ margin:5 }} />
		            <Text style={{ fontFamily:regular, color:colors.grey, fontSize:13, alignSelf:'center', justifyContent:'flex-end'}}>Appointment Time</Text>
		          </View>
		          <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}}>
		            <Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:13, alignSelf:'flex-start'}}>{Moment(booking_data.start_time).format('hh:mm A')}</Text>
		          </View>
		        </View>
		      </View>
		    </CardView>
		    <View style={{ flexDirection:'row', width:'100%', padding:10, position:'absolute', bottom:10}}>
		        <TouchableOpacity onPress={booking_request.bind(this, 'booking_rejected')} style={{ width:'50%',margin:2, borderWidth:0.2, padding:10, borderRadius:10, borderColor:colors.theme_fg, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
		          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_three}}>Decline</Text>  
		        </TouchableOpacity>
		        <TouchableOpacity onPress={booking_request.bind(this, 'booking_confirmed')}  style={{ width:'50%',margin:2, borderWidth:0.2, padding:10, borderRadius:10, borderColor:colors.theme_fg, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
		          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_three}}>Accept</Text>  
		        </TouchableOpacity>
		    </View> 
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
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
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
    width:'48%',
    marginLeft:'5%',
    marginRight:'5%'
  },
});

export default BookingRequest;