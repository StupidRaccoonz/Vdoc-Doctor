import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView , TextInput, Keyboard } from 'react-native';
import { api_url, bold, doctor_bank_details, doctor_add_bank_details } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import axios from 'axios';
import Loader from '../components/Loader'; 
import { useNavigation } from '@react-navigation/native';

const AddBankDetails = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false); 
    const [validation,setValidation] = useState(false); 
    
    const [bank_name, setBankName] = useState('');
    const [account_no, setAccountNo] = useState('');
    const [beneficiary_name, setBeneficiaryName] = useState('');
    const [swift_code, setSwiftCode] = useState('');

    const handleBackButtonClick= () => {
        navigation.goBack(null);
    }

    useEffect( () => {
        const unsubscribe = navigation.addListener('focus', async () => {
            get_bank_details();
        });
        return unsubscribe;
    },[]); 
    
      const get_bank_details = async() => {
        setLoading(true);
        await axios({
          method: 'post', 
          url: api_url + doctor_bank_details,
          data:{ doctor_id:global.id }
        })
        .then(async response => {
          setLoading(false);
          if(response.data.status == 1){
            setBankName(response.data.result.bank_name);
            setAccountNo(response.data.result.bank_account_number);
            setBeneficiaryName(response.data.result.beneficiary_name);
            setSwiftCode(response.data.result.swift_code);
          }else{
            alert(response.data.message);
          }
          
        })
        .catch(error => {
          setLoading(false);
          alert('Sorry something went wrong');
        });
      }

    const check_validation = async() =>{
        if(beneficiary_name == "" || bank_name == "" || account_no == "" || swift_code == ""){
            alert('Please fill the details.')
            setValidation(false);
        }else{
            setValidation(true);
            add_bank_details();
        }
      }
    
    const add_bank_details = async() => {
        Keyboard.dismiss();
        setLoading(true);
        await axios({
          method: 'post', 
          url: api_url + doctor_add_bank_details,
          data:{ doctor_id:global.id, beneficiary_name:beneficiary_name , bank_name:bank_name, bank_account_number:account_no, swift_code:swift_code }
        })
        .then(async response => {
          setLoading(false);
          alert('Added Succesfully');
        })
        .catch(error => {
          setLoading(false);
          alert('Sorry something went wrong');
        });
    }

    return( 
        <SafeAreaView style={styles.container}>
            <Loader visible={loading}/>
            <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false} > 
                <View style={{ alignItems:'flex-start', justifyContent:'center',}}>
                    <View
                        style={styles.textFieldcontainer}>
                        <Icon type={Icons.FontAwesome} name="user" style={{ fontSize:18, color:colors.theme_fg }} />  
                        <View style={{ margin:5 }} />
                        <TextInput
                        style={styles.textField}
                        placeholder="Enter Beneficiary Name"
                        placeholderTextColor={colors.grey}
                        underlineColorAndroid="transparent"
                        onChangeText={text => setBeneficiaryName(text)}
                        value={beneficiary_name}
                        />
                    </View>
                </View>
                <View style={{ margin:10 }}/>
                <View style={{ alignItems:'center', justifyContent:'center',}}>
                    <View
                        style={styles.textFieldcontainer}>
                        <Icon type={Icons.FontAwesome} name="bank" style={{ fontSize:18, color:colors.theme_fg }} />  
                        <View style={{ margin:5 }} />
                        <TextInput
                            style={styles.textField}
                            placeholder="Enter Bank Name"
                            placeholderTextColor={colors.grey}
                            underlineColorAndroid="transparent"
                            onChangeText={text => setBankName(text)}
                            value={bank_name}
                        />
                    </View>
                </View>
                <View style={{ margin:10 }}/>
                <View style={{ alignItems:'center', justifyContent:'center',}}>
                    <View
                        style={styles.textFieldcontainer}>
                        <Icon type={Icons.FontAwesome} name="money" style={{ fontSize:18, color:colors.theme_fg }} />  
                        <View style={{ margin:5 }} />
                        <TextInput
                            style={styles.textField}
                            keyboardType='phone-pad'
                            placeholder="Enter Account Number"
                            placeholderTextColor={colors.grey}
                            underlineColorAndroid="transparent"
                            onChangeText={text => setAccountNo(text)}
                            value={account_no}
                        />
                    </View>
                </View>
                <View style={{ margin:10 }}/>
                <View style={{ alignItems:'center', justifyContent:'center',}}>
                    <View
                        style={styles.textFieldcontainer}>
                        <Icon type={Icons.FontAwesome} name="keyboard-o" style={{ fontSize:20, color:colors.theme_fg }} />  
                        <View style={{ margin:5 }} />
                        <TextInput
                            style={styles.textField}
                            placeholder="Enter Shift Code"
                            placeholderTextColor={colors.grey}
                            underlineColorAndroid="transparent"
                            onChangeText={text => setSwiftCode(text)}
                            value={swift_code}
                        />
                    </View>
                </View>
            <View style={{ alignItems:'center', justifyContent:'center',}}>
            </View>
            <View style={{marginTop:50, alignItems:'center', height:50, justifyContent:'center'}}>
            <TouchableOpacity onPress={check_validation.bind(this)} style={styles.button}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
         
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:colors.theme_fg_three,
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
      backgroundColor:colors.light_blue,
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
  });

  export default AddBankDetails;