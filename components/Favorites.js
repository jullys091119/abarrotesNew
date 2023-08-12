
import React,{useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert } from 'react-native';
import { Layout,  Card, Avatar, Button } from "@ui-kitten/components";
import axios from 'axios'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from 'react-native-reanimated';

function Favorites() {
  const [productos, setProductos] = useState({})
  const [imagen,setImagen] = useState({})
  const [estado, setEstado] = useState(false);
  const [sound,setSound] = useState();
  const [token, setToken] = useState("")
  const [enabled, setEnabled] = useState(true)
  const URL_BASE = 'https://abarrotes.msalazar.dev/jsonapi/node/productos';

  let inventoryFavorites = Object.values(productos)

  const getProducts = async () => {
    let id = await AsyncStorage.getItem("@UID")
    axios.get('https://abarrotes.msalazar.dev/jsonapi/node/favoritos?filter[field_id_user]=' + id, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      console.log(response.data, "response favorites")
      setProductos(response.data.data)
    })
    .catch(function (error) {
      console.log(error ,"getProducts");
    });
  }
  
  const quitFavorites = (id) => {
    var options = {
      method: 'DELETE',
      url: 'https://abarrotes.msalazar.dev/node/' +  id,
      params: {'': '', _format: 'json'},
      headers: {'Content-Type': 'application/json', Authorization: 'Basic Og=='},
    };
    axios.request(options).then(function (response) {
      response.data.field_visible = false
      getProducts()
    }).catch(function (error) {
    }); 
    playSoundQuit()    
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
        field_isactive: [{value: false}]
      }
    };
    axios.request(options).then(function (response) {
    }).catch(function (error) {
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
 
  useEffect(() => {
   getProducts()
  }, [])
  return (
    <ScrollView>
      <Layout style={{  display:"flex", flexDirection: "row", justifyContent: "center", flexWrap:"wrap", gap:10  }}>
        {inventoryFavorites.map((producto, index) => {
          // console.log(inventoryFavorites)
          return (
            <Card key={index} style={[styles.cards]}>
              <MaterialCommunityIcons  
                name='heart'
                style={{color: "red", alignSelf: "flex-end", marginLeft: 90}} 
                size={30}
                onPress={()=>{
                  quitFavorites(
                    producto.attributes.drupal_internal__nid,
                    index,
                  ),
                  setEstado(!estado)
                  setIsActive( producto.attributes.field_id_producto)
                 
                }}
              />
              <Image               
                source={{uri: producto.attributes.field_imagen_producto}} 
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

export default Favorites

const styles = StyleSheet.create({
  hiddeCard: {
   display: "none",
   backgroundColor: "red"
  }
})
