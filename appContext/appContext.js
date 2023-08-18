
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const StateContext = createContext(null);
import axios from 'axios';
//import { API_URL} from '@env';

export const useMyContext = () => useContext(StateContext);

export const StateProvider = ({ children,navigation }) => {
 const [user, setUser] = useState('');
 const [password, setpassword] = useState('')
 const [token,setToken] = useState('')
 const [uid, setUid] = useState()
 const [imagen, setImagen] = useState({})
 const [productos, setProductos] = useState({})
 const [name, setName] = useState("")

  const login =  () => {
    return axios.post('https://abarrotes.msalazar.dev/user/login?_format=json', {
    "name": user,
    "pass": password,
      headers : {
      "Content-Type" : "application/json",
      },
    })
    .then(async function (response) {
      await AsyncStorage.setItem("@UID",response.data.current_user.uid)
      return response.status
    })
    .catch(function (error) {
      console.log(error, "error de logueo")
    });

  }

  const getToken = () => {
     return axios.post('https://abarrotes.msalazar.dev/session/token?_format=json', {
      headers : {
        "Content-Type" : "application/json",
      },
    }).then( async res=>{
        console.log(res.data)
        return res.data
    }).catch(err=>{
      console.log(err)
    })
  }

  const getUid = async () => {
   const uidUser = await AsyncStorage.getItem("@UID")
   getDataUser(uidUser)
  }

  const userRemove= async()=> {
    try {
      await AsyncStorage.removeItem("@name")
      console.log("user eliminado")
    } catch(error) {
      console.log(error, "error en el catech")
    }
  }

  const tokenDelete=async()=> {
    try {
      await AsyncStorage.removeItem("@token")
    } catch (error) {
      console.log(error)
    }
  } 

  const getProducts = () => {
    axios.get('https://abarrotes.msalazar.dev/jsonapi/node/img_proveedores?include=field_img_proveedores', {
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

  const getDataUser = async (uid)=> {
  
    console.log(uid, "uid")
    await axios.get(`https://abarrotes.msalazar.dev/user/` + uid + `?_format=json`, {
      headers: {
        "Content-Type" : "application/json",
      },
    }).then(async(response) =>{
       //console.log(response.data)
      //setUidStorage(response.data.uid[0].value)
      //setApellidoUser(response.data.field_apellidos_usuario[0].value)
      //setDireccionUser(response.data.field_direccion_usuario[0].value)
      //setTelefonoUser(response.data.field_telefono_usuario[0].value)
      //setEmailUser(response.data.field_email_usuario[0].value)
      await AsyncStorage.setItem("@name", response.data.field_nombre_usuario[0].value) 
      const value = await AsyncStorage.getItem('@name');
      console.log(value, "name" )
      if(value !== null) {
        setName(value)
      }
      // await AsyncStorage.setItem("@lastname", response.data.field_apellidos_usuario[0].value)
      // await AsyncStorage.setItem("@address", response.data.field_direccion_usuario[0].value)
      // await AsyncStorage.setItem("@email", response.data.field_email_usuario[0].value)
      // await AsyncStorage.setItem("@phone", response.data.field_telefono_usuario[0].value)
    })
  }
   

  



  useEffect(()=>{
   getProducts()
   getUid()
  },[])

  return (
    <StateContext.Provider value={{
     setToken,
     setUser,
     setpassword,
     tokenDelete,
     userRemove,
     login,
     getToken,
     getProducts,
     getUid,
     user,
     password,
     imagen,
     productos,
     name,
     
    }}>
      {children}
    </StateContext.Provider>
  );
};