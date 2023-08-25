
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const StateContext = createContext(null);
import axios from 'axios';
//import { API_URL} from '@env';

export const useMyContext = () => useContext(StateContext);

export const useAppContext = () => {
  return useMyContext
};

export const StateProvider = ({ children,navigation, MyTabs }) => {
 const [user, setUser] = useState('');
 const [password, setpassword] = useState('')
 const [token,setToken] = useState('')
 const [uid, setUid] = useState()
 const [imagen, setImagen] = useState({})
 const [productos, setProductos] = useState({})
 const [name, setName] = useState("")
 const [loged, setIsLogued] = useState(false)

  const login =  () => {
    return axios.post('https://abarrotes.msalazar.dev/user/login?_format=json', {
    "name": user,
    "pass": password,
      headers : {
        "Content-Type" : "application/json",
      },
    })
    .then(async function (response) {
      console.log(response.data)
      currentUid(response.data.current_user.uid)
      setIsLogued(true)
      if(loged) {
        return <MyTabs/>
      } else { 

        return response.status
      }
    })
    .catch(function (error) {
      console.log(error, "error de logueo")
    });
    
  }
  
  const currentUid = async (uid) => {
    await AsyncStorage.setItem("@UID", uid)
  }

  //Deslogueandote
  const logout = () => {
    return axios.get('https://abarrotes.msalazar.dev/user/logout', {
      headers: {
        "Content-Type": "application/json",
      }
    }).then(function(response){
      tokenDelete()
      userRemove()
      // photoRemove()
      return response.status

    }).catch(function(error){
      console.log(error)
    })
  }

  const getToken = () => {
     return axios.post('https://abarrotes.msalazar.dev/session/token?_format=json', {
      headers : {
        "Content-Type" : "application/json",
      },
    }).then( async res=>{
      console.log(res.data,"token actual")
      setToken(res.data)
      setTokenStorage(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }

  const setTokenStorage = async (tk) => {
    await AsyncStorage.setItem("@TOKEN", tk)
  }

  const tokenDelete=async()=> {
    try {
      await AsyncStorage.removeItem("@TOKEN")
      console.log("borrando token")
    } catch (error) {
      console.log(error)
    }
  } 
  const userRemove= async()=> {
    try {
      await AsyncStorage.removeItem("@name")
      console.log("user eliminado")
    } catch(error) {
      console.log(error, "error en el catech")
    }
  }


  const getProveedores = () => {
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

  const currentUidStorage = async () => {
   const idUser =  await AsyncStorage.getItem("@UID")
   getDataUser(idUser)
  }
  
  const getDataUser = async (uid)=> {
    console.log(uid,"<<<")
    await axios.get(`https://abarrotes.msalazar.dev/user/` + uid + `?_format=json`, {
      headers: {
        "Content-Type" : "application/json",
      },
    }).then(async(response) =>{     
      await AsyncStorage.setItem("@name", response.data.field_nombre_usuario[0].value) 
      const value = await AsyncStorage.getItem('@name');
      if(value !== null) {
        setName(value)
      }
  
    }).catch(err => {console.log(err, "error get user")})
  }

  useEffect(()=>{
   getToken()
   getProveedores()
   console.log(loged)
  },[])

  return (
    <StateContext.Provider value={{
     setToken,
     setUser,
     setpassword,
     login,
     getToken,
     logout,
     getProveedores,
     currentUidStorage,
     user,
     password,
     imagen,
     productos,
     name,
     token
     
    }}>
      {children}
    </StateContext.Provider>
  );
};