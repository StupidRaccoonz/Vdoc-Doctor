import React, { useState} from 'react';
import { StyleSheet, Text, TouchableOpacity,  ScrollView, SafeAreaView, View, TextInput } from 'react-native';
import { api_url, bold, regular, add_prescription_items, create_prescription } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader from '../components/Loader'; 
import axios from 'axios';
import { Input, CheckBox, Button } from 'react-native-elements';
import Icon, { Icons } from '../components/Icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const WritePrescription = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false); 
  const [data, setData] = useState([]); 
  const [medicine_name, setMedicineName] = useState(''); 
  const [morning, setMorning] = useState(true); 
  const [afternoon, setAfternoon] = useState(true); 
  const [evening, setEvening] = useState(true); 
  const [night, setNight] = useState(true); 
  const [booking, setBooking] = useState(route.params.data); 
  const [prescription_id, setPrescriptionId] = useState(route.params.prescription_id); 
  const [subjective, setSubjective] = useState(''); 
  const [objective, setObjective] = useState(''); 
  const [assessment, setAssessment] = useState(''); 
  const [plan, setPlan] = useState('');
  const [doctor_note, setDoctorNote] = useState(''); 
console.log(prescription_id)
  const handleBackButtonClick = () => {
    navigation.goBack(null);
  }

  const change_morning = () => {
    setMorning(!morning)
  }

  const change_afternoon = () => {
    setAfternoon(!afternoon)
  }

  const change_evening = () => {
    setEvening(!evening)
  }

  const change_night = () => {
    setNight(!night)
  }

  const write_prescription_notes = async() =>{
    console.log({  booking_id:booking.id, doctor_notes:doctor_note, plan:plan, assessment:assessment,
        objective_information:objective, subjective_information:subjective,})
      setLoading(true);
      await axios({
        method: 'post', 
        url: api_url + create_prescription,
        data:{  booking_id:booking.id, doctor_notes:doctor_note, plan:plan, assessment:assessment,
            objective_information:objective, subjective_information:subjective}
      })
      .then(async response => {
        setLoading(false);
        setPrescriptionId(response.data.data.id);
        handleBackButtonClick();
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry, something went wrong');
      });
  }

  const write_prescription_items = async() =>{
    console.log({ prescription_id:prescription_id, medicine_name:medicine_name, morning:morning ? 1 : 0, afternoon:afternoon ? 1 : 0, evening:evening ? 1 : 0, night:night ? 1 : 0})
    if(medicine_name == ""){
      alert('Pleae add drug name');
      return false;
    }else if (morning == 0 && afternoon == 0 && evening == 0 && night == 0){
      alert("Add preferences")
      return false;
    }else{
      setLoading(true);
      await axios({
        method: 'post', 
        url: api_url + add_prescription_items,
        data:{ prescription_id:prescription_id, medicine_name:medicine_name, morning:morning ? 1 : 0, afternoon:afternoon ? 1 : 0, evening:evening ? 1 : 0, night:night ? 1 : 0}
      })
      .then(async response => {
        setLoading(false);
        handleBackButtonClick();
        setMedicineName("");
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry, something went wrong');
      });
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        {prescription_id == 0 ?
            <View>
                <View>
                    <View style={styles.wri_style1}>
                    <View style={styles.wri_style4} />
                    <Text style={styles.wri_style5}>Add Notes</Text>
                    </View>
                </View>
                <ScrollView keyboardDismissMode='on-drag' style={{ padding:20 }} showsVerticalScrollIndicator={false}>
                    <View style={{ margin:5 }}/>
                    <View style={styles.textFieldcontainer}>
                        <TextInput
                            style={styles.textField}
                            placeholder="Enter your Subjective"
                            placeholderTextColor={colors.grey}
                            underlineColorAndroid="transparent"
                            onChangeText={text => setSubjective(text)}
                            multiline={true}
                        />
                    </View>
                <View style={{ margin:10 }}/>
                <View style={styles.textFieldcontainer}>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter your Objective"
                        placeholderTextColor={colors.grey}
                        underlineColorAndroid="transparent"
                        onChangeText={text => setObjective(text)}
                        multiline={true}
                    />
                </View>
                <View style={{ margin:10 }}/>
                <View style={styles.textFieldcontainer}>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter your Assessment"
                        placeholderTextColor={colors.grey}
                        underlineColorAndroid="transparent"
                        onChangeText={text => setAssessment(text)}
                        multiline={true}
                    />
                </View>
                <View style={{ margin:10 }}/>
                <View style={styles.textFieldcontainer}>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter your Plan"
                        placeholderTextColor={colors.grey}
                        underlineColorAndroid="transparent"
                        onChangeText={text => setPlan(text)}
                        multiline={true}
                    />
                </View>
                <View style={{ margin:10 }}/>
                <View style={styles.textFieldcontainer}>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter your Notes"
                        placeholderTextColor={colors.grey}
                        underlineColorAndroid="transparent"
                        onChangeText={text => setDoctorNote(text)}
                        multiline={true}
                    />
                </View>
                <View style={{ margin:50 }}/>
                <View style={{ left:0, right:0, bottom:18, alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
                    <TouchableOpacity activeOpacity={1} onPress={write_prescription_notes.bind(this)} style={styles.button}>
                        <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </View>
        :
            <View>
                <View>
                    <View style={styles.wri_style1}>
                        <View style={styles.wri_style4} />
                        <Text style={styles.wri_style5}>Add drug</Text>
                    </View>
                </View>
                <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false}>
                    <Input
                        placeholder='Enter drug name'
                        label="Drug Name"
                        labelStyle={styles.wri_style9}
                        inputStyle={styles.wri_style10}
                        value={medicine_name}
                        onChangeText={text => setMedicineName(text)}
                        leftIcon={
                            <Icon type={Icons.FontAwesome5} name="briefcase-medical" style={styles.wri_style11}/>
                        }
                    />
                    <View style={styles.wri_style12}>
                        <Text style={styles.wri_style13}>Preferences</Text>
                        <View style={styles.wri_style14} />
                        <CheckBox
                            title='Morning'
                            checked={morning}
                            onPress={change_morning}
                        />
                        <View style={styles.wri_style15} />
                        <CheckBox
                            title='Afternoon'
                            checked={afternoon}
                            onPress={change_afternoon}
                        />
                        <View style={styles.wri_style16} />
                        <CheckBox
                            title='Evening'
                            checked={evening}
                            onPress={change_evening}
                        />
                        <View style={styles.wri_style17} />
                        <CheckBox
                            title='Night'
                            checked={night}
                            onPress={change_night}
                        />
                    </View>
                    <View style={{ margin:50 }}/>
                    <View style={{ left:0, right:0, bottom:0, alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
                        <TouchableOpacity activeOpacity={1} onPress={write_prescription_items.bind(this)}   style={styles.button}>
                            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Add Prescription</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Loader visible={loading} />
            </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

export default WritePrescription;

const styles = StyleSheet.create({
  wri_style1:{alignItems:'flex-start',margin:20},
  wri_style2:{ width:50, justifyContent:'center'},
  wri_style3:{color:colors.black},
  wri_style4:{margin:5},
  wri_style5:{fontSize:25,color:colors.theme_fg_two,fontFamily:bold},
  wri_style7:{padding:20},
  wri_style8:{fontSize:14},
  wri_style9:{fontFamily:regular,color:colors.theme_fg_two},
  wri_style10:{fontFamily:regular},
  wri_style11:{color:colors.theme_fg},
  wri_style12:{padding:10},
  wri_style13:{fontFamily:regular,fontSize:16,color:colors.theme_fg_two},
  wri_style14:{margin:5},
  wri_style15:{margin:5},
  wri_style16:{margin:5},
  wri_style17:{margin:5},
  wri_style18:{backgroundColor:'transparent'},
  wri_style19:{backgroundColor:colors.theme_bg, height:'100%',width:'200%',alignSelf:'center'},
  wri_style20:{fontSize:16,alignSelf:'center',color:colors.theme_bg_three,fontFamily:regular},
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
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 80
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 100,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two
  },
});
