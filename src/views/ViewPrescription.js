import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, FlatList, TouchableOpacity, ScrollView, SafeAreaView, View } from 'react-native';
import { api_url, doctor_get_prescription, bold } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader from '../components/Loader'; 
import axios from 'axios';
import { Badge } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';

const ViewPrescription = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false); 
  const [booking, setBooking] = useState(route.params.data); 
  const [data, setData] = useState([]); 
  const [prescription_id, setPrescriptionId] = useState(0); 

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_prescriptions();
    });
    return unsubscribe;
  },[]); 

  const add_prescription = () => {
    navigation.navigate('WritePrescription',{ data:booking, prescription_id:prescription_id });
  }

  const get_prescriptions = async() =>{
    console.log(booking.id)
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_get_prescription,
      data:{ booking_id:booking.id }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        setData(response.data.result.items);
        setPrescriptionId(response.data.result.prescription_id);
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry, something went wrong');
    });
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{ margin:10}}/>
      <ScrollView>
        <View>
          <FlatList
            data={data}
            renderItem={({ item,index }) => (
              <View style={{flexDirection:'row', padding:20}}>
                <View style={{alignItems:'flex-start', justifyContent:'center', width:'50%'}}>
                  <Text style={{fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{item.medicine_name}</Text>
                </View>
                <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'center', width:'50%'}}>
                  <View style={styles.prescription_style8}>
                    {item.morning == 1 ? 
                      <Badge status="success" value="M" badgeStyle={{width:40, height:20}}/>
                    :
                      <Badge status="error" value="M" badgeStyle={{width:40, height:20}}/>
                    }
                    <View style={styles.prescription_style8} />
                    {item.afternoon == 1 ? 
                      <Badge status="success" value="A" badgeStyle={{width:40, height:20}}/>
                    :
                      <Badge status="error" value="A" badgeStyle={{width:40, height:20}}/>
                    }
                    <View style={styles.prescription_style9} />
                    {item.evening == 1 ? 
                      <Badge status="success" value="E" badgeStyle={{width:40, height:20}}/>
                    :
                      <Badge status="error" value="E" badgeStyle={{width:40, height:20}}/>
                    }
                    <View style={styles.prescription_style10} />
                    {item.night == 1 ? 
                      <Badge status="success" value="N" badgeStyle={{width:40, height:20}}/>
                    :
                      <Badge status="error" value="N" badgeStyle={{width:40, height:20}}/>
                    }
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => item.question}
          />
        </View>
      </ScrollView>
      <View style={{ left:0, right:0, bottom:0, alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
        <TouchableOpacity onPress={add_prescription.bind(this)}   style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Add Prescription</Text>
        </TouchableOpacity>
      </View>
      <Loader visible={loading} />
    </SafeAreaView>
  );
}

export default ViewPrescription;

const styles = StyleSheet.create({
prescription_style2: { justifyContent:'flex-end', alignItems:'flex-end'},
prescription_style3: {color:colors.theme_fg_two},
prescription_style6: { fontSize:25, color:colors.theme_fg_two,  fontFamily: bold},
prescription_style7: {color:colors.theme_fg_five, marginTop:5},
prescription_style8:{margin:2, flexDirection:'row'},
prescription_style9:{margin:2, flexDirection:'row'},
prescription_style10:{margin:2, flexDirection:'row'},
prescription_style11: { color:colors.theme_fg_two, fontSize:30},
container: {
  flex: 1,
  backgroundColor:colors.theme_fg_three,
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
