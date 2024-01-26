
import React, { createContext, useContext, useState,useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { stat } from 'react-native-fs';
const StateContext = createContext();
export const ModalStateProvider = ({ children }) => {
  const [modalType, setModalType] = useState(0);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
          setModalType(!state.isConnected ? 0 : 1);
        });
        NetInfo.fetch().then((state) => {
            if (state.isConnected) {
              setModalType(1);
            } else {
              setModalType(0);
            }
          });
        return () => unsubscribe();
  }, []);
  return (
    <StateContext.Provider value={{ modalType,  setModalType }}>
      {children}
    </StateContext.Provider>
  );
};
export const useModalState = () => useContext(StateContext);
