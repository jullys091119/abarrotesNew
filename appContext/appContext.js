
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const StateContext = createContext(null);
import axios from 'axios';
//import { API_URL} from '@env';

export const useMyContext = () => useContext(StateContext);

export const StateProvider = ({ children}) => {
 const [user, setUser] = useState('');
 const [password, setpassword] = useState('')
 const [tokenLogout,setTokenLogout] = useState('')
 const [token, setToken] = useState("")
 const [uid, setUid] = useState()
 const [imagen, setImagen] = useState({})
 const [productos, setProductos] = useState({})
 const [name, setName] = useState("")
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [products, setProducts] = useState(null);

  const login =  () => {
    console.log("login")
    return axios.post('https://abarrotes.msalazar.dev/user/login?_format=json', {
    "name": user,
    "pass": password,
      headers : {
        "Content-Type" : "application/json",
      },
    })
    .then(async function (response) {
      console.log(response.data)
      setIsAuthenticated(true);
      setToken(response.data.csrf_token)
      await AsyncStorage.setItem("@UID", response.data.current_user.uid)
      await AsyncStorage.setItem("@TOKEN", response.data.csrf_token)
      await AsyncStorage.setItem("@TOKEN_LOGOUT", response.data.logout_token)
      return response.status
    })
    .catch(function (error) {
      console.log(error)
    });
    
  }
  
  const getCredentials = async () => {
   let idUser =  await AsyncStorage.getItem("@UID")
   getDataUser(idUser)
   let token_logout =  await AsyncStorage.getItem("@TOKEN_LOGOUT")
   setTokenLogout(token_logout)
  }
  

  const getDataUser = async (uid)=> {
    console.log("getDatauser")
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
  
  const logout = () => {
    return axios.get('https://abarrotes.msalazar.dev/user/logout', {
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-Token": tokenLogout
      }
    }).then(function(response){
      tokenDelete()
      userRemove()
      return response.status
      
    }).catch(function(error){
      console.log(error)
    })
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
  

  useEffect(()=>{
   getProveedores()
   getCredentials()
  },[])

  return (
    <StateContext.Provider value={{
     setUser,
     setpassword,
     login,
     logout,
     getProveedores,
     getCredentials,
     setProducts,
     isAuthenticated,
     user,
     password,
     imagen,
     productos,
     products,
     name,
     token,
     tokenLogout
    }}>
      {children}
    </StateContext.Provider>
  );
};