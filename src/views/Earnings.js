import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, doctor_earning, api_url, money_bag, earning_img } from '../config/Constants';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Moment from 'moment';

const Earnings = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [total_earnings, setTotalEarnings] = useState('');
  const [today_earnings, setTodayEarnings] = useState('');
  const [earnings, setEarnings] = useState([]); 
  const [count, setCount] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_earning();
    });
    return unsubscribe;
  },[]);

  const get_earning = async() => {
    await axios({
      method: 'post', 
      url: api_url + doctor_earning,
      data:{ id:global.id }
    })
    .then(async response => {
      setTotalEarnings(response.data.result.total_earnings);
      setTodayEarnings(response.data.result.today_earnings);
      setEarnings(response.data.result.earnings);
      setCount(response.data.result.earnings.length);
    })
    .catch(error => {
      alert('Sorry something went wrong')
    });
  }  

  const renderItem = ({ item }) => (
    <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
      <View style={{ width:'15%',justifyContent:'center', alignItems:'center' }}>
        <Image style={{ height: 30, width: 30 ,}} source={earning_img} />
      </View>  
      <View style={{ width:'65%', justifyContent:'center', alignItems:'flex-start'}}>
        <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>Your earnings credited for booking Id - #{item.id}</Text>
      <View style={{ margin:2}} />
        <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{Moment(item.created_at).fromNow()}</Text>   
      </View>
      <View style={{ width:'20%',justifyContent:'center', alignItems:'center'}}>
        <Text style={{ fontFamily:bold, fontSize:16, color:colors.grey}}>{global.currency}{item.amount}</Text>
      </View>  
    </View>
    
  );


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ margin:10 }} />
        <View style={{width:'100%', flexDirection:'row', alignItems:'center',  justifyContent:'center'}}>
          <CardView cardMaxElevation={5}
          cornerRadius={10}
          cardElevation={5}
          style={{ width:'40%', flexDirection:'column', backgroundColor:colors.theme_fg_three, borderRadius:10, padding:5, paddingTop:15, paddingBottom:15, alignItems:'center', justifyContent:'center'}}>
            <View style={{ justifyContent:'center', alignItems:'center', backgroundColor:colors.secondary_blue, borderRadius:100, width:'50%' }}>
              <Image style={{ height: 30, width: 30, margin:20 }} source={money_bag} />
            </View>
            <View style={{margin:3}}/>
            <View style={{ justifyContent:'center', alignItems:'center' }}>
              <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:25}}>{global.currency}{today_earnings}</Text>
              <View style={{ margin:2 }} />
              <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12}}>Today Earnings</Text>
            </View>
          </CardView>
          <View style={{ width:'5%'}}/>
          <CardView cardMaxElevation={5}
          cornerRadius={10}
          cardElevation={5}
          style={{ width:'40%', flexDirection:'column', backgroundColor:colors.theme_fg_three, marginLeft:'2%', marginRight:'1%', borderRadius:10, padding:5, paddingTop:15, paddingBottom:15, alignItems:'center', justifyContent:'center'}}>
            <View style={{ justifyContent:'center', alignItems:'center', backgroundColor:colors.secondary_blue, borderRadius:100, width:'50%' }}>
              <Image style={{ height: 30, width: 30, margin:20 }} source={money_bag} />
            </View>
            <View style={{margin:3}}/>
            <View style={{ justifyContent:'center', alignItems:'center' }}>
              <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:25}}>{global.currency}{total_earnings}</Text>
              <View style={{ margin:2 }} />
              <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:12}}>Total Earnings</Text>
            </View>
          </CardView>
        </View>
        <View style={{ margin:10 }} />
        <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two, padding:10}}>Earnings transactions</Text>
        {count == 0 ?
          <View style={{marginTop:'10%'}}>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14}}>No earnings received yet.</Text>
          </View>
          :
          <FlatList
            data={earnings}
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
    flex: 1,
    backgroundColor:colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
    padding:10
  },
 
});

export default Earnings;
