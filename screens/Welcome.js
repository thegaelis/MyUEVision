// click chuot 2 lan; chuyen doi ngon ngu txt
import { React, useEffect, useState } from "react";
import {
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Modal,
} from "react-native";
import Tts from 'react-native-tts'
import languageText from "../function/LanguageText";
import { useNetInfo } from '../function/NetInfoContext'
import ModalOffline from "../function/ModalOffline";
function Welcome(props) {
    const { navigation, route } = props;
    const { navigate, goBack } = navigation;
    const [selectedLanguage, setSelectedLanguage] = useState("en"); // Mặc định chọn tiếng Anh
    const [captionCount, setCaptionCount] = useState(0);
    const [settingCount, setSettingCount] = useState(0);
    // ngongngu tts
    // inital tts;
    useEffect(() => {  // yeu cau cai dat engine
        Tts.getInitStatus().then(() => {

        }, (err) => {
            if (err.code === 'no_engine') {
                Tts.requestInstallEngine();
            }
        })
    }, [])
    useEffect(() => {  // yeu cau cai dat bo sung
        Tts.requestInstallData();
    }, [])
    useEffect(() => {
        Tts.setDefaultRate(0.8, true);
        Tts.setDefaultPitch(1.0);
    }, [])
    useEffect(() => {
        selectedLanguage == 'en' ? Tts.setDefaultLanguage('en-US') : Tts.setDefaultLanguage('vi-VN');
    }, [selectedLanguage])
    const handleCaptionButtonPress = () => {
        if (captionCount == 0) {
            Tts.speak(languageText[selectedLanguage].captionGenerator);
        }
        else {
            navigate('CaptionGenerator', {
                selectedLanguage: selectedLanguage,
                languageText: languageText,
                props: props
            })
        }
        captionCount == 0 ? setCaptionCount(1) : setCaptionCount(0)
    }
    const handleSettingButtonPress = () => {
        if (settingCount == 0) {
            Tts.speak(languageText[selectedLanguage].setting);
        }
        else {
            navigate('Setting', {
                selectedLanguage1: selectedLanguage,
                setSelectedLanguage1: (value) => {
                    setSelectedLanguage(value)
                },
                languageText: languageText,
                props: props
            })
        }
        settingCount == 0 ? setSettingCount(1) : setSettingCount(0)
    }
    const [modalNetInfo, setModalNetInfo] = useState(false);
    const {isConnected,showNetInfo,setShowNetInfo} = useNetInfo();
    const onClose = () => {
       setShowNetInfo(false);
    }
    return (
        <View style={styles.container}>
            <View style={styles.welcomeMessage}>
                <Text style={styles.welcomeTitle}>MyUEVision</Text>
                <Text style={styles.welcomeSubtext}>{languageText[selectedLanguage].selectTitle}</Text>
            </View>
            <View style={styles.options}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={handleCaptionButtonPress}
                >
                    <Text style={styles.optionButtonText}>{languageText[selectedLanguage].captionGenerator}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={handleSettingButtonPress}
                >
                    <Text style={styles.optionButtonText}>{languageText[selectedLanguage].setting}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.spacer} />
            <ModalOffline isVisible={showNetInfo} onClose={onClose} selectedLanguage = {selectedLanguage} languageText = {languageText}/>
            {/* <Modal isVisible={!isConnected}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>No internet connection</Text>
        </View>
      </Modal> */}
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },

    welcomeMessage: {
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        marginBottom: 7,
        color: 'white',
        fontSize: 30,
    },
    welcomeTitle: {
        marginBottom: 7,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 50,
    },
    welcomeSubtext: {
        marginBottom: 7,
        color: 'white',
        fontSize: 20,
    },
    options: {
        height: '40%',
        width: '100%'
    },
    optionButton: {
        borderColor: 'black',
        // borderWidth: 1,
        height: '50%',
        width: '100%',
        borderRadius: 20,
        // marginHorizontal: 20,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e'
    },
    optionButtonText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold'
    },
    spacer: {
        height: '25%'
    },
    centeredModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
    closeButton: {
        fontSize: 18,
        color: 'blue', // Màu của nút đóng
    },
};

export default Welcome;
