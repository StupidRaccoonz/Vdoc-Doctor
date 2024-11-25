import React, { useState, useEffect} from 'react';
import { StyleSheet,  View, SafeAreaView, Text,  ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons'
import { regular, bold, doctor_online_status, api_url, doctor_dashboard, doctor_get_profile , home_banner, img_url} from '../config/Constants';
import { useNavigation, CommonActions } from '@react-navigation/native';
import CardView from 'react-native-cardview'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import database from '@react-native-firebase/database';
import { connect } from 'react-redux'; 
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import Loader from '../components/Loader';

const Dashboard = (props) => {
  const [switch_value, setSwitchValue] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const navigation = useNavigation();
  const [total_booking, setTotalBookings] = useState(0);
  const [pending_booking, setPendingBookings] = useState(0);
  const [completed_booking, setCompletedBookings] = useState(0);
  const [today_bookings, setTodayBookings] = useState(0);
  const [booking_requests, setBookingRequest] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSwitch = async(value) => {
    if(value){
      setSwitchValue(value);  
      await online_status(1);
      await saveData(1);
    }else{
      setSwitchValue( value );  
      await online_status(0);
      await saveData(0);
    }  
  }

  useEffect( () => {
    if(global.online_status == 1){
      setSwitchValue(true);
    }else{
      setSwitchValue(false);
    }

    const onValueChange =  database().ref(`/doctors/${global.id}`)
      .on('value', snapshot => {
        if(snapshot.val().c_stat == 1){
          console.log('check');
          sync(snapshot.val().c_id);
        }
    });
    const unsubscribe = navigation.addListener('focus', async () => {
     // await get_profile();
      await dashboard();
    });

    return () => {
      unsubscribe();
    };
  },[]); 

  const sync = (id) =>{
    navigation.navigate("VideoCall",{id:id});
  }

  const get_profile = async() => {
    await axios({
      method: 'post', 
      url: api_url + doctor_get_profile,
      data:{ doctor_id:global.id }
    })
    .then(async response => {
      console.log(response.data)
      check_settings(response.data);
    })
    .catch(error => {
      alert('Sorry something went wrong');
    });
  }

  const check_settings = async(data) =>{
    try {
      await AsyncStorage.setItem('profile_status', data.result.profile_status.toString());
      await AsyncStorage.setItem('document_update_status', data.result.document_update_status.toString());
      global.profile_status = await data.result.profile_status;
      global.document_update_status = await data.result.document_update_status;
    } catch (e) {
      alert('Sorry something went wrong');
    }
    if(data.result.profile_status == 0 || data.result.document_update_status == 0){
      navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Settings' },
            ],
          })
        );
    }
  }

  const dashboard = async () => {
    await axios({
      method: 'post', 
      url: api_url + doctor_dashboard,
      data:{ id:global.id }
    })
    .then(async response => {
      setTotalBookings(response.data.result.total_booking);
      setPendingBookings(response.data.result.pending_booking);
      setCompletedBookings(response.data.result.completed_booking);
      setBookingRequest(response.data.result.booking_requests);
      setTodayBookings(response.data.result.today_booking);

    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }

  const online_status = async (status) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_online_status,
      data:{ id:global.id, online_status:status }
    })
    .then(async response => {
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const saveData = async(status) =>{
    try{
        await AsyncStorage.setItem('online_status', status.toString());
        global.online_status = await status.toString();
      }catch (e) {
    }
  }

  const booking_request = (data) =>{
    navigation.navigate('BookingRequest', {data:data})
  }

  const navigate_profile = () =>{
    navigation.navigate('Profile')
  }

  const create_appointment =() =>{
    navigation.navigate('CreateAppointment')
  }

  return (
  <SafeAreaView style={styles.container}>
    <Loader visible={loading}/>
    <View style={{ margin:10}}/>
    <ScrollView style={{ padding:10}} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity style={{ width:'30%',justifyContent:'center', alignItems:'flex-start', }}>
          <Switch
            trackColor={{ false: "#767577", true: colors.theme_bg }}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={switch_value}
          />
        </TouchableOpacity>
        <View style={{ width:'40%'}}/>
        <View  style={{ width:'30%',justifyContent:'center', alignItems:'center' }}>
          <TouchableOpacity onPress={navigate_profile.bind(this)} style={{ width: 40, height:40, borderWidth:1, borderRadius:30, borderColor:colors.theme_bg_three, backgroundColor:colors.theme_bg_three }}>
            <Image style= {{ height: undefined, width: undefined, flex: 1, borderRadius:30 }} source={{uri: img_url+props.profile_picture}} />
          </TouchableOpacity>
        </View>
      </View>
       <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
        <View style={{ width:'50%',justifyContent:'center', alignItems:'flex-start', }}>
          <Text style={{ justifyContent:'center', alignItems:'center' }}>Make Online</Text>
          <Text style={{ justifyContent:'center', alignItems:'center' }}>to consult patients</Text>
        </View>
        <View style={{ width:'20%'}}/>
        <View  style={{ width:'30%',justifyContent:'center', alignItems:'flex-start' }}>
        <Text style={{ justifyContent:'center', alignItems:'center' }}>Update profile</Text>
        <Text style={{ justifyContent:'center', alignItems:'center' }}>to meet patient</Text>
        </View>
      </View> 
      <View style={{ margin:10 }} />
      <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg_two,  letterSpacing:0.5 }}>Hello Dr.{global.doctor_name},</Text>
      <View style={{ width:'100%', height:170}} >
        <Image style= {{ height: undefined,width: undefined,flex: 1 }} source={home_banner} />
      </View>
      <View style={{ margin:10 }} />
      <View style={{ flexDirection:'row', width:'100%'}}>
        <View style={{ width:'50%'}}>
          <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two, alignSelf:'flex-start' }}>Your Reports</Text>
        </View>
        <TouchableOpacity onPress={create_appointment} style={{ width:'50%', justifyContent:'center', alignItems:'flex-end'}}>
          <Icon type={Icons.Ionicons} name="add"  style={{ fontSize:30, fontFamily:bold, color:colors.theme_fg }} />
        </TouchableOpacity>
      </View>
      <View style={{ margin:5 }} />
      <View style={{ flexDirection:'row'}}>
        <View style={{ width:'50%', padding:5}}>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            style={{ padding:20, alignItems:'center', justifyContent:'center', backgroundColor:'#871848' }}
            cornerRadius={5}>
            <Icon type={Icons.Ionicons} name="list"  style={{ fontSize:30, fontFamily:bold, color:colors.theme_fg_three }} />
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg_three }}>
                {total_booking}
            </Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_three }}>
                Total Bookings
            </Text>
          </CardView>
        </View>
        <View style={{ width:'50%', padding:5}}>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            style={{ padding:20, alignItems:'center', justifyContent:'center', backgroundColor:'#036b47' }}
            cornerRadius={5}>
            <Icon type={Icons.Feather} name="check-circle"  style={{ fontSize:30, fontFamily:bold, color:colors.theme_fg_three }} />
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg_three }}>
                {completed_booking}
            </Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_three }}>
                Completed
            </Text>
          </CardView>
        </View>
      </View>
      <View style={{ flexDirection:'row'}}>
        <View style={{ width:'50%', padding:5}}>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            style={{ padding:20, alignItems:'center', justifyContent:'center', backgroundColor:'#0B6076' }}
            cornerRadius={5}>
            <Icon type={Icons.Entypo} name="add-to-list"  style={{ fontSize:30, fontFamily:bold, color:colors.theme_fg_three }} />
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg_three }}>
                {today_bookings}
            </Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_three }}>
                Today Bookings
            </Text>
          </CardView>
        </View>
        <View style={{ width:'50%', padding:5}}>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            style={{ padding:20, alignItems:'center', justifyContent:'center', backgroundColor:'#b35702' }}
            cornerRadius={5}>
            <Icon type={Icons.MaterialIcons} name="pending-actions"  style={{ fontSize:30, fontFamily:bold, color:colors.theme_fg_three }} />
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg_three }}>
                {pending_booking}
            </Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontSize:12, fontFamily:bold, color:colors.theme_fg_three }}>
                Today Pendings
            </Text>
          </CardView>
        </View>
      </View>
      <View style={{ margin:5 }} />
      <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two, alignSelf:'flex-start' }}>Pending For Approval</Text>
      <View style={{ margin:10 }} />
      {booking_requests.length == 0 ?
        <Text style={{ fontFamily:bold, textAlign:'center', marginTop:'10%'}}>No bookings received yet.</Text>
        :
        <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true} >
         {booking_requests.map((item) => {
            return (
              <CardView
                cardElevation={2}
                cardMaxElevation={2}
                style={{ padding:20, justifyContent:'center', width:300, height:120, margin:5 }}
                cornerRadius={5}>
                <TouchableOpacity onPress={booking_request.bind(this, item)}>
                  <Text style={{ fontSize:16, color:colors.theme_fg_two, fontFamily:bold}}>{item.customer_name}</Text>
                  <View style={{ margin:2 }} />
                  <View style={{ borderLeftWidth:4, borderColor:colors.theme_bg, padding:10 }}>
                    <Text numberOfLines={1} style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{item.title}</Text>
                    <View style={{ margin:4 }} />
                    <View style={{ flexDirection:'row'}}>
                      <Icon type={Icons.AntDesign} name="clockcircleo"  style={{ fontSize:20, fontFamily:bold, color:colors.theme_fg }} />
                      <View style={{ margin:4 }} />
                      <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}} >{Moment(item.start_time).format('DD MMM-YYYY hh:mm A')}</Text>
                    </View>
                    <View style={{ margin:2 }} />
                    <Text style={{ fontSize:10, color:colors.theme_fg, fontFamily:bold}} >( Appointment Date )</Text>
                  </View>
                </TouchableOpacity>
              </CardView>
            );
          })}     
      </ScrollView>
      }
      <View style={{ margin:50 }} />     
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function mapStateToProps(state){
  return{
    profile_picture : state.current_location.profile_picture,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
