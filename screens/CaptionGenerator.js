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
import * as tf from '@tensorflow/tfjs';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import * as jpeg from 'jpeg-js'
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
  const device = useCameraDevice('back');
  const [model, setModel] = useState(null); // Add this line for model state

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
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'speed'
        });
        //API:const base64string = await RNFS.readFile(photo.path, 'base64');
        //API:let caption = await uploadImage(base64string); // Ensure this function returns the desired text
        // caption = caption.slice(43, caption.length - 3);
        //API:let captionResult = caption;
        // Only translate if Vietnamese is selected
        let captionResult = await modelRun(photo.path);
        if (selectedLanguage === 'vi') {
          captionResult = await translateText(captionResult); // Ensure this function translates as needed
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
   // thay doi trang thai hoac mat focus
   useEffect(() => {
    async function loadModel() {
      try {
        // Load TensorFlow.js model
        const modelJson = require('../model/model.json');
        const modelWeights = require('../model/group1-shard.bin');
        const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));

        // Save the model reference to state
        setModel(model);

        console.log('[+] TensorFlow.js model loaded');
      } catch (error) {
        console.error('Error loading TensorFlow.js model:', error);
      }
    }
    loadModel();
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      console.log('remove');
      sub.remove();
    };
  }, []);
  const modelRun = async (filePath) => {
    try {
      // You can directly use the file path for your model
      // Adjust this based on your specific TensorFlow.js model requirements
      const prediction = filePath;

      // Process the prediction result
      const generatedCaption = processPrediction(prediction);

      return { generated_caption: generatedCaption };
    } catch (error) {
      console.error('Error during model prediction:', error);
      return { error: 'Error during model prediction' };
    }
  };
  const processPrediction = (prediction) => {
    // Modify this function based on your post-processing steps in the Python code
    // You may need to convert tensor data to JavaScript arrays and perform additional steps
    // For simplicity, let's assume the prediction is a single value for caption generation
    return prediction.dataSync()[0].toString();
  };
  const handleAppStateChange = nextAppState => {
    console.log(nextAppState);
    if (nextAppState !== 'active') {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };
 
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
  }, [ ]);
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
});
export default CaptionGenerator;
