
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const StateContext = createContext(null);
import axios from 'axios';
//import { API_URL} from '@env';

export const useMyContext = () => useContext(StateContext);

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('')
  const [tokenLogout, setTokenLogout] = useState('')
  const [token, setToken] = useState("")
  const [uid, setUid] = useState()
  const [imagen, setImagen] = useState({})
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [productos, setProductos] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState(null);
  const [nameRegister, setNameRegister] = useState("");
  const [lastNameRegister, setLastNameRegister] = useState("");
  const [phoneRegister, setPhoneRegister] = useState("");
  const [addressRegister, setAddressRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("")
  const [userRegister, setUserRegister] = useState("")
  const [error, setError] = useState("")
  const [contador, setContador] = useState(0)
  const [nombreProducto, setNombreProducto] = useState("")
  const [nombreProveedor, setNombreProveedor] = useState("")
  const [precio, setPrecio] = useState(0)
  const [venta, setVenta] = useState(0)
  const [counterSales, setCounterSales] = useState([])
  const [addSales, setAddSales] = useState("")
  const [updateSales, setUpdateSales] = useState('')
  const [counterHome, setCounterHome] = useState('')
  const [ischarged, setIsCharged] = useState(false)
  const [email, setEmail] = useState("")
  const [profile, setProfile] = useState("")
  const [miniPerfil, setMiniPerfil] = useState("")



  const login = () => {
    return axios.post('https://abarrotes.msalazar.dev/user/login?_format=json', {
      "name": user,
      "pass": password,
      headers: {
        "Content-Type": "application/json",
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
        return error.response.status
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

      });

  }

  const getCredentials = async () => {
    let idUser = await AsyncStorage.getItem("@UID")
    setUid(idUser)
    getDataUser(idUser)
    let token_logout = await AsyncStorage.getItem("@TOKEN_LOGOUT")
    setTokenLogout(token_logout)
  }


  const getDataUser = async (uid) => {

    await axios.get(`https://abarrotes.msalazar.dev/user/` + uid + `?_format=json`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {

      await AsyncStorage.setItem("@name", response.data.field_nombre_usuario[0].value)
      await AsyncStorage.setItem("@lastName", response.data.field_apellidos_usuario[0].value)
      await AsyncStorage.setItem("@email", response.data.field_email_usuario[0].value)
      await AsyncStorage.setItem("@address", response.data.field_direccion_usuario[0].value)
      await AsyncStorage.setItem("@phoneNum", response.data.field_telefono_usuario[0].value)
      const name = await AsyncStorage.getItem('@name');
      const email = await AsyncStorage.getItem('@email');
      const lastName = await AsyncStorage.getItem('@lastName');
      const address = await AsyncStorage.getItem("@address");
      const phone = await AsyncStorage.getItem("@phoneNum");

      if (name || email || lastName || address || phone !== null) {
        setName(name)
        setEmail(email)
        setLastName(lastName)
        setAddress(address)
        setPhone(phone)
      }

    }).catch(err => { console.log(err, "error get user") })
  }

  const logout = () => {
    return axios.get('https://abarrotes.msalazar.dev/user/logout', {
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-Token": tokenLogout
      }
    }).then(function (response) {
      tokenDelete()
      userRemove()
      setUser("")
      setPassword("")

      return response.status

    }).catch(function (error) {
      console.log(error)
    })
  }

  const tokenDelete = async () => {
    try {
      await AsyncStorage.removeItem("@TOKEN")
      console.log("borrando token")
    } catch (error) {
      console.log(error)
    }
  }
  const userRemove = async () => {
    try {
      await AsyncStorage.removeItem("@name")
      await AsyncStorage.removeItem("@lastName")
      await AsyncStorage.removeItem("@email")
      await AsyncStorage.removeItem("@address")
      await AsyncStorage.removeItem("@phoneNumber")
      await AsyncStorage.removeItem("@UID")
      await AsyncStorage.removeItem("@ID_PROFILE")
      console.log("user eliminado")
    } catch (error) {
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
      params: { _format: 'json' },
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: [{ value: userRegister }],
        pass: [{ value: passwordRegister }],
        mail: [{ value: emailRegister }],
        field_nombre_usuario: [{ value: nameRegister }],
        field_apellidos_usuario: [{ value: lastNameRegister }],
        field_direccion_usuario: [{ value: addressRegister }],
        field_telefono_usuario: [{ value: phoneRegister }],
      }
    }
    axios.request(options).then((response) => {
      setUserRegister("")
      setNameRegister("")
      setLastNameRegister("")
      setEmailRegister("")
      setPasswordRegister("")
      setPhoneRegister("")
      setAddressRegister("")
      setUser("")
      setPassword("")
    }).catch((error) => {
      console.log(error)
    })
  };

  const removeSale = async () => {
    await AsyncStorage.removeItem("@VENTA")
    await AsyncStorage.removeItem("@VENTAS")
  }


  const counterHomeScreen = async () => {
    try {
      const counterHomeScreen = await AsyncStorage.getItem("@VENTA")
      setCounterHome(counterHomeScreen)
    } catch (error) {
      console.log(error)
    }
  }
  
  const sendSales = async (venta,total,denominacion) => {
    // Formatea los datos en el formato correcto para JSON:API
    const formattedData = venta.map((ventaItem) => {
      console.log(ventaItem, "ventaItem")
      const obj = {
        idUser: uid,
        contador: ventaItem.contador,
        imagen: ventaItem.imagen,
        nombreProducto: ventaItem.nombreProducto,
        precio: ventaItem.precio,
        precioTotal: ventaItem.precioTotal,
        ventas: ventaItem.ventas,
        denominacion: denominacion
      }

      return obj
     });

    // console.log(formattedData, "FORMATED")
    const tk = await AsyncStorage.getItem("@TOKEN")
    var axios = require("axios").default;
    axios.defaults.headers.common['X-CSRF-Token'] = tk;
    
    var options = {
      method: 'POST',
      url: 'https://abarrotes.msalazar.dev/jsonapi/node/venta_cliente',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        Authorization: 'Basic YWRtaW46cm9vdA==',
        'X-XSRF-Token': tk
      },
      data: {
        data: {
          type: 'node--venta_cliente',
          attributes: {title: `compra de ${name}`, field_venta_cliente_actual: JSON.stringify(formattedData)}
        }
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
      removeSale()
      setCounterSales([]);

    }).catch(function (error) {
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
    });
  }
  
  useEffect(() => {
    getProveedores()
    getCredentials()
    counterHomeScreen()
    setIsCharged(true)
    //setPicturePhotoProfile()
  }, [])

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
      setNombreProducto,
      setNombreProveedor,
      setPrecio,
      setVenta,
      setContador,
      setCounterSales,
      setAddSales,
      setMiniPerfil,
      sendSales,
      counterHomeScreen,
      removeSale,
      setUpdateSales,
      updateSales,
      counterSales,
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
      precio,
      imagen,
      productos,
      products,
      name,
      token,
      tokenLogout,
      error,
      nombreProducto,
      contador,
      venta,
      counterHome,
      ischarged,
      email,
      lastName,
      address,
      phone,
      uid,
      miniPerfil,
    }}>
      {children}
    </StateContext.Provider>
  );
};