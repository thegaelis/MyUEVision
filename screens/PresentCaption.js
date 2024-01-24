/* eslint-disable prettier/prettier */
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Tts from 'react-native-tts';
const PresentCaption = ({route}) => {
  const {captionText} = route.params;
  const {navigation} = route.params;
  const {selectedLanguage, languageText} = route.params;
  const {navigate, goBack} = navigation;
  const [countBackButton, setCountBackButton] = useState(0);
  const HandleBackButtonPress = () => {
    countBackButton === 0
      ? Tts.speak(languageText[selectedLanguage].backButtonText)
      : goBack();
    countBackButton === 0 ? setCountBackButton(1) : setCountBackButton(0);
  };
  const HandleRepeatButtonPress = () => {
    Tts.speak(captionText);
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonBackContainer}>
        <TouchableOpacity style={styles.button} onPress={HandleBackButtonPress}>
          <Text style={styles.buttonText}>
            {languageText[selectedLanguage].backButtonText}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.caption}>
        <Text style={styles.captionText}>{captionText}</Text>
      </View>
      <View style={styles.buttonRepeatContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={HandleRepeatButtonPress}>
          <Text style={styles.buttonText}>
            {languageText[selectedLanguage].repeat}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default PresentCaption;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    justifyContent: 'center',
  },
  caption: {
    flex: 0.75,
    alignContent: 'center',
    justifyContent: 'center',
  },
  captionText: {
    color: 'white',
    fontSize: 33,
    fontWeight: 'bold',
  },
  buttonBackContainer: {
    flex: 0.1,
  },
  buttonRepeatContainer: {
    flex: 0.15,
  },
  button: {
    backgroundColor: 'blue',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
