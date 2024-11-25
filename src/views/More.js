import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, doctor_online_status, api_url } from '../config/Constants';
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import Dialog from "react-native-dialog";
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const More = (props) => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const next = (name) => {
    if(name == 'Notifications'){
      navigation.navigate("Notifications")
    }else if(name == 'Profile'){
      navigation.navigate("Profile")
    }else if(name == 'Bank Details'){
      navigation.navigate("AddBankDetails")
    }else if(name == 'Document Upload'){
      navigation.navigate("Documents")
    }else if(name == 'Consultation Charges'){
      navigation.navigate("AppointmentSettings")
    }else if(name == 'Earnings'){
      navigation.navigate("Earnings")
    }else if(name == 'Withdrawal Transactions'){
      navigation.navigate("Withdrawal")
    }else if(name == 'Wallet Transactions'){
      navigation.navigate("Wallet")
    }else if(name == 'FAQ'){
      navigation.navigate("FaqCategories")
    }else if(name == 'Privacy Policies'){
      navigation.navigate("PrivacyPolicies")
    }else if(name == 'Logout'){
      showDialog();
    }else if(name == "Health"){
      navigation.navigate("Blog")
    }
  }

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleLogout = async() => {
    setVisible(false);
    online_status();
  };

  const online_status = async (status) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_online_status,
      data:{ id:global.id, online_status:0 }
    })
    .then(async response => {
      setLoading(false);
      await AsyncStorage.clear();
      global.online_status=0
      navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "CheckPhone" }],
        })
      );
    })
    .catch(error => {
      alert('Sorry something went wrong')
      setLoading(false);
    });
  }
  
  const doctor_menu = [
    {
      id:1,
      title: 'Notifications',
      icon:'bell'
    },
    { id:2,
      title: 'Health',
      icon:'paperclip'
    },
    { id:3,
      title: 'Profile',
      icon:'user'
    },
    { id:4,
     title: 'Document Upload',
      icon:'upload'
    },
    { id:5,
      title: 'Earnings',
      icon:'dollar'
    },
    { id:6,
      title: 'Consultation Charges',
      icon:'clipboard'
    },
    { id:7,
      title: 'Withdrawal Transactions',
      icon:'credit-card'
    },
    { id:8,
      title: 'Wallet Transactions',
      icon:'money'
    },
    { id:9,
      title: 'FAQ',
      icon:'question-circle-o'
    },
    { id:10,
      title: 'Privacy Policies',
      icon:'pied-piper-pp'
    },
    { id:11,
      title: 'Logout',
      icon:'sign-out'
    },
    ];

  const hospital_menu = [
    {
      id:1,
      title: 'Notifications',
      icon:'bell'
    },
    { id:2,
      title: 'Health',
      icon:'paperclip'
    },
    { id:3,
      title: 'Profile',
      icon:'user'
    },
    { id:4,
      title: 'Bank Details',
      icon:'bank'
    },
    { id:5,
     title: 'Document Upload',
      icon:'upload'
    },
    { id:6,
      title: 'FAQ',
      icon:'question-circle-o'
    },
    { id:7,
      title: 'Privacy Policies',
      icon:'pied-piper-pp'
    },
    { id:8,
      title: 'Logout',
      icon:'sign-out'
    },
    ];
  

  const show_profile = () => {
    navigation.navigate("Profile")
  }


  const renderItem = ({ item }) => (
  <TouchableOpacity activeOpacity={1} onPress={next.bind(this,item.title)}>
    <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, padding:15}}>
      <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
        <Icon type={Icons.FontAwesome} name={item.icon} color={colors.regular_grey} style={{ fontSize:20 }} />
      </View>  
      <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
        <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.title}</Text>
      </View>
      <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
        <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
      </View>  
    </View>
  </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    <Loader visible={loading}/>
      <ScrollView style={{ padding:10 }} showsVerticalScrollIndicator={false}>
        <View style={{ margin:5 }}/>
        <View style={styles.header}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Settings</Text>
        </View>
        <View style={{ margin:10 }} />
        <Dialog.Container contentStyle={{backgroundColor:colors.theme_bg_three}} visible={visible}>
          <Dialog.Title style={{fontFamily: bold, color:colors.theme_fg_two, fontSize:18}}>Confirm Logout</Dialog.Title>
          <Dialog.Description style={{fontFamily: regular, color:colors.theme_fg_two, fontSize:16}}>
            Do you want to logout?
          </Dialog.Description>
          <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="Yes" onPress={handleLogout} />
          <Dialog.Button style={{color:colors.theme_fg_two, fontSize:14}} label="No" onPress={handleCancel} />
        </Dialog.Container>
        {global.hospital_id == 1 ?
          <FlatList
            data={hospital_menu}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          :
          <FlatList
          data={doctor_menu}
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
    justifyContent: 'flex-start',
    backgroundColor:colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
  },
});

export default More;

