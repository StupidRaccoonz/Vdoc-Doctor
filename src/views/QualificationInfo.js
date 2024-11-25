import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, api_url, doctor_category_list, doctor_qualification_update, doctor_get_profile, doctor_language } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const ProfileSettings = () => {
  const navigation = useNavigation();
  const [category_list, setCategoryList] = useState([]);
  const [specialist, setSpecialist] = useState("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(''); 
  const [Qualification, setQualification] = useState(''); 
  const [experience, setExperience] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [sub_specialist, setSubSpecialist] = useState(""); 
  const [selected_languages, setSelectedLanguages] = useState([]);
  const [language_spoken, setLanguageSpoken] = useState(undefined); 
  const [show_languages, setShowLanguages] = useState([]);
  const [language_ids, setLanguageIds] = useState([]);  

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_profile();
      await get_category_list();
      await get_doctor_language();
    });
    return unsubscribe;
  },[]); 

  const handleBackButtonClick= () => {
      navigation.goBack()
  }

  const get_category_list = async () => {
    await setLoading(false);
    await axios({
      method: "get",
      url: api_url + doctor_category_list
    })
    .then(async (response) => {
      await setLoading(false);
      await setCategoryList(response.data.result);
    })
    .catch(async(error) => {
      await setLoading(false);
      alert('Sorry, something went wrong!')
    });
  }

  const get_doctor_language = async () => {
    setLoading(false);
    await axios({
      method: "get",
      url: api_url + doctor_language
    })
    .then(async (response) => {
      setLoading(false);
      assign_data(response.data.result);
    })
    .catch(async(error) => {
      setLoading(false);
      alert('Sorry, something went wrong!')
    });
  }

  const assign_data = async (data) => {
    let language_spoken = [{
      name: 'Select Languages',
      id: 0,
      children: data
    }];

    setLanguageSpoken(language_spoken);
  }

  const onSelectedLanguageSpoken = (selected_languages) =>{
    setSelectedLanguages(selected_languages);
  }

  const select_category = (value) =>{
    setSpecialist(value)
  }

  const select_gender = (value) =>{
    setGender(value)
  }

  let show_category_list = category_list.map( (s, i) => {
   return <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} key={i} value={s.id} label={s.category_name} />
  });

  let show_gender = category_list.map( (s, i) => {
   return <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} key={i} value={s.id} label={s.category_name} />
  });

  const check_validation = async() =>{
    if(gender == null || sub_specialist == null){
      alert('Please fill your required details.')
    }else if(!selected_languages.toString()){
      alert('Please select atlease one language')
    }else{
      qualification_update();
    }
  }

  const qualification_update = async() =>{
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + doctor_qualification_update,
      data:{id:global.id, specialist:specialist, experience:experience, gender:gender, description:description, sub_specialist:sub_specialist, languages: selected_languages.toString() }
    })
    .then(async (response) => {
      setLoading(false);
      if(response.data.status == 1){
        alert('Qualification update is success')
        save_data();
      }
    })
    .catch(async(error) => {
      await setLoading(false);
      console.log({id:global.id, specialist:specialist, experience:experience, gender:gender, description:description, sub_specialist:sub_specialist, languages: selected_languages.toString() })
      alert('Sorry, something went wrong!')
    });
  }

  const save_data = async() =>{
    try {
      await AsyncStorage.setItem('profile_status', '1');
      
      global.profile_status = await '1'.toString();
      handleBackButtonClick();
      } catch (e) {
        console.log(e);
      }
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
      setGender(response.data.result.gender);
      setSpecialist(response.data.result.specialist);
      setQualification(response.data.result.qualification);
      setExperience(response.data.result.experience);
      setDescription(response.data.result.description);
      setShowLanguages(response.data.result.languages);
      setSubSpecialist(response.data.result.sub_specialist); 
      setSelectedLanguages(response.data.result.language_ids);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry, something went wrong!')
    });
  }

return( 
  <SafeAreaView style={styles.container}>
  <Loader visible={loading}/>
    <ScrollView showsVerticalScrollIndicator={false} >
      <View style={{ margin:10 }}/>
      <View style={{ padding:20 }}>
        <View style={{width:'100%', flexDirection:'row'}}>
          <View style={{width:'30%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>Specialist</Text>  
          </View>
          <View style={{width:'5%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>:</Text>  
          </View>
          <TouchableOpacity onPress={select_category} style={{width:'65%', alignItems:'flex-start', justifyContent:'center'}}>
            <View style={{width:'100%', borderWidth:1, borderRadius:10, borderColor:colors.theme_fg, backgroundColor:colors.theme_fg, padding:15, alignItems:'center', justifyContent:'center', flexDirection:'row' }}>
              <View style={{width:'90%', alignItems:'center', justifyContent:'center'}}>
                <Picker
                  selectedValue={specialist}
                  style={{ height:30, width:'130%', color:colors.theme_fg_three, alignSelf:'center', marginLeft:20, marginBottom:-8}}
                  dropdownIconColor={colors.theme_fg}
                  onValueChange={(itemValue, itemIndex) => select_category(itemValue)}
                >
                {show_category_list}
                </Picker>
              </View>
              <TouchableOpacity onPress={select_category} style={{width:'10%', alignItems:'flex-end', justifyContent:'center'}}>
                <Icon type={Icons.Entypo} name="chevron-down" style={{ fontSize:18, color:colors.theme_fg_three }} />  
              </TouchableOpacity>  
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ padding:20 }}>
        <View style={{width:'100%', flexDirection:'row'}}>
          <View style={{width:'30%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>Gender</Text>  
          </View>
          <View style={{width:'5%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>:</Text>  
          </View>
          <TouchableOpacity style={{width:'65%', alignItems:'flex-start', justifyContent:'center'}}>
            <View style={{width:'100%', borderWidth:1, borderRadius:10, borderColor:colors.theme_fg, backgroundColor:colors.theme_fg, padding:15, alignItems:'center', justifyContent:'center', flexDirection:'row' }}>
              <View style={{width:'90%', alignItems:'center', justifyContent:'center'}}>
                <Picker
                   selectedValue={parseInt(gender)}
                  style={{ height:30, width:'130%', color:colors.theme_fg_three, alignSelf:'center', marginLeft:20, marginBottom:-8}}
                  dropdownIconColor={colors.theme_fg}
                  onValueChange={(itemValue, itemIndex) => select_gender(itemValue)}
                >
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={0} label="Select Gender" />
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={1} label="Male" />
                <Picker.Item style={{ fontSize:12, color:colors.theme_fg, fontFamily:regular }} value={2} label="Female" />
                </Picker>
              </View>
              <View style={{width:'10%', alignItems:'flex-end', justifyContent:'center'}}>
                <Icon type={Icons.Entypo} name="chevron-down" style={{ fontSize:18, color:colors.theme_fg_three }} />  
              </View>  
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ padding:20 }}>
        <View style={{ margin:5}}/>
        <SectionedMultiSelect
          items={language_spoken}
          IconRenderer={Icon}
          uniqueKey="id"
          subKey="children"
          selectText="Choos your languages..."
          alwaysShowSelectText={true}
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={onSelectedLanguageSpoken}
          selectedItems={selected_languages}
          confirmText="Done"
          searchPlaceholderText="Search"
          expandDropDowns={true}
          selectedIconComponent={<Icon size={30} name="ios-checkmark-circle-outline" style={{ color: 'green', left:-20 }}/>}
          styles={{
            selectToggle: {
              color: colors.theme_fg,
            },
            selectToggleText: {
              color: colors.theme_fg,
            },
            chipText:{
              color: colors.theme_fg,
            },
            button:{
              backgroundColor: colors.theme_fg,
            },
            confirmText:{
              color: colors.theme_bg_three,
            },
          }}
        />
      </View>
      {show_languages.length != 0 &&
        <View style={{ padding:20 }}>
          <View style={{width:'100%', flexDirection:'row'}}>
            <View style={{width:'30%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>Selected Language</Text>  
            </View>
            <View style={{width:'5%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16}}>:</Text>  
            </View>
            <TouchableOpacity style={{width:'65%', alignItems:'flex-start', justifyContent:'center'}}>
              <View style={{width:'100%', borderWidth:1, borderRadius:10, borderColor:colors.theme_fg, backgroundColor:colors.theme_fg, padding:15, alignItems:'center', justifyContent:'center', flexDirection:'row' }}>
              <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true} >
              {show_languages.map((item) => {
                  return (
                    <TouchableOpacity>
                      <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:regular }}>{item.language}, </Text>
                    </TouchableOpacity>
                  );
                })}     
            </ScrollView>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      }
      <View style={{ padding:20 }}>
        <View
          style={styles.textFieldcontainer}>
          <Icon type={Icons.FontAwesome5} name="user-graduate" style={{ fontSize:18, color:colors.theme_fg }} />  
          <View style={{ margin:5 }} />
          <TextInput
            style={styles.textField}
            placeholder="Qualification"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setQualification(text)}
            value={Qualification}
          />
        </View>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <Icon type={Icons.FontAwesome5} name="user-graduate" style={{ fontSize:18, color:colors.theme_fg }} />  
          <View style={{ margin:5 }} />
          <TextInput
            style={styles.textField}
            placeholder="Add Speciality"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setSubSpecialist(text)}
            value={sub_specialist}
          />
        </View>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <Icon type={Icons.FontAwesome5} name="medkit" style={{ fontSize:18, color:colors.theme_fg }} />  
          <View style={{ margin:5 }} />
          <TextInput
            style={styles.textField}
            placeholder="Your Experience"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setExperience(text)}
            value={experience}
          />
        </View>
        <View style={{ margin:10 }}/>    
        <TextInput
          style={styles.input}
          multiline={true}
          placeholderTextColor={colors.grey}
          placeholder="Enter your comment"
          underlineColorAndroid='transparent'
          onChangeText={text => setDescription(text)}
          value={description}
        />
      </View>
    </ScrollView>
    <View style={{  alignItems:'center', height:50, justifyContent:'center'}}>
      <TouchableOpacity onPress={check_validation} style={styles.button}>
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
  input: {
    width:'100%',
    height:100,
    borderColor:colors.theme_bg,
    borderWidth:1,
    backgroundColor:colors.light_blue,
    borderRadius:10,
    padding:10
  },
  preferences_style6: { width:'80%', marginLeft:'10%' },
});

export default ProfileSettings;
