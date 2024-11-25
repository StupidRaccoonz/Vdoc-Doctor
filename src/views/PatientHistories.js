import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, background_img, bold, img_url, patient_histories, api_url  } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardView from 'react-native-cardview';
import Moment from 'moment';

const PatientHistories = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [patient_history, setPatientHistory] = useState([]);
  const [patient_details, setPatientDetails] = useState(''); 
  const [title, setTitle] = useState(''); 
  const [booking_data, setBookingData] = useState(route.params.booking_data); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    view_patient_histories();
  },[]);

  const view_patient_histories = async(slug) =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + patient_histories,
      data:{ customer_id:booking_data.patient_id}
    })
    .then(async response => {
      setLoading(false);
      setPatientDetails(response.data.result.patient_details);
      setPatientHistory(response.data.result.history);
console.log(response.data.result)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={1} style={{ padding:5 }}>
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
                <Text numberOfLines={1} style={{ fontSize:12, color:colors.theme_fg, fontFamily:bold}}>{item.hospital_name} Hospitsl</Text>
                <View style={{ margin:2 }} />
                <Text numberOfLines={1} style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Dr. {item.doctor_name}</Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}} >{item.description}</Text>
              </View>
            </View>
          </View>
        </CardView>
      </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    	<ScrollView style={{padding:10 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 150, width: '100%', borderRadius:20 }}>
          <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={ background_img } />
          <View style={{ position:'absolute', top:0, width:'100%', flexDirection:'row' }}>
            <View style={{ width:'60%', padding:20 }}>
              <Text style={{ fontSize:20, color:colors.theme_fg_three, fontFamily:bold, marginTop:5}}>{patient_details.customer_name}</Text>
              <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:regular, marginTop:10, letterSpacing:1 }}>Blood Group - {patient_details.blood_group}</Text>
              {patient_details.gender == 1?
                <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:regular, marginTop:10, letterSpacing:1 }}>Gender - Male</Text>
                :
                <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:regular, marginTop:10, letterSpacing:1 }}>Gender - Female</Text>
              }
              <View style={{ margin:15 }} />
            </View> 
            <View style={{ width:'40%', padding:10, alignItems:'flex-end', justifyContent:'center' }}> 
              <View style={{ height:100, width:100 }}>
                <Image style={{ height: undefined, width: undefined, flex:1, borderRadius:10 }} source={{ uri : img_url + patient_details.profile_picture}} /> 
              </View> 
            </View> 
          </View>   
        </View> 
        <View style={{ margin:10 }} />  
        {patient_histories.length == 0 ?
          <View style={{marginTop:'30%'}}>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14}}>No medical histories.</Text>
          </View>
          :
          <FlatList
            data={patient_history}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
    	</ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two, 
    fontFamily:regular,
    borderWidth:1,
    borderColor:colors.light_grey
  },
  input: {
    width:'100%',
    height:100,
    borderColor:colors.light_grey,
    borderWidth:1,
    backgroundColor:colors.theme_bg_three,
    padding:10,
    borderRadius:10,
    fontSize:14,
    color:colors.grey, 
    fontFamily:regular
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45,
  },
  button1: {
    padding:10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor:colors.theme_fg_three,
    width:'100%',
    height:45,
    justifyContent:'flex-start',
    alignItems:'center',
    borderWidth:1,
    borderColor:colors.light_grey
  },
  in_active_badge:{ 
    borderWidth:1, 
    borderColor:colors.light_grey, 
    backgroundColor:colors.theme_fg_three, 
    padding:5, 
    width:60, 
    height:60, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  active_badge:{ 
    borderWidth:1, 
    borderColor:colors.theme_bg, 
    backgroundColor:colors.theme_bg, 
    padding:5, 
    width:60, 
    height:60, 
    borderRadius:10, 
    alignItems:'center', 
    justifyContent:'center', 
    marginRight:15 
  },
  in_active_text:{ 
    fontSize:12, 
    color:colors.theme_fg_two, 
    fontFamily:bold 
  },
  active_text:{ 
    fontSize:12, 
    color:colors.theme_fg_three, 
    fontFamily:bold 
  }
});

export default PatientHistories;
