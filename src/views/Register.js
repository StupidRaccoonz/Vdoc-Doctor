import React, { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, api_url, doctor_registration } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Loader from '../components/Loader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux'; 
import { updateProfilePicture } from '../actions/CurrentAddressActions';

const Register = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 
  const [doctor_name, setDoctorName] = useState("");
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code_value);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number_value);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState(""); 
  const [additional_qualification, setAddQualification] = useState(""); 
  
  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const phone_reference = () =>{
    setTimeout(() => {
      phone_ref.current.focus();
    }, 200);
  }

  const check_validation = async() => {
    if(!doctor_name || !password || !email ||!qualification ){
      await setValidation(false);
      alert('Please fill all the details.')
    }else{
      await setValidation(true);
      register();
    }
  }

  const register = async() => {
    console.log({ doctor_name: doctor_name, phone_with_code: phone_with_code_value, phone_number: phone_number_value, 
      password: password, fcm_token: global.fcm_token, email:email, qualification:qualification ,
      additional_qualification:additional_qualification })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_registration,
      data:{ doctor_name: doctor_name, phone_with_code: phone_with_code_value, phone_number: phone_number_value, 
        password: password, fcm_token: global.fcm_token, email:email, qualification:qualification ,
        additional_qualification:additional_qualification }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 0){
        alert(response.data.message)
      }else{
        saveData(response.data)
      }
      
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('doctor_name', data.result.doctor_name.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('email', data.result.email.toString());
        await AsyncStorage.setItem('document_update_status', data.result.document_update_status.toString());
        await AsyncStorage.setItem('document_approved_status', data.result.document_approved_status.toString());
        await AsyncStorage.setItem('profile_status', data.result.profile_image.toString());
        await AsyncStorage.setItem('hospital_id', data.result.hospital_id.toString());

        global.id = await data.result.id.toString();
        global.doctor_name = await data.result.doctor_name.toString();
        global.phone_number = await data.result.phone_number.toString();
        global.phone_with_code = await data.result.phone_with_code.toString();
        global.email = await data.result.email.toString();
        global.document_update_status = await data.result.document_update_status.toString();
        global.document_approved_status = await data.result.document_approved_status.toString();
        props.updateProfilePicture(data.result.profile_image.toString());
        global.hospital_id = await data.result.hospital_id.toString();
        
        await navigate();
      }catch (e) {
        alert(e);
    }
  }

  const navigate = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

  return( 
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      <Loader visible={loading} />
       <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'100%' , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold }}>Register</Text>
        <View style={{ margin:10 }}/>
        <View>
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Doctor Name"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => setDoctorName(text)}
            />
          </View>
          <View style={{ margin:10 }}/>
            <View
              style={styles.phoneFieldcontainer}>
              <TextInput
                style={styles.textField}
                placeholder="Email"
                placeholderTextColor={colors.grey}
                underlineColorAndroid="transparent"
                onChangeText={text => setEmail(text)}
              />
          </View>
          <View style={{ margin:10 }}/>
          <View
              style={styles.phoneFieldcontainer}>
              <TextInput
                style={styles.textField}
                placeholder="Qualification"
                placeholderTextColor={colors.grey}
                underlineColorAndroid="transparent"
                onChangeText={text => setQualification(text)}
              />
          </View>
          <View style={{ margin:10 }}/>
          <View
              style={styles.phoneFieldcontainer}>
              <TextInput
                style={styles.textField}
                placeholder="Additional Qualification"
                placeholderTextColor={colors.grey}
                underlineColorAndroid="transparent"
                onChangeText={text => setAddQualification(text)}
              />
          </View>
          <View style={{ margin:10 }}/>
          <View
            style={styles.phoneFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Password"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={{ margin:10 }}/>
          <View style={{marginTop:"10%"}} />
          <TouchableOpacity  onPress={check_validation}  style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
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
    color:colors.theme_fg_two
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
  phoneFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  }
});

function mapStateToProps(state){
  return{
    profile_picture : state.current_location.profile_picture,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Register);
