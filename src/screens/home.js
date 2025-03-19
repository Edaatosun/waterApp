import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ProgressCircle from "../components/progressCircle";
import Icon from "react-native-vector-icons/FontAwesome6";
export default function Home (){
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E5E5E5"}}>
      <View style = {{height:"48%", width : "95%", backgroundColor: "white", alignItems: "center", marginBottom:20, marginTop:80, borderRadius:20}}>
       <ProgressCircle />
       <View className = "flex-row ">
        <TouchableOpacity className = "rounded-full py-2 px-16 bg-blue-600  items-center justify-center mb-10">
            <Text className = "text-{#ffffff}, text-lg">Drink</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" border-2 border-gray-300 rounded-full p-3 ">
            <Icon name = "glass-water" size={30}  ></Icon>
        </TouchableOpacity>
       </View>
       
      </View>
      <View style = {{height:"40%", width : "95%", backgroundColor: "white", alignItems: "center",}}>
       
       <Text> History</Text>

      </View>
       

    </View>
  );
};



