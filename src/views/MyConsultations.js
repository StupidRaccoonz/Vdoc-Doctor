import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { bold, regular, consultation_list, api_url, img_url } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Loader  from '../components/Loader';
import CardView from 'react-native-cardview';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Moment from 'moment';

const MyOnlineConsultations = () =>{
	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);
	const [consult_list, setConsultList] = useState([]);

	useEffect( () => {
		const unsubscribe = navigation.addListener('focus', async () => {
		  get_consultation_list();
		});
		return unsubscribe;
	},[]); 

	const get_consultation_list = async () => {
		setLoading(true);
	  await axios({
		method: "post",
		url: api_url + consultation_list,
		data: { doctor_id:global.id }
	  })
	  .then(async (response) => {
			setLoading(false);
			setConsultList(response.data.result);
	  })
	  .catch(async(error) => {
			setLoading(false);
		alert('Sorry, something went wrong!')
	  });
	}

	const move_prescription = (data) =>{
		if(data.slug != 'rejected'){
			navigation.navigate("ViewPrescription",{ data : data });
		}
	}
	const chat = (id) =>{
		navigation.navigate('CustomerChat',{ id : id })
	}

	const renderItem = ({ item }) => (
		<CardView
			cardElevation={5}
			cardMaxElevation={5}
			style={{ margin:5, marginLeft:10, marginRight:10 }}
			cornerRadius={10}>
			<View style={{ padding:10, flexDirection:'row', width:'100%'}}>
				<TouchableOpacity onPress={move_prescription.bind(this,item)} style={{ width:'20%',justifyContent:'center', alignItems:'center' }}>
					<Image style={{ height: 50, width: 50, borderRadius:10 }} source={{uri: img_url + item.profile_picture}} />
				</TouchableOpacity>  
				<TouchableOpacity onPress={move_prescription.bind(this,item)} style={{ width:'35%'}}>
					<Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:bold  }}>{item.customer_name} #{item.id}</Text>
					<View style={{ margin:3 }} />
					{item.status == 4 ?
					<Text style={{ fontSize:12, color:colors.success, fontFamily:bold  }}>{item.status_name}</Text>
					:
					<Text style={{ fontSize:12, color:colors.error, fontFamily:bold  }}>{item.status_name}</Text>
					}
				</TouchableOpacity>
				<TouchableOpacity onPress={chat.bind(this,item.id)} style={{ width:'25%', justifyContent:'flex-end', alignItems:'flex-end'}}>
					{item.status == 4 &&
						<View style={{ borderWidth:1, borderRadius:5, backgroundColor:colors.theme_bg, alignItems:'center', justifyContent:'center'}}>
							<Text style={{ fontSize:11, color:colors.theme_fg_three, fontFamily:bold, padding:5,  }}>Chat</Text>
						</View>
					}
				</TouchableOpacity>
				<TouchableOpacity onPress={move_prescription.bind(this,item)} style={{ width:'20%', justifyContent:'center', alignItems:'flex-end'}}>
					<View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
						<Text style={{ fontSize:13, color:colors.grey, fontFamily:bold  }}>{Moment(item.start_time).format('DD-MM-YY')}</Text>
					</View>
				<View style={{ margin:3 }} />
				<Text style={{ fontSize:12, color:colors.grey, fontFamily:regular  }}>{global.currency}{item.total}</Text>
				</TouchableOpacity>
			</View>
		</CardView>
	);

	return(
		<SafeAreaView style={styles.container}>
			<View style={{ margin:5 }} />
    		<Loader visible={loading} />
			{consult_list.length > 0 ?
			<FlatList
				data={consult_list}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>
			:
			<View style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
				<Text style={{ fontFamily:bold, color:colors.theme_fg_two, fontSize:16}}>Sorry no data found</Text>
			</View>
			}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: 'flex-start',
	  backgroundColor:colors.light_blue,
	}
  });

export default MyOnlineConsultations;