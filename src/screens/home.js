import React from "react";
import { View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import ProgressCircle from "../components/progressCircle";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const drink = 0;
  const amount= 1500;
  const navigation = useNavigation();
  const isEqual = amount === drink;
  return (
    <SafeAreaView className="flex-1 bg-[#E5F3F0] items-center">
      {/* Üst Menü */}
      <View className="w-full flex-row items-center justify-between px-5 py-3 mt-10">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={45} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Water App</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Progress ve Drink Butonu */}
      <View className="flex-1 w-[95%] bg-white items-center rounded-2xl p-16 shadow-md">
        <ProgressCircle drink={drink} amount={amount} className="mb-10"/>

        <View className=" mt-3 items-center justify-center">
          <Text className=" font-bold">
            <Text style={{fontWeight: isEqual ? 'bold' : 'normal',fontSize: 24,color: isEqual ? 'green' : 'black',}}>{drink} </Text>
            <Text className="font-bold text-2xl text-black" >
              {' / '}
            </Text>
            <Text style={{fontWeight: 'bold',fontSize: 24,color: isEqual ? 'green' : 'gray',}}> {amount}</Text>
          </Text>
        </View>

        <View className="flex-row justify-center items-center mt-3">
          {/* Drink Butonu */}
          <TouchableOpacity className="rounded-full py-2 px-16  bg-blue-600 items-center justify-center">
            <Text className="text-white text-lg">Drink</Text>
          </TouchableOpacity>

          {/* Su Bardağı İkonu */}
          <TouchableOpacity className="w-12 h-12 rounded-full border-2  border-gray-400 flex items-center justify-center ml-5">
            <Icon name="water" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* History Bölümü */}
      <View className="flex-1 w-[95%] bg-white items-center rounded-2xl p-5 mt-5 shadow-md">
        <Text className="text-lg font-bold">History</Text>
      </View>
    </SafeAreaView>
  );
}
