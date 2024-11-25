import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Alert, ScrollView, TouchableOpacity, TextInput, Image} from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, api_url, doctor_get_profile, doctor_profile_picture, doctor_profile_picture_update, img_url, doctor_profile_update } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-input';
import axios from 'axios';
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImgToBase64 from 'react-native-image-base64';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux'; 
import { updateProfilePicture } from '../actions/CurrentAddressActions';

const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  base64: true,
  quality:1, 
  maxWidth: 500, 
  maxHeight: 500,
};

const ProfileInfo = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const [doctor_name, setDoctorName] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [profile_image,setProfileImage] = useState("");
  const [img_data,setImgData] = useState(""); 
  const [profile_timer,setProfileTimer] = useState(true); 
  const [password,setPassword] = useState(''); 

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_profile();
    });
    return unsubscribe;
  },[]);

  const handleBackButtonClick= () => {
      navigation.goBack()
  }

  const get_profile = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_get_profile,
      data:{ doctor_id:global.id }
    })
    .then(async response => {
      setLoading(false);
      setDoctorName(response.data.result.doctor_name);
      setPhone_number(response.data.result.phone_number);
      setEmail(response.data.result.email);
      props.updateProfilePicture(response.data.result.profile_image);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const select_photo = async () => {
    if(profile_timer){
      ImagePicker.launchImageLibrary(options, async(response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const source =  await response.assets[0].uri;
            await setImgData(response.data)
            await ImgToBase64.getBase64String(response.assets[0].uri)
          .then(async base64String => {
            await profileimageupdate(base64String);
            await setProfileImage(response.assets[0].uri);
          }).catch(err => console.log(err));
        }
      });
    }else{
      alert('Please try after 20 seconds');
    }
  }

  const profileimageupdate = async(data_img) =>{
    await setLoading(true);
    RNFetchBlob.fetch('POST', api_url + doctor_profile_picture, {
      'Content-Type' : 'multipart/form-data',
    }, [
      {  
        name : 'image',
        filename : 'image.png', 
        data: data_img
      }
    ]).then(async (resp) => { 
      await setLoading(false);
      let data = await JSON.parse(resp.data);
      if(data.result){
        await profile_image_update(data.result);
      }
    }).catch((err) => {
        setLoading(false);
        console.log(err);
        alert('Error on while upload try again later.')
    })
  }

  const profile_image_update = async (data) => {
    setLoading(true);
      await axios({
        method: 'post', 
        url: api_url+doctor_profile_picture_update,
        data: {id:global.id, profile_image:data}
      })
      .then(async response => {
        setLoading(false);
        if(response.data.status == 1){
          alert("Update Successfully")
          saveProfilePicture(data);
          setProfileTimer(false);
          setTimeout(function(){setProfileTimer(true)}, 20000)
        }else{
          alert(response.data.message)
        }
      })
      .catch(error => {
          setLoading(false);
          alert("Sorry something went wrong")
      });
  }

  const saveProfilePicture = async(data) =>{
    try{
        await AsyncStorage.setItem('profile_picture', data.toString());
        get_profile();
        props.updateProfilePicture(data.toString());
        console.log(img_url+global.profile_picture)
      }catch (e) {
        alert(e);
    }
  }

  const checkValidate = () =>{
    if(doctor_name == "" || email == "" ){
      setValidation(false);
      alert("Please fill all the fields.");
    }else{
      setValidation(true);
      save_profile();
    }
  }

  const save_profile = async() =>{
    console.log({ id:global.id, doctor_name:doctor_name, email:email, phone_number:global.phone_number, password:password })
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_profile_update,
      data:{ id:global.id, doctor_name:doctor_name, email:email, phone_number:global.phone_number, password:password }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        alert('Profile updated Successfully.')
        saveData();
        handleBackButtonClick();
      }

    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const saveData = async (data) => {
    if (data.status == 1) {
      try {
        await AsyncStorage.setItem("id", data.result.id.toString());
        await AsyncStorage.setItem("doctor_name", data.result.doctor_name.toString());
        await AsyncStorage.setItem("email", data.result.email.toString());
        await AsyncStorage.setItem("phone_number", data.result.phone_number.toString());
        await AsyncStorage.setItem("phone_with_code", data.result.phone_with_code.toString());
        await AsyncStorage.setItem("profile_picture", data.result.profile_image.toString());
        global.id = await data.result.id;
        global.doctor_name = await data.result.doctor_name;
        global.email = await data.result.email;
        global.phone_number = await data.result.phone_number;
        global.phone_with_code = await data.result.phone_with_code;
        props.updateProfilePicture(data.result.profile_image.toString());
        await alert("Profile updated Successfully");
      } catch (e) {}
    } else {
      alert(data.message);
    }
  };

  const reset_password = () =>{
    Alert.alert(
      'Reset Password',
      'Need to change password.',
      [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('CreatePassword', {from:'profile', id:global.id})
        }
      ],
      { cancelable: false }
    );
  }

  return( 
    <SafeAreaView style={styles.container}>
    <Loader visible={loading}/>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <View style={{ margin:10 }}/>
        <TouchableOpacity onPress={select_photo} style={styles.box}>
          <View style={styles.profile} >
            <Image style= {{ height: undefined,width: undefined, flex:1, borderRadius:60 }} source={{ uri: img_url+props.profile_picture}} />
          </View>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <View style={{ padding:20 }}>
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Name"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => setDoctorName(text)}
              value={doctor_name}
            />
          </View>
          <View style={{ margin:10 }}/>
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Email"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => setEmail(text)}
              value={email}
            />
          </View>
          <View style={{ margin:10 }}/>
          <View
            style={styles.textFieldcontainer}>
            <PhoneInput style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style} initialValue={global.phone_with_code} disabled={true} initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "", placeholderTextColor : colors.grey }} autoFormat={true} />
          </View>
          <View style={{ margin:10 }}/>
          <View style={{ alignItems:'center', justifyContent:'center',}}>
            <TouchableOpacity onPress={reset_password} style={{ width:'100%', borderWidth:1, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_bg_three, padding:10, height:45, borderRadius:10, flexDirection:'row' }}>
              <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular }}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={{ left:0, right:0, bottom:0, alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
        <TouchableOpacity onPress={checkValidate}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color:colors.theme_fg_two,
    fontSize:14
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
  password_button: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    borderWidth:1,
    height:45
  },
  box:{
    alignItems:'center',
    justifyContent:'center'
  },
  profile:{
    width: 100,
    height: 100,
    borderRadius: 60,
    borderColor:colors.theme_bg,
    borderWidth:1,
    backgroundColor:colors.theme_bg
  },
   header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'flex-start',
    flexDirection:'row',
    shadowColor: '#ccc',
    padding:10,
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:13
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

export default connect(mapStateToProps,mapDispatchToProps)(ProfileInfo);
