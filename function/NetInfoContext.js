// NetInfoContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
const NetInfoContext = createContext();
export const NetInfoProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(0);
  const [showNetInfo,setShowNetInfo] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      // console.log(state.isConnected)
    }).catch(error => {
      console.error("Error fetching NetInfo:", error);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (isConnected) setShowNetInfo(false);
    else setShowNetInfo(true);
}, [isConnected]);
  return <NetInfoContext.Provider value={{isConnected,setIsConnected,showNetInfo,setShowNetInfo}}>{children}</NetInfoContext.Provider>;
};
export const useNetInfo = () => {
  const context = useContext(NetInfoContext);
  if (context === undefined) {
    throw new Error('useNetInfo must be used within a NetInfoProvider');
  }
  return context;
};

