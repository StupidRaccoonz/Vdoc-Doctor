import React, {useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon, {Icons} from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import * as Animatable from 'react-native-animatable';

/* Screens */
import Splash from './src/views/Splash';
import Dashboard from './src/views/Dashboard';
import LoginHome from './src/views/LoginHome';
import Faq from './src/views/Faq';
import FaqCategories from './src/views/FaqCategories';
import FaqDetails from './src/views/FaqDetails';
import Otp from './src/views/Otp';
import CheckPhone from './src/views/CheckPhone';
import CreatePassword from './src/views/CreatePassword';
import Password from './src/views/Password';
import TermsAndConditions from './src/views/TermsAndConditions';
import More from './src/views/More';
import MyBookings from './src/views/MyBookings';
import Earnings from './src/views/Earnings';
import Register from './src/views/Register';
import Settings from './src/views/Settings';
import VideoCall from './src/views/VideoCall';
import Wallet from './src/views/Wallet';
import DocumentUpload from './src/views/DocumentUpload';
import Withdrawal from './src/views/Withdrawal';
import MyBookingDetails from './src/views/MyBookingDetails';
import BookingRequest from './src/views/BookingRequest';
import AppointmentSettings from './src/views/AppointmentSettings';
import Profile from './src/views/Profile';
import AddClinicAddress from './src/views/AddClinicAddress';
import ProfileInfo from './src/views/ProfileInfo';
import QualificationInfo from './src/views/QualificationInfo';
import Documents from './src/views/Documents';
import PrivacyPolicies from './src/views/PrivacyPolicies';
import AddBankDetails from './src/views/AddBankDetails';
import ViewPrescription from './src/views/ViewPrescription';
import WritePrescription from './src/views/WritePrescription';
import Notifications from './src/views/Notifications';
import NotificationDetails from './src/views/NotificationDetails';
import Blog from './src/views/Blog';
import BlogDetails from './src/views/BlogDetails';
import MyConsultations from './src/views/MyConsultations';
import PatientHistories from './src/views/PatientHistories';
import CreateAppointment from './src/views/CreateAppointment';
import CustomerChat from './src/views/CustomerChat';

const forFade = ({current, next}) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0,
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: {opacity},
    rightButtonStyle: {opacity},
    titleStyle: {opacity},
    backgroundStyle: {opacity},
  };
};
const TabArr = [
  {
    route: 'Dashboard',
    label: 'Home',
    type: Icons.Feather,
    icon: 'home',
    component: Dashboard,
    color: colors.theme_fg,
    alphaClr: colors.theme_bg_three,
  },
  {
    route: 'MyBookings',
    label: 'MyBookings',
    type: Icons.Feather,
    icon: 'calendar',
    component: MyBookings,
    color: colors.theme_fg,
    alphaClr: colors.theme_bg_three,
  },
  {
    route: 'MyConsultations',
    label: 'Consultations',
    type: Icons.Feather,
    icon: 'list',
    component: MyConsultations,
    color: colors.theme_fg,
    alphaClr: colors.theme_bg_three,
  },
  {
    route: 'More',
    label: 'More',
    type: Icons.FontAwesome,
    icon: 'user-circle-o',
    component: More,
    color: colors.theme_fg,
    alphaClr: colors.theme_bg_three,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = props => {
  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
      viewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
      textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
    } else {
      viewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
      textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.65}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[
            StyleSheet.absoluteFillObject,
            {backgroundColor: item.color, borderRadius: 16},
          ]}
        />
        <View
          style={[
            styles.btn,
            {backgroundColor: focused ? null : item.alphaClr},
          ]}>
          <Icon
            type={item.type}
            name={item.icon}
            color={focused ? colors.theme_fg_three : colors.grey}
          />
          <Animatable.View ref={textViewRef}>
            {focused && (
              <Text
                style={{
                  color: colors.theme_fg_three,
                  paddingHorizontal: 8,
                }}>
                {item.label}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16,
        },
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" options={{headerShown: false}}>
        <Stack.Screen
          name="FaqDetails"
          component={FaqDetails}
          options={{title: 'Faq Details'}}
        />
        <Stack.Screen
          name="FaqCategories"
          component={FaqCategories}
          options={{title: 'Faq Categories'}}
        />
        <Stack.Screen name="Faq" component={Faq} options={{title: 'Faq'}} />
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginHome"
          component={LoginHome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Otp"
          component={Otp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CheckPhone"
          component={CheckPhone}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreatePassword"
          component={CreatePassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Password"
          component={Password}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{title: 'Terms and Conditions'}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{title: 'Settings'}}
        />
        <Stack.Screen
          name="VideoCall"
          component={VideoCall}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{title: 'Wallet'}}
        />
        <Stack.Screen
          name="DocumentUpload"
          component={DocumentUpload}
          options={{title: 'Document Upload'}}
        />
        <Stack.Screen
          name="Withdrawal"
          component={Withdrawal}
          options={{title: 'Withdrawal'}}
        />
        <Stack.Screen
          name="MyBookingDetails"
          component={MyBookingDetails}
          options={{title: 'Booking Details'}}
        />
        <Stack.Screen
          name="BookingRequest"
          component={BookingRequest}
          options={{title: 'Booking Request'}}
        />
        <Stack.Screen
          name="AppointmentSettings"
          component={AppointmentSettings}
          options={{title: 'Appointment Settings'}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{title: 'Profile'}}
        />
        <Stack.Screen
          name="AddClinicAddress"
          component={AddClinicAddress}
          options={{title: 'Clinic Address'}}
        />
        <Stack.Screen
          name="ProfileInfo"
          component={ProfileInfo}
          options={{title: 'Profile Info'}}
        />
        <Stack.Screen
          name="QualificationInfo"
          component={QualificationInfo}
          options={{title: 'Qualification Info'}}
        />
        <Stack.Screen
          name="Documents"
          component={Documents}
          options={{title: 'Document Upload'}}
        />
        <Stack.Screen
          name="PrivacyPolicies"
          component={PrivacyPolicies}
          options={{title: 'Privacy Policies'}}
        />
        <Stack.Screen
          name="Earnings"
          component={Earnings}
          options={{title: 'Earnings'}}
        />
        <Stack.Screen
          name="AddBankDetails"
          component={AddBankDetails}
          options={{title: 'Add Bank Details'}}
        />
        <Stack.Screen
          name="ViewPrescription"
          component={ViewPrescription}
          options={{title: 'View Prescription'}}
        />
        <Stack.Screen
          name="WritePrescription"
          component={WritePrescription}
          options={{title: 'Write Prescription'}}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{title: 'Notifications'}}
        />
        <Stack.Screen
          name="NotificationDetails"
          component={NotificationDetails}
          options={{title: 'NotificationDetails'}}
        />
        <Stack.Screen
          name="BlogDetails"
          component={BlogDetails}
          options={{title: ''}}
        />
        <Stack.Screen
          name="Blog"
          component={Blog}
          options={{title: 'Your Blog'}}
        />
        <Stack.Screen
          name="PatientHistories"
          component={PatientHistories}
          options={{title: 'Patient Histories'}}
        />
        <Stack.Screen
          name="CreateAppointment"
          component={CreateAppointment}
          options={{title: 'Create Appointment'}}
        />
        <Stack.Screen
          name="CustomerChat"
          component={CustomerChat}
          options={{title: 'Doctor Chat'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
});

export default App;
