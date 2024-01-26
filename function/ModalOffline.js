// ModalOffline.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Modal } from 'react-native';
// import Modal from 'react-native-modal';
const ModalOffline = ({ isVisible, onClose, selectedLanguage,languageText}) => {
  return (
    <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
            >
                    <View style={styles.centeredModal}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{languageText[selectedLanguage].noInternet}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.closeButton}>{languageText[selectedLanguage].close}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                
            </Modal>
  );
};
const styles = {
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

export default ModalOffline;
