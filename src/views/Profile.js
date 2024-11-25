import React, { useState, useEffect } from 'react';
import {  Text, StyleSheet, SafeAreaView, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { bold, regular, height_20, doctor_get_profile, api_url, img_url } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import Loader from '../components/Loader';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import Icon, { Icons } from '../components/Icons';
import { connect } from 'react-redux'; 
import { updateProfilePicture } from '../actions/CurrentAddressActions';

const Profile = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [profile_result, setProfileResult] = useState('');
  const [doctor_name, setDoctorName] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('');
  const [sub_specialist, setSubSpecialist] = useState(""); 
  const [additional_qualification, setAddQualification] = useState(""); 
  const [unique_code, setUniqueCode] = useState(""); 

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_profile();
    });
    return unsubscribe;
  },[]); 

  const get_profile = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + doctor_get_profile,
      data:{ doctor_id:global.id }
    })
    .then(async response => {
      setLoading(false);
      setProfileResult(response.data.result);
      setDoctorName(response.data.result.doctor_name);
      setPhone_number(response.data.result.phone_number);
      setEmail(response.data.result.email);
      setGender(response.data.result.gender);
      setSpecialist(response.data.result.specialist_name);
      setQualification(response.data.result.qualification);
      setExperience(response.data.result.experience);
      setSubSpecialist(response.data.result.sub_specialist); 
      setAddQualification(response.data.result.additional_qualification); 
      setUniqueCode(response.data.result.unique_code);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const profile_edit = () =>{
    navigation.navigate('ProfileInfo')
  }

  const qualification_edit = () =>{
    navigation.navigate('QualificationInfo')
  }

    return(
        <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Loader visible={loading}/>
          <View style={{height:height_20, backgroundColor:colors.theme_bg}}>
            <View style={{padding:10,marginTop:10}}>
              <CardView
                cardElevation={5}
                style={{ width:'98%', paddingLeft:10, paddingRight:10, marginLeft:15, marginRight:5, backgroundColor:colors.theme_bg_three, borderColor: colors.light_grey, position:'absolute', top:80, borderWidth:1}}
                cardMaxElevation={5}
                cornerRadius={10}>
                <View style={{ margin:20 }}/>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:20, color:colors.theme_fg_two,fontFamily:bold, textAlign:'center'}}>{doctor_name}</Text>
                </View>
                <View style={{ margin:2 }}/>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:14, color:colors.theme_fg_two,fontFamily:regular, textAlign:'center'}}>{email}</Text>
                </View>
                <View style={{ margin:2 }}/>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:14, color:colors.theme_fg_two,fontFamily:regular, textAlign:'center'}}>Your Unique Code - {unique_code}</Text>
                </View> 
                <View style={{ margin:10 }}/>
              </CardView>
            </View>
          </View>
          <View style={{ margin:45 }}/>
            <View style={{padding:10}}>
              <CardView
                cardElevation={5}
                style={{ paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5, backgroundColor:colors.theme_bg_three, borderColor: colors.light_grey, borderWidth:1}}
                cardMaxElevation={5}
                cornerRadius={10}>
                <View style={{ margin:10 }}/>
                <View style={{ flexDirection:'row', width:'100%'}}>
                  <View style={{ width:'80%'}}>
                  <Text style={{fontSize:14, fontFamily:bold}}>Profile Info</Text>
                  </View>
                  <TouchableOpacity onPress={profile_edit} style={{ width:'20%', alignItems:'flex-end'}}>
                    <Icon type={Icons.FontAwesome} name='edit' color={colors.theme_fg_two} style={{ fontSize:20 }} />
                  </TouchableOpacity>
                </View>
                <View style={{ margin:5 }}/>
                <View style={{ padding:10}}>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Doctor Name</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    <View style={{ width:'55%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>Dr.{doctor_name}</Text>
                    </View>
                  </View>
                  <View style={{ margin:5 }}/>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Phone Number</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    <View style={{ width:'50%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>{phone_number}</Text>
                    </View>
                  </View>
                  <View style={{ margin:5 }}/>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Email</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    <View style={{ width:'50%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>{email}</Text>
                    </View>
                  </View>
                  </View>
                  <View style={{ margin:5 }}/>
                </CardView>
              </View>
              <View style={{padding:10}}>
              <CardView
                cardElevation={5}
                style={{ paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5, backgroundColor:colors.theme_bg_three, borderColor: colors.light_grey, borderWidth:1}}
                cardMaxElevation={5}
                cornerRadius={10}>
                <View style={{ margin:10 }}/>
                <View style={{ flexDirection:'row', width:'100%'}}>
                  <View style={{ width:'80%'}}>
                  <Text style={{fontSize:14, fontFamily:bold}}>Qualification Info</Text>
                  </View>
                  <TouchableOpacity onPress={qualification_edit} style={{ width:'20%', alignItems:'flex-end'}}>
                    <Icon type={Icons.FontAwesome} name='edit' color={colors.theme_fg_two} style={{ fontSize:20 }} />
                  </TouchableOpacity>
                </View>
                <View style={{ margin:5 }}/>
                <View style={{ padding:10}}>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Specialist</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    {specialist != null &&
                      <View style={{ width:'50%', alignItems:'flex-start' }}>
                        <Text style={{ fontSize:14, fontFamily:bold }}>{specialist}</Text>
                      </View>
                    }
                    {specialist == null &&
                      <View style={{ width:'55%', alignItems:'flex-start' }}>
                        <Text style={{ fontSize:14, fontFamily:bold }}>Add specialist</Text>
                      </View>
                    }
                  </View>
                  <View style={{ margin:5 }}/>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Sub Specialist</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    {sub_specialist != null &&
                      <View style={{ width:'50%', alignItems:'flex-start' }}>
                        <Text style={{ fontSize:14, fontFamily:bold }}>{sub_specialist}</Text>
                      </View>
                    }
                    {sub_specialist == null &&
                      <View style={{ width:'55%', alignItems:'flex-start' }}>
                        <Text style={{ fontSize:14, fontFamily:bold }}>Add sub-specialist</Text>
                      </View>
                    }
                  </View>
                  <View style={{ margin:5 }}/>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Qualification</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    <View style={{ width:'50%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>{qualification}</Text>
                    </View>
                  </View>
                  <View style={{ margin:5 }}/>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Experience</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    <View style={{ width:'50%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>{experience}yrs</Text>
                    </View>
                  </View>
                  <View style={{ margin:5 }}/>  
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Gender</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    {gender == 1 &&
                      <View style={{ width:'50%', alignItems:'flex-start' }}>
                        <Text style={{ fontSize:14, fontFamily:bold }}>Male</Text>
                      </View>
                    }
                    {gender == 2 &&
                      <View style={{ width:'55%', alignItems:'flex-start' }}>
                        <Text style={{ fontSize:14, fontFamily:bold }}>Female</Text>
                      </View> 
                    }
                    {gender == null &&
                      <View style={{ width:'55%', alignItems:'flex-start' }}>
                        <Text style={{ fontSize:14, fontFamily:bold }}>Add gender</Text>
                      </View> 
                    }
                  </View> 
                  <View style={{ margin:5 }}/>
                  <View style={{ flexDirection:'row', width:'100%' }}>
                    <View style={{ width:'45%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:regular }}>Additional Qualification</Text>
                    </View>
                    <View style={{ width:'5%', alignItems:'center' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>:</Text>
                    </View>
                    <View style={{ width:'50%', alignItems:'flex-start' }}>
                      <Text style={{ fontSize:14, fontFamily:bold }}>{additional_qualification}</Text>
                    </View>
                  </View> 
                  </View>
                </CardView>
              </View>
           
          <View style={{ marging:10}}/>

          <View style={{ flexDirection:'row', padding:10, width:'100%', justifyContent:'center', alignItems:'center', position:'absolute', top:40}}>
            <View style={{ width:'20%',justifyContent:'center', alignItems:'center' }}>
              <Image style={{ height: 70, width: 70, borderRadius:50 }} source={{ uri: img_url+props.profile_picture}} />
            </View>  
          </View>
          <Loader visible={loading} />
          </ScrollView>
        </SafeAreaView>
    )
 
} 

const styles = StyleSheet.create({
  verticleLine: {
    height: '80%',
    width: 2,
    backgroundColor:colors.theme_fg_two,
    marginTop:5,
    marginRight:15,
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

export default connect(mapStateToProps,mapDispatchToProps)(Profile);