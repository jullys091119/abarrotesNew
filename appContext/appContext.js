
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const StateContext = createContext(null);
import axios from 'axios';
//import { API_URL} from '@env';

export const useMyContext = () => useContext(StateContext);

export const StateProvider = ({ children}) => {
 const [user, setUser] = useState('');
 const [password, setPassword] = useState('')
 const [tokenLogout,setTokenLogout] = useState('')
 const [token, setToken] = useState("")
 const [uid, setUid] = useState()
 const [imagen, setImagen] = useState({})
 const [name, setName] = useState("")
 const [productos, setProductos] = useState({})
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [products, setProducts] = useState(null);
 const [nameRegister, setNameRegister] = useState("");
 const [lastNameRegister, setLastNameRegister] = useState("");
 const [phoneRegister, setPhoneRegister] = useState("");
 const [addressRegister, setAddressRegister] = useState("");
 const [emailRegister, setEmailRegister] = useState("");
 const [passwordRegister,setPasswordRegister] =  useState("")
 const [userRegister,setUserRegister] =  useState("")

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
    console.log(uid)
    await axios.get(`https://abarrotes.msalazar.dev/user/` + uid + `?_format=json`, {
      headers: {
        "Content-Type" : "application/json",
      },
    }).then(async(response) =>{     
      await AsyncStorage.setItem("@name", response.data.field_nombre_usuario[0].value) 
      const value = await AsyncStorage.getItem('@name');
      console.log(value, "value")
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
      setUser("")
      setPassword("")

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

  const handleSave = () => {
    const options = {
      method: 'POST',
      url: 'https://abarrotes.msalazar.dev/user/register?_format=json',
      params: {_format: 'json'},
      headers: {'Content-Type': 'application/json'},
      data: {
        name: [{ value: userRegister }],
        pass: [{ value: passwordRegister }],  
        mail: [{ value: emailRegister }],  
        field_nombre_usuario: [{ value: nameRegister }], 
        field_apellidos_usuario: [{ value: lastNameRegister }], 
        field_direccion_usuario: [{ value: addressRegister }], 
        field_telefono_usuario:  [{ value: phoneRegister }], 
      }
     }
    axios.request(options).then((response)=>{
     console.log(response.data)
     setUserRegister("")
     setNameRegister("")
     setLastNameRegister("")
     setEmailRegister("")
     setPasswordRegister("")
     setPhoneRegister("")
     setAddressRegister("")
     setUser("")
     setPassword("")
    }).catch((error)=>{
      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
        // http.ClientRequest en node.js
        console.log(error.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  };

  

  useEffect(()=>{
   getProveedores()
   getCredentials()
  },[])

  return (
    <StateContext.Provider value={{
     setUser,
     setPassword,
     login,
     logout,
     getProveedores,
     getCredentials,
     setProducts,
     handleSave,
     setUserRegister,
     setPasswordRegister,
     setEmailRegister,
     setNameRegister,
     setLastNameRegister,
     setAddressRegister,
     setPhoneRegister,
     userRegister,
     passwordRegister,
     emailRegister,
     nameRegister,
     lastNameRegister,
     addressRegister,
     phoneRegister,
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