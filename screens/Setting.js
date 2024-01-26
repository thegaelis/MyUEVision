/* eslint-disable no-dupe-keys */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import Tts from 'react-native-tts';
import { useModalState } from '../function/ModalContext';
import { useNetInfo } from '../function/NetInfoContext'
import ModalOffline from "../function/ModalOffline";
function Option({route}) {
  const {navigation} = route.params.props;
  const {goBack} = navigation;
  const {setSelectedLanguage1, selectedLanguage1, languageText} = route.params;
  const [selectedLanguage, setSelectedLanguage] = useState(selectedLanguage1);
  const [countBackButton, setCountBackButton] = useState(0);
  const [countELButton, setCountELButton] = useState(0);
  const [countVNButton, setCountVNButton] = useState(0);
  const handleLanguageLabel = () => {
    Tts.speak(languageText[selectedLanguage].languageLabel, {
      androidParams: {
        KEY_PARAM_VOLUME: 1,
      },
    });
  };
  const handleBackButtonPress = () => {
    const message =
      countBackButton === 0
        ? languageText[selectedLanguage].backButtonText
        : '';
    Tts.speak(message);
    if (countBackButton !== 0) {
      goBack();
    }
    setCountBackButton(prevCount => (prevCount + 1) % 2);
  };

  const handleELButtonPress = () => {
    const message =
      countELButton === 0
        ? languageText[selectedLanguage].languageButtonEN
        : 'Tiếng Anh Đã Được Chọn';
    Tts.speak(message);
    if (countELButton !== 0) {
      setSelectedLanguage('en');
    }
    setCountELButton(prevCount => (prevCount + 1) % 2);
  };

  const handleVNButtonPress = () => {
    const message =
      countVNButton === 0
        ? languageText[selectedLanguage].languageButtonVI
        : 'Vietnamese Selected';
    Tts.speak(message);
    if (countVNButton !== 0) {
      setSelectedLanguage('vi');
    }
    setCountVNButton(prevCount => (prevCount + 1) % 2);
  };
  useEffect(() => {
    setSelectedLanguage1(selectedLanguage);
  }, [selectedLanguage]);
  // modallabel
  const handleModalLabel = () => {
    Tts.speak(languageText[selectedLanguage].modalLabel);
  }
  const [countOfButton,setCountOfButton] = useState(0);
  const [countOnButton,setCountOnButton] = useState(0);
  const {modalType,setModalType} = useModalState();
  // console.log(modalType);
  
  // console.log(isConnected);
  useEffect(() => {
    if (!isConnected) setIsDisabled(true);
    else setIsDisabled(false);
  },[isConnected])
  const handleOffButtonPress = () => {
    
  }
  const handleOnButtonPress = () => {

  }
  const [isDisabled, setIsDisabled] = useState(false);
  const {isConnected,showNetInfo,setShowNetInfo} = useNetInfo();
  // console.log('12'+showNetInfo);
  const onClose = () => {
    setShowNetInfo(false);
 }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackButtonPress}
        accessibilityLabel="Back Button">
        <Text style={styles.buttonText}>
          {languageText[selectedLanguage].backButtonText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLanguageLabel} activeOpacity={1}>
        <Text style={styles.label}>
          {languageText[selectedLanguage].languageLabel}
        </Text>
      </TouchableOpacity>
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'en' ? styles.selectedLanguage : null,
          ]}
          onPress={handleELButtonPress}
          accessibilityLabel="English Language Button">
          <Text style={styles.buttonText}>
            {languageText[selectedLanguage].languageButtonEN}
          </Text>
        </TouchableOpacity> 
        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'vi' ? styles.selectedLanguage : null,
          ]}
          onPress={handleVNButtonPress}
          accessibilityLabel="Vietnamese Language Button">
          <Text style={styles.buttonText}>
            {languageText[selectedLanguage].languageButtonVI}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleModalLabel} activeOpacity={1}> 
        <Text style={styles.label}>
          {languageText[selectedLanguage].modalLabel}
        </Text>
      </TouchableOpacity>
      <View style = {styles.modalContainer}>
        <TouchableOpacity
        style={[
          styles.languageButton,
          modalType === 0 ? styles.selectedLanguage : null
        ]}
        onPress={handleOffButtonPress}
        >
          <Text style={styles.buttonText}>
            Offline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={[
          styles.languageButton,
          modalType === 1 ? styles.selectedLanguage : null
        ]}
        onPress={handleOnButtonPress}
        disabled = {isDisabled}
        >
          <Text style={styles.buttonText}>
            Online
          </Text>
        </TouchableOpacity>
      </View>
      <ModalOffline isVisible={showNetInfo}  onClose={onClose} selectedLanguage = {selectedLanguage} languageText = {languageText}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
  },
  backButton: {
    height: '15%',
    width: '100%',
    // backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 40,
    // margin: 10,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 25,
  },
  languageContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    height: '20%',
    width: '100%'
  },
  languageButton: {
    backgroundColor: 'grey',
    width: '45%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
    
  },
  modalContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    height: '30%',
    width: '100%'
  },
  modalButton: {
    backgroundColor: 'grey',
    width: '45%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  selectedLanguage: {
    backgroundColor: 'blue', // Blue when the button is selected
  },
});

export default Option;
