import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, clock, month_name, create_appointment, api_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import Loader from '../components/Loader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateAppointment = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [appointment_fee, setAppointmentFee] = useState(""); 
  const [phone_number, setPhoneNumber] = useState(""); 
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState(undefined);
  const [defaultDate, setDefaultDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  const [dates, setDateList] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get_dates();
  },[]);

  const get_dates = async() =>{
    let dates = [];
    for(let i=0; i<7; i++){
      if(i==0){
        let today = new Date();
        dates[i] = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      }else{
        let today = new Date();
        let new_date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i);
        dates[i] = new_date.getFullYear()+'-'+(new_date.getMonth()+1)+'-'+new_date.getDate();
      }
    }
    setDateList(dates);
    setDate(dates[0]);
  }

  const onChange = async(event, selectedTime) => {
    setShow(false);
    let hours = await selectedTime.getHours(),
      minutes = await selectedTime.getMinutes();
     // seconds = await selectedTime.getSeconds();
    //let time = await hours + ":" + minutes + ":" + seconds;
    let time = await hours + ":" + minutes;
    setDefaultDate(selectedTime);
    setTime(time);
  };

  const change_date = (date) => {
    setDate(date);
  };

  const showTimepicker = () => {
    setShow(true);
  };

  const submit_data = () =>{
    if(time == undefined){
      alert('Please select appointment time')
    }else if(title == ""){
      alert('Please enter the reson for appointment')
    }else if(description == ""){
      alert('Please enter the short description')
    }else if(date == undefined){
      alert('Please select appointment date')
    }else{
        create_booking()
    }
  }

  const create_booking = async () => {
      console.log({ doctor_id:global.id,
        phone_number:phone_number,
        start_time:date+' '+time,
        title:title,
        total_amount:appointment_fee,
        payment_mode:2,
        description:description })
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + create_appointment,
      data:{ doctor_id:global.id,
        phone_number:phone_number,
        start_time:date+' '+time,
        title:title,
        total_amount:appointment_fee,
        payment_mode:2,
        description:description }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 0){
        alert(response.data.message)
      }else{
        navigate_booking_page()
      }
    })
    .catch(error => {
      setLoading(false);
      alert("Sorry something wrong")
    });
  }
  const navigate_booking_page = () =>{
      navigation.navigate("Home")
  }

  const show_dates = () => { 
    return dates.map((data) => {
      let temp = data.split('-');
      let cur_date = temp[2];
      let month = month_name[temp[1] - 1];
      return (
        <TouchableOpacity onPress={change_date.bind(this,data)} style={ (data == date) ? styles.active_badge : styles.in_active_badge}>
          <Text style={ (data == date) ? styles.active_text : styles.in_active_text}>{cur_date}</Text>
          <View style={{ margin:1 }} />  
          <Text style={ (data == date) ? styles.active_text : styles.in_active_text}>{month}</Text>
        </TouchableOpacity>
      )
    });
  }
  return (
    <SafeAreaView style={styles.container}>
        <Loader visible={loading}/>
    	<ScrollView style={{padding:10 }} showsVerticalScrollIndicator={false}>
        <View style={{ margin:10 }} />  
        <View style={{ flexDirection:'row', marginTop:10 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {show_dates()}
          </ScrollView>
        </View> 
        <View style={{ margin:15 }} />
        <View style={{ alignItems:'center', justifyContent:'center',}}> 
          <TouchableOpacity onPress={showTimepicker} style={styles.button1}>
            <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center', }} >
              {time == undefined ? 
              <Text style={{ color:colors.regular_grey, fontFamily:regular, fontSize:13 }}>Select time</Text>
              :
              <Text style={{ color:colors.regular_grey, fontFamily:regular, fontSize:13 }}>{time}</Text>
              }
            </View> 
            <View style={{ width:'30%', alignItems:'flex-end', justifyContent:'center', }} > 
              <View style={{ height: 30, width: 30 }}>
                <Image style={{ height: undefined, width: undefined, flex:1  }} source={ clock }/>
              </View> 
            </View> 
          </TouchableOpacity>
        </View> 
        <View style={{ margin:10 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Patient Number</Text>
        <View style={{ margin:5 }} /> 
        <View style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            onChangeText={text => setPhoneNumber(text)}
            placeholder="Enter Phone Number"
            underlineColorAndroid="transparent"
            keyboardType='numeric'
          />
        </View> 
        <View style={{ margin:10 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Appointment Fee</Text>
        <View style={{ margin:5 }} /> 
        <View style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            onChangeText={text => setAppointmentFee(text)}
            placeholder="Enter Appointment Fee"
            underlineColorAndroid="transparent"
            keyboardType='numeric'
          />
        </View> 
        <View style={{ margin:10 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Booking For?</Text>
        <View style={{ margin:5 }} /> 
        <View style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            onChangeText={text => setTitle(text)}
            placeholder="Booking Details"
            underlineColorAndroid="transparent"
          />
        </View> 
        <View style={{ margin:5 }} /> 
        <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold }}>Short Description</Text>
        <View style={{ margin:10 }} /> 
        <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
          <TextInput
            style={styles.input}
            onChangeText={text => setDescription(text)}
            multiline={true}
            placeholder="Could you elaborate further."
            underlineColorAndroid='transparent'
          />
        </View> 
        <View style={{ margin:5 }} /> 
        <View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              mode="time"
              value={defaultDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        <View style={{ margin:10 }} /> 
        <TouchableOpacity onPress={submit_data} style={{ alignItems:'center', height:50, justifyContent:'center'}}>
          <View style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Make Payment</Text>
          </View>
        </TouchableOpacity>
        <View style={{ margin:20 }} /> 
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

export default CreateAppointment;
