import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  bold,
  logo_with_name,
  api_url,
  doctor_app_settings,
  app_name,
  GOOGLE_KEY,
} from '../config/Constants';
import {useNavigation, CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';
import * as colors from '../assets/css/Colors';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import {connect} from 'react-redux';
import {
  updateCurrentAddress,
  updateCurrentLat,
  updateCurrentLng,
  currentTag,
  updateProfilePicture,
  updateAddress,
} from '../actions/CurrentAddressActions';

const Splash = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    app_settings();
  }, []);

  const channel_create = () => {
    PushNotification.createChannel(
      {
        channelId: 'medical_application', // (required)
        channelName: 'Booking', // (required)
        channelDescription: 'Medical Booking Solution', // (optional) default: undefined.
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  const configure = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token.token);
        global.fcm_token = token.token;
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  const app_settings = async () => {
    axios({
      method: 'get',
      url: api_url + doctor_app_settings,
    })
      .then(async response => {
        configure();
        channel_create();
        saveData(response.data.result);
        navigate_app();
        // check_location();
      })
      .catch(error => {
        alert('Sorry something went wrong');
      });
  };

  const saveData = async data => {
    const id = await AsyncStorage.getItem('id');
    const doctor_name = await AsyncStorage.getItem('doctor_name');
    const phone_number = await AsyncStorage.getItem('phone_number');
    const phone_with_code = await AsyncStorage.getItem('phone_with_code');
    const email = await AsyncStorage.getItem('email');
    const online_status = await AsyncStorage.getItem('online_status');
    const profile_status = await AsyncStorage.getItem('profile_status');
    const document_update_status = await AsyncStorage.getItem(
      'document_update_status',
    );
    const document_approved_status = await AsyncStorage.getItem(
      'document_approved_status',
    );
    const hospital_id = await AsyncStorage.getItem('hospital_id');
    const profile_picture = await AsyncStorage.getItem('profile_picture');

    global.app_name = data.app_name;
    global.currency = data.default_currency;
    global.user_type = data.user_type;
    global.admin_contact_number = data.contact_number;
    global.delivery_charge = data.delivery_charge;
    global.mode = data.mode;
    global.profile_status = profile_status;
    global.document_update_status = document_update_status;
    global.document_approved_status = document_approved_status;
    global.hospital_id = hospital_id;
    props.updateProfilePicture(profile_picture);

    if (id !== null) {
      global.id = id;
      global.doctor_name = doctor_name;
      global.phone_number = phone_number;
      global.phone_with_code = phone_with_code;
      global.email = email;
      global.online_status = online_status;
      await props.updateProfilePicture(profile_picture);
      global.hospital_id = hospital_id;
      check_location();
    } else {
      global.id = 0;
      check_location();
    }
  };

  const check_location = async () => {
    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(async data => {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message:
                  app_name +
                  ' needs to Access your location for show nearest restaurant',
              },
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              await getInitialLocation();
            } else {
              alert('Sorry unable to fetch your location');
            }
          } catch (err) {
            navigation.navigate('LocationEnable');
          }
        })
        .catch(err => {
          navigation.navigate('LocationEnable');
        });
    } else {
      await getInitialLocation();
    }
  };

  const getInitialLocation = async () => {
    await Geolocation.getCurrentPosition(
      async position => {
        onRegionChange(position.coords);
      },
      error => navigation.navigate('LocationEnable'),
      {enableHighAccuracy: false, timeout: 10000},
    );
  };

  const onRegionChange = async value => {
    //props.addCurrentAddress('Please wait...')
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        value.latitude +
        ',' +
        value.longitude +
        '&key=' +
        GOOGLE_KEY,
    )
      .then(response => response.json())
      .then(async responseJson => {
        if (responseJson.results[0].formatted_address != undefined) {
          let address = await responseJson.results[0].formatted_address;
          await props.updateCurrentAddress(address);
          await props.updateCurrentLat(value.latitude);
          await props.updateCurrentLng(value.longitude);
          await props.currentTag('Live');

          navigate_app();
        } else {
          alert('Sorry something went wrong');
        }
      });
  };

  const navigate_app = async () => {
    if (global.id) {
      console.log('test');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'LoginHome'}],
        }),
      );
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.logo_container}>
        <Image style={styles.logo} source={logo_with_name} />
      </View>
      <Text style={styles.spl_text}>Doctor Application</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_fg_three,
  },
  logo_container: {
    height: 190,
    width: 190,
  },
  logo: {
    height: undefined,
    width: undefined,
    flex: 1,
  },
  spl_text: {
    fontFamily: bold,
    fontSize: 20,
    color: colors.theme_fg,
    letterSpacing: 2,
  },
});

function mapStateToProps(state) {
  return {
    current_address: state.current_location.current_address,
    current_lat: state.current_location.current_lat,
    current_lng: state.current_location.current_lng,
    current_tag: state.current_location.current_tag,
    profile_picture: state.current_location.profile_picture,
    address: state.current_location.address,
  };
}

const mapDispatchToProps = dispatch => ({
  updateCurrentAddress: data => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: data => dispatch(updateCurrentLat(data)),
  updateCurrentLng: data => dispatch(updateCurrentLng(data)),
  currentTag: data => dispatch(currentTag(data)),
  updateTaxList: data => dispatch(updateTaxList(data)),
  updateProfilePicture: data => dispatch(updateProfilePicture(data)),
  updateAddress: data => dispatch(updateAddress(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
