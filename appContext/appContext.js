
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const StateContext = createContext(null);
import axios from 'axios';
import { API_URL} from '@env';

export const useMyContext = () => useContext(StateContext);

export const StateProvider = ({ children,navigation }) => {
 const [user, setUser] = useState('admin');
 const [password, setpassword] = useState('root')
 const [token,setToken] = useState('')
 const [nameUser, setNameUser] =  useState("")
 const [uid, setUid] = useState()
 const [imagen, setImagen] = useState({})
 const [productos, setProductos] = useState({})


  const getUid = async () => {
   const uidUser = await AsyncStorage.getItem("@UID")
   setUid(uidUser)
  }

  const userRemove= async()=> {
    try {
      await AsyncStorage.removeItem("@user")
      console.log("user eliminado")
    } catch(error) {
      console.log(error, "error en el catech")
    }
  }

  const gettingToken=async()=>{
    const currentToken = await AsyncStorage.getItem("@token")
    setToken(currentToken)
  }
  
  const tokenDelete=async()=> {
    try {
      await AsyncStorage.removeItem("@token")
    } catch (error) {
      console.log(error)
    }
  } 

  const getProducts = () => {
    axios.get(API_URL + 'img_proveedores?include=field_img_proveedores', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      setImagen(response.data)
      setProductos(response.data.data)
    })
    .catch(function (error) {
      console.log(error);
    });  
  }

  const getUserName = async () => {
    try {
      const nameUser = await AsyncStorage.getItem("@name")
      setNameUser(nameUser)
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(()=>{
   gettingToken()
   getProducts()
   getUserName()
  },[])

  return (
    <StateContext.Provider value={{
     setToken,
     setUser,
     setpassword,
     tokenDelete,
     userRemove,
     user,
     password,
     token,
     imagen,
     productos,
     nameUser
    }}>
      {children}
    </StateContext.Provider>
  );
};