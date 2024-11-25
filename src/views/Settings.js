import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import { bold } from '../config/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () =>{
  const navigation = useNavigation();
  const [profile_status, setProfileStatus] = useState(0);
  const [document_update_status, setDocumentUpdateStatus] = useState(0); 

  const profile = () => {
    navigation.navigate("Profile")
  }

  const document_upload = () => {
    navigation.navigate("Documents")
  }

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await check_settings();
    });
    return unsubscribe;
  },[]); 

  const check_settings = async() =>{
   let profile_status = await AsyncStorage.getItem('profile_status');
   let document_update_status = await AsyncStorage.getItem('document_update_status');

   if(profile_status == 1 && document_update_status == 1){
      navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Home' },
          ],
        })
      );
    }
  }

  return(
  	<SafeAreaView style={styles.container}>
      <ScrollView style={{ padding:10 }} showsVerticalScrollIndicator={false}>
          <View style={{ margin:50 }}/>
          <TouchableOpacity onPress={profile}  style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Add your Profile</Text>
          </TouchableOpacity>
          <View style={{ margin:10 }}/>
          <TouchableOpacity onPress={document_upload}  style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Add your Documents</Text>
          </TouchableOpacity>
          <View style={{ margin:10 }}/>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding:10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
  },
});

export default Settings;