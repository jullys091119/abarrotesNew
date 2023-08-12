import React,{useState,useRef, useEffect} from "react";
import { Modal, View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { Layout,  Card, Avatar, Button } from "@ui-kitten/components";
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av';
import AsyncStorage from "@react-native-async-storage/async-storage";



function ModalBimbo() {
  const URL_BASE = 'https://abarrotes.msalazar.dev/jsonapi/node/productos?filter[field_proveedor]=Bimbo&include=field_imagen';
  const [productos, setProductos] = useState({})
  const [imagen,setImagen] = useState({})
  const [estado, setEstado] = useState(false);
  const [sound,setSound] = useState();
  const [token, setToken] = useState("")
  let inventoryBimbo = Object.values(productos)


  const getProducts=()=>{
    axios.get(URL_BASE, {
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

  async function playSoundAdd() {
    const {sound} = await Audio.Sound.createAsync(require('../src/iphone_connect.mp3'))
    setSound(sound);
    await sound.playAsync();
  }
  
  async function playSoundQuit() {
    const {sound} = await Audio.Sound.createAsync(require('../src/chek_iphone_2.mp3'))
    setSound(sound);
    await sound.playAsync();
  }
  
  const addFavorites = async (index, id, img) => {
    const uid = await AsyncStorage.getItem("@UID")
    const tk =  await AsyncStorage.getItem("@token")
    var axios = require("axios").default;
    axios.defaults.headers.common['X-CSRF-Token'] = tk;
    var options = {
      method: 'POST',
      url: 'https://abarrotes.msalazar.dev/jsonapi/node/favoritos',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      data: {
        data: {
          type: 'node--favoritos',
          attributes: {
            title: 'Favoritos',
            body: null,
            field_id_producto: id,
            field_id_user: uid,
            field_imagen_producto: img
          },
          relationships: {
            node_type: {
              data: {
                type: 'node_type--node_type',
                id: '2d08c9c0-76f1-41e9-9cbf-0c43b73e8962',
                meta: {drupal_internal__target_id: 'favoritos'}
              }
            }
          }
        }
      }
    };
    axios.request(options).then(function (response) {
       //console.log("producto agregado", response.data)
    }).catch(function (error) {
    });
    productos[index].attributes.field_isactive = true
    playSoundAdd()
   
  }

  const setIsActive  = (idProduct) => {
    var options = {
      method: 'PATCH',
      url: 'https://abarrotes.msalazar.dev/node/' +  idProduct,
      params: {'': '', _format: 'json'},
      headers: {'Content-Type': 'application/json', Authorization: 'Basic Og=='},
      data: {
        type: [
          {
            target_id: 'productos',
            target_type: 'node_type',
            target_uuid: '7f09bc5b-f3a4-418a-b99d-d91e2a8967b2'
          }
        ],
        field_isactive: [{value: true}]
      }
    };
    axios.request(options).then(function (response) {
    }).catch(function (error) {
    }); 
    
  }

  const quitFavorites = (index, bool, idProduct) => {
    console.log(idProduct, "<<<<<<<<<<<<<<<<")
    getProductsFavorites(idProduct)
    var options = {
      method: 'PATCH',
      url: 'https://abarrotes.msalazar.dev/node/' +  idProduct,
      params: {'': '', _format: 'json'},
      headers: {'Content-Type': 'application/json', Authorization: 'Basic Og=='},
      data: {
        type: [
          {
            target_id: 'productos',
            target_type: 'node_type',
            target_uuid: '7f09bc5b-f3a4-418a-b99d-d91e2a8967b2'
          }
        ],
        field_isactive: [{value: !bool}]
      }
    };
    axios.request(options).then(function (response) {
     
    }).catch(function (error) {
    }); 
    
    productos[index].attributes.field_isactive = !bool
    playSoundQuit()
  }

  const getProductsFavorites = async (idProduct) => {
    axios.get('https://abarrotes.msalazar.dev/jsonapi/node/favoritos', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
       response.data.data.forEach(element => {
         console.log(idProduct, element.attributes.field_id_producto)
         if(idProduct===element.attributes.field_id_producto) {
           deleteNodeFavorites(element.attributes.drupal_internal__nid)
         }
       });
    })
    .catch(function (error) {
      console.log(error ,"getProducts");
    });
  }

  deleteNodeFavorites = (id) => {
      var options = {
        method: 'DELETE',
        url: 'https://abarrotes.msalazar.dev/node/' +  id,
        params: {'': '', _format: 'json'},
        headers: {'Content-Type': 'application/json', Authorization: 'Basic Og=='},
      };
      axios.request(options).then(function (response) {
        alert("NOdo elimindado")
        getProducts()
      }).catch(function (error) {
      }); 
  }

  useEffect(() => {
    getProducts()
  
  }, [])
  return (
    <ScrollView>
      <Layout style={{  display:"flex", flexDirection: "row", justifyContent: "center", flexWrap:"wrap", gap:10  }}>
        {inventoryBimbo.map((producto, index) => {
          // console.log(producto)
          return (
            <Card key={index} style={[styles.cards]}>
                { 
                  producto.attributes.field_isactive==false?
                  <MaterialCommunityIcons  
                    name='heart'
                    style={{color: "gray", alignSelf: "flex-end", marginLeft: 90}} 
                    size={30}
                    onPress={()=>{
                      addFavorites(
                        index,
                        producto.attributes.drupal_internal__nid,
                        `https://abarrotes.msalazar.dev` + imagen.included[index].attributes.uri.url
                      ),
                      setEstado(!estado)
                      setIsActive(producto.attributes.drupal_internal__nid)
                    }}
                  />:
                  <MaterialCommunityIcons  
                    name='heart'
                    style={{color: "red", alignSelf: "flex-end", marginLeft: 90}} 
                    size={30}
                    onPress={()=>{
                      quitFavorites(
                        index,
                        producto.attributes.field_isactive,
                        producto.attributes.drupal_internal__nid,
                        producto.attributes.drupal_internal__vid,
                        ),
                      setEstado(!estado)
                    }}
                    />
                  }
                  {
                    producto.attributes.field_inventory==0?
                    <Layout style={[styles.backgroundColorCard]} ><Text style={{color:"white",fontSize:19,fontWeight:"800"}}>Producto agotado</Text></Layout>
                    : null
                  }
                <Image               
                  source={{uri: `https://abarrotes.msalazar.dev` + imagen.included[index].attributes.uri.url}} 
                  style={{
                    width: 120,
                    height: 100,
                    borderRadius: 10,
                    marginVertical: 10, 
                    alignSelf: "center",
                  }}
                />
                <Text style={{textAlign:"center"}}>{producto.attributes.title}</Text>
                <Text style={{textAlign:"center", fontWeight:"800"}}>Precio:  ${producto.attributes.field_precio_venta}</Text>
                <Layout>
                  <Button style={styles.button} status='danger' size="medium">
                    Agregar
                  </Button>
                </Layout>
            </Card>
          );
        })}
      </Layout>
    </ScrollView>
  );
}

styles = StyleSheet.create({
  cards: {
    width: 160,
    maxHeight: 290,
    marginVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  button: {
   marginTop: 20
  },
  
  backgroundColorCard: {
    position:'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    display:"flex",
    alignItems: "center",
    justifyContent:"center"
  }


})

export default ModalBimbo