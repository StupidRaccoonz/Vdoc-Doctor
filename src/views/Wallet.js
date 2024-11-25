import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, FlatList, } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, wallet, wallet_money, credit_card, doctor_wallet_histories, api_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loader from '../components/Loader';
import Moment from 'moment';

const Wallet = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [wallet_list, setWalletList] = useState([]);
  const [wallet_amount, setWalletAmount] = useState(''); 
  const [count, setCount] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await wallet_transactions();
    });
    return unsubscribe;
  },[]);

  const handleBackButtonClick= () => {
    navigation.goBack()
  } 

  const wallet_transactions = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_wallet_histories,
      data:{ id:global.id }
    })
    .then(async response => {
      console.log(response.data.result)
      setLoading(false);
      setWalletAmount(response.data.result)
      setWalletList(response.data.result.wallets)
      setCount(response.data.result.wallets.length)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }  

  const renderItem = ({ item }) => (
    <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>  
      <View style={{ width:'70%', justifyContent:'center', alignItems:'flex-start'}}>
        <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.message}</Text>
      <View style={{ margin:2}} />
        <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{Moment(item.created_at).format('MMM DD, YYYY hh:mm A')}</Text>   
      </View>
      <View style={{ width:'30%',justifyContent:'center', alignItems:'flex-end'}}>
        <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{global.currency}{item.amount}</Text>
      </View> 
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding:10 }} showsVerticalScrollIndicator={false}>
      <Loader visible={loading} />
        <View style={{ margin:10 }} />
        <View style={styles.imageView}>
          <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={credit_card} />
          <View style={{ width:'100%', padding:20, position:'absolute', top:10, alignItems:'center', justifyContent:'center'}}>
            <View style={{ flexDirection:'row' }} >
              <View style={{ width:'30%', alignItems:'flex-start', justifyContent:'flex-end' }}>
                <Image style= {{ height: 70, width:70 }} source={wallet_money} />
              </View>
              <View style={{ margin:5 }}/>
              <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'flex-end' }}>
                <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_bg_three, letterSpacing:0.5}}>Your total balance</Text> 
                <View style={{ margin:5 }} />
                <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_bg_three}}>{global.currency}{wallet_amount.wallet_amount}</Text> 
              </View> 
            </View>  
          </View> 
          <View style={{ margin:10 }} />
          <View style={styles.ridesFriends}>
          </View> 
        </View>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row',}}>
          <Image style= {{ height: 20, width:20 }} source={wallet} />
           <View style={{ margin:5 }} />
          <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two}}>Wallet transactions</Text>
        </View>
        <View style={{ margin:5 }} />
        {count == 0 ?
         <View style={{marginTop:'10%'}}>
           <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14}}>No transaction done yet.</Text>
         </View>
       :
         <FlatList
          data={wallet_list}
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
    backgroundColor:colors.theme_bg_three,
  },
  imageView:{
      height:150, 
      width:'100%',
      borderRadius:40
  },
  ridesFriends: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width:'100%',
    padding:10,
    position:'absolute',
    top:120,
  }
 
});

export default Wallet;
