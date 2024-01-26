/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  AppState,
  ActivityIndicator,
  Button,
  Modal,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {detectObjects} from 'react-native-worklets-core';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Tts from 'react-native-tts';
import RNFS from 'react-native-fs';
import {uploadImage, translateText} from '../function/api';
import { useNetInfo } from '../function/NetInfoContext'
import ModalOffline from "../function/ModalOffline";
function CaptionGenerator({route}) {
  const [countCaptureButton, setCountCaptureButton] = useState(0);
  const [countBackButton, setCountBackButton] = useState(0);
  const {selectedLanguage, languageText} = route.params;
  const {navigation} = route.params.props;
  const {navigate, goBack} = navigation;
  // const {selectLanguage,languageText} = props;
  // console.log(selectedLanguage);
  const {hasPermission, requestPermission} = useCameraPermission();
  const [isActive, setIsActive] = useState(true);
  const isFocused = useIsFocused();
  const device = useCameraDevice('front');
  // xu li click nut back
  const HandleBackButtonPress = () => {
    countBackButton === 0
      ? Tts.speak(languageText[selectedLanguage].backButtonText)
      : goBack();
    countBackButton === 0 ? setCountBackButton(1) : setCountBackButton(0);
  };
  // xu li click nut chup
  const HandleCaptureButtonPress = () => {
    if (countCaptureButton == 0) {
      Tts.speak(languageText[selectedLanguage].captureButton);
    } else {
      HandleCamera();
      Tts.speak(languageText[selectedLanguage].processing);
    }
    countCaptureButton == 0
      ? setCountCaptureButton(1)
      : setCountCaptureButton(0);
  };
  // format
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  const camera = useRef(null);
  // taking photo
  const HandleCamera = async () => {
    setShowModal(true);
    if (camera.current && isActive) {
      try {
        const photo = await camera.current.takePhoto();
        const base64string = await RNFS.readFile(photo.path, 'base64');
        let caption = await uploadImage(base64string); // Ensure this function returns the desired text
        // caption = caption.slice(43, caption.length - 3);
        let captionResult = caption;
        // Only translate if Vietnamese is selected
        if (selectedLanguage === 'vi') {
          captionResult = await translateText(caption); // Ensure this function translates as needed
        }
        // setProcessing(false);
        // Speak out the result
        Tts.speak(captionResult);
        navigate('PresentCaption', {
          captionText: captionResult,
          languageText: languageText,
          selectedLanguage: selectedLanguage,
          navigation: navigation,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleAppStateChange = nextAppState => {
    console.log(nextAppState);
    if (nextAppState !== 'active') {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };
  // thay doi trang thai hoac mat focus
  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      console.log('remove');
      sub.remove();
    };
  }, []);
  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
  };
  useEffect(() => {
    checkPermission();
  }, []);
  // frame processor
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const objects = detectObjects(frame);
    console.log(`Detected ${objects.length} objects.`);
  }, []);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false); // hien thi lop phu (overlay)
  const navigation1 = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation1.addListener('blur', () => {
      setShowModal(false); // Đóng modal khi chuyển qua màn hình khác
    });
  }, []);
  const [modalNetInfo, setModalNetInfo] = useState(false);
    const {isConnected,showNetInfo,setShowNetInfo} = useNetInfo();
    const onClose = () => {
       setShowNetInfo(false);
    }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={HandleBackButtonPress}>
        <Text style={styles.backButtonText}>
          {languageText[selectedLanguage].backButtonText}
        </Text>
      </TouchableOpacity>
      <Camera
        // frameProcessor={frameProcessor}
        photo={true}
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isActive}
        format={format}
      />
      <TouchableOpacity
        onPress={HandleCaptureButtonPress}
        style={styles.captureButton}>
        <Text style={styles.captureButtonText}>
          {languageText[selectedLanguage].captureButton}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={showModal}
        transparent={true} // trong suot
        animationType="fade" // kieu xuat hien va bien mat
        onRequestClose={() => setShowModal(false)}>
        <View style = {styles.center}>
        <View style={styles.modal}>
          <ActivityIndicator size="100" color="#ffffff" />
          <Text style={{color: '#ffffff', marginTop: 10}}>
            {languageText[selectedLanguage].processing}
          </Text>
        </View>
        </View>
      </Modal>
      <ModalOffline isVisible={showNetInfo} onClose={onClose} selectedLanguage = {selectedLanguage} languageText = {languageText}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    height: '75%',
    width: '100%',
  },
  backButton: {
    height: '10%',
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  captureButton: {
    height: '15%',
    width: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  center:{
    flex: 1,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
// eslint-disable-next-line prettier/prettier
});
export default CaptionGenerator;
