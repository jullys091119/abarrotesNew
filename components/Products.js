import React,{useEffect,useState} from 'react'
import { Layout, Text, Card, Button, Avatar } from "@ui-kitten/components";
import { StyleSheet,Image,ScrollView, LayoutAnimation } from 'react-native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
const URL_BASE = 'https://abarrotes.msalazar.dev/jsonapi/node/img_proveedores?include=field_img_proveedores'

const Products = ({navigation}) => {

  const [productos, setProductos] = useState({})
  const [imagen,setImagen] = useState({})
  let inventario = Object.values(productos)

  const getProducts = () => {
    //llamada axios para obtener los productos
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

  const openProducts = (data) => {
    switch(data) {
      case 1: {
        navigation.replace('ModalBimbo')
        break;
      }
     
    }
  }

  useEffect(()=> {
    getProducts()  
   },[])
  
  return (
    <Layout>
      <ScrollView>
        <Layout style={{  display:"flex", flexDirection: "row", justifyContent: "center", flexWrap:"wrap", gap:10  }}>
          {inventario.map((producto, index) => {
            return (
              <Animatable.View key={index} animation="flipInX" duration={2000}>
                <Card  style={{width: 160, height: 150, marginVertical: 10}} onPress={()=>{openProducts(index + 1)}}>
                  <Image               
                    source={{uri: `https://abarrotes.msalazar.dev` + imagen.included[index].attributes.uri.url}} 
                    style={{
                      width: 120,
                      height: 100,
                      alignSelf: "center",
                      borderRadius: 10,
                      marginVertical: 10
                    }}
                    resizeMode="contain"
                  />
                </Card>
              </Animatable.View>
            );
          })}
        </Layout>
      </ScrollView>
    </Layout>
  );
}
const styles = StyleSheet.create({

  
});

export default Products