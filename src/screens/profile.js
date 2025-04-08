import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Profile() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20 }}>Profil Sayfası</Text>

      <TouchableOpacity
      onPress={()=>{navigation.navigate("Prize")}}
      >
        <Text>basss</Text>
      </TouchableOpacity>
    </View>
  );
}
