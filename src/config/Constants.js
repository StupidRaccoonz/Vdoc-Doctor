import {Dimensions} from 'react-native';

export const base_url = 'https://vdoc.cefas.in/';
export const api_url = 'https://vdoc.cefas.in/api/';
export const img_url = 'https://vdoc.cefas.in/public/uploads/';
export const chat_icon = img_url + 'chat_icons/patient.png';
export const app_name = 'Care2Home';
//Auth
export const doctor_app_settings = 'doctor_app_setting';
export const doctor_check_phone = 'doctor/check_phone';
export const doctor_login = 'doctor/login';
export const doctor_registration = 'doctor/register';
export const doctor_forget_password = 'doctor/forget_password';
export const doctor_reset_password = 'doctor/reset_password';
//Booking flow
export const doctor_online_status = 'doctor/change_online_status';
export const doctor_get_bookings = 'doctor/get_bookings';
export const doctor_dashboard = 'doctor/dashboard';
export const doctor_booking_details = 'doctor/get_booking_details';
export const doctor_accept_booking = 'doctor/accept_booking';
export const doctor_change_status = 'doctor/booking_status_change';
export const consultation_list = 'doctor/get_consultations';
export const doctor_consultation_details = 'doctor/get_consultation_details';
export const doctor_consultation_status_change =
  'doctor/consultation_status_change';
export const doctor_get_prescription = 'doctor/get_prescription';
export const add_prescription_items = 'doctor/create_prescription_items';
export const create_appointment = 'doctor/create_booking';
export const create_prescription = 'doctor/create_prescription';

//profile info
export const doctor_get_profile = 'doctor/get_profile';
export const doctor_profile_picture = 'doctor/profile_picture';
export const doctor_profile_picture_update = 'doctor/profile_picture_update';
export const doctor_profile_update = 'doctor/profile_update';
export const patient_histories = 'get_patient_histories';

//qualification info
export const doctor_category_list = 'doctor/specialist_category';
export const doctor_qualification_update = 'doctor/qualification_update';
export const doctor_language = 'doctor/get_languages';
//booking settings
export const doctor_booking_settings_update = 'doctor/booking_setting_update';
export const doctor_booking_settings = 'doctor/get_booking_settings';
//Common
export const doctor_earning = 'doctor/earning';
export const doctor_wallet_histories = 'doctor/wallet_histories';
export const doctor_get_faq = 'get_faq';
export const doctor_privacy_policy = 'get_privacy_policy';
export const doctor_withdrawal_history = 'doctor/withdrawal';
export const doctor_withdrawal_request = 'doctor/withdrawal_request';
export const customer_get_blog = 'customer/get_blog';
export const customer_notification = 'get_notifications';
//Hospital details
//export const doctor_get_clinic_details = "doctor/get_clinic_details";
//export const doctor_clinic_address = "doctor/add_clinic_address";
//export const doctor_clinic_image_upload = "doctor/clinic_image_upload";
//export const doctor_clinic_image_update = "doctor/clinic_image_update";
//export const doctor_add_clinic_details = "doctor/add_clinic_detail";

export const doctor_hospital_details = 'doctor/hospital_details';
export const doctor_bank_details = 'doctor/get_bank_details';
export const doctor_add_bank_details = 'doctor/add_bank_details';

//document upload
export const get_documents = 'doctor/document_details';
export const document_upload = 'doctor/upload';
export const document_update = 'doctor/document_upload';

//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);

//img Path
export const login_image = require('.././assets/img/login_image.png');
export const right = require('.././assets/img/right.png');
export const theme_gradient = require('.././assets/img/theme_gradient.png');
export const booking_accept_img = require('.././assets/img/time-left.png');
export const money_bag = require('.././assets/img/money-bag.png');
export const earning_img = require('.././assets/img/earning.png');
export const doc_success = require('.././assets/img/doc_success.png');
export const doc_pending = require('.././assets/img/doc_pending.png');
export const rejected_icon = require('.././assets/img/cancel.png');
export const waiting_icon = require('.././assets/img/time-left.png');
export const credit_card = require('.././assets/img/credit_card.jpeg');
export const wallet_money = require('.././assets/img/wallet_money.png');
export const id_proof_icon = require('.././assets/img/id_proof_icon.png');
export const certificate_icon = require('.././assets/img/certificate_icon.png');
export const upload_icon = require('.././assets/img/upload_icon.png');
export const withd_debit = require('.././assets/img/down.png');
export const withd_wal = require('.././assets/img/purse.png');
//temp path
export const upload_img = require('.././assets/tmp/upload.png');
export const document_img = require('.././assets/tmp/document.png');
export const video_image = require('.././assets/tmp/video_image.jpeg');
export const phone_call = require('.././assets/tmp/phone_call.png');

export const doctor = require('.././assets/img/doctor.jpg');
export const surgeon = require('.././assets/img/surgeon.jpg');
export const logo_with_name = require('.././assets/img/logo_with_name.png');
export const lab = require('.././assets/img/lab.png');
export const tablet = require('.././assets/img/tablet.png');
export const online_consult = require('.././assets/img/online_consult.png');
export const clinic = require('.././assets/img/clinic.png');
export const psychologist = require('.././assets/img/psychologist.png');
export const sexologist = require('.././assets/img/sexologist.png');
export const nutritionist = require('.././assets/img/nutritionist.png');
export const gynaecologist = require('.././assets/img/gynaecologist.png');
export const general_physician = require('.././assets/img/general_physician.png');
export const dermatologist = require('.././assets/img/dermatologist.png');
export const back_img = require('.././assets/img/back_img.png');
export const blood_pressure = require('.././assets/img/blood_pressure.png');
export const cough = require('.././assets/img/cough.png');
export const relation = require('.././assets/img/relation.png');
export const stress = require('.././assets/img/stress.png');
export const slim_body = require('.././assets/img/slim_body.png');
export const stomuch_ache = require('.././assets/img/stomuch_ache.png');
export const headache_img = require('.././assets/img/headache_img.png');
export const discount = require('.././assets/img/discount.png');
export const background_img = require('.././assets/img/background_img.jpg');
export const background = require('.././assets/img/background.png');
export const clock = require('.././assets/img/clock.png');
export const location = require('.././assets/img/location.png');
export const wallet = require('.././assets/img/wallet_icon.png');
export const home_banner = require('.././assets/img/home_banner.png');

//Path
export const home_banner4 = require('.././assets/tmp/home_banner4.jpg');
export const home_banner1 = require('.././assets/tmp/home_banner1.jpg');
export const home_banner2 = require('.././assets/tmp/home_banner2.jpg');
export const home_banner3 = require('.././assets/tmp/home_banner3.jpg');
export const medicine = require('.././assets/tmp/medicine.jpg');
export const headache = require('.././assets/tmp/headache.png');
export const back = require('.././assets/tmp/back.png');
export const corona = require('.././assets/tmp/corona.png');
export const stomach = require('.././assets/tmp/stomach.png');
export const pregnant = require('.././assets/tmp/pregnant.png');
export const pediatrics = require('.././assets/tmp/pediatrics.png');
export const dermatology = require('.././assets/tmp/dermatology.png');
export const home_banner5 = require('.././assets/tmp/home_banner5.webp');
export const home_banner6 = require('.././assets/tmp/home_banner6.webp');
export const home_banner7 = require('.././assets/tmp/home_banner7.webp');
export const home_banner8 = require('.././assets/tmp/home_banner8.webp');
export const profile = require('.././assets/tmp/profile.png');
export const acne = require('.././assets/tmp/acne.png');
export const product_img = require('.././assets/tmp/product_img.jpg');
export const default_img = require('.././assets/tmp/default_img.jpg');
//Lottie
export const accept_lottie = require('.././assets/json/accept.json');
export const reject_lottie = require('.././assets/json/reject.json');

//Font Family
export const light = 'Metropolis-Light';
export const regular = 'CheyenneSans-Regular';
export const bold = 'Metropolis-Bold';

//Map
export const GOOGLE_KEY = 'ENTER MAP KEY';
export const LATITUDE_DELTA = 0.015;
export const LONGITUDE_DELTA = 0.0152;

//Util
export const month_name = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
