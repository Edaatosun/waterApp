import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, SafeAreaView, FlatList } from "react-native";
import ProgressCircle from "../components/progressCircle";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from 'react-native';
import { auth } from "../../firebase";
import { getLastAdd } from "../storage/database";


export default function Home() {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state. Check:',
  ]);
  const [drink, setDrink] = useState(0);
  const [selectedCup, setSelectedCup] = useState(200); // Varsayılan bardak 200ml
  const [amount,setAmount] = useState(2000);
  const navigation = useNavigation();

  useEffect(()=>{
    const getAmount=async()=>{
      const userId = auth.currentUser.uid;
      const lastGoal = await getLastAdd("Amount",userId);
      setAmount(lastGoal.amount);
    };
    getAmount();
  },[]);

  const isEqual = amount === drink;

  const handleDrink = () => {
    setDrink(prev => Math.min(prev + selectedCup, amount)); // Maksimum amount aşılmamalı
  };

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
        <ProgressCircle drink={drink} amount={amount} className="mb-10" />
        <View className=" mt-3 items-center justify-center">
          <Text className=" font-bold">
            <Text style={{ fontWeight: isEqual ? 'bold' : 'normal', fontSize: 24, color: isEqual ? 'green' : 'black', }}>{drink} </Text>
            <Text className="font-bold text-2xl text-black"> / </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 24, color: isEqual ? 'green' : 'gray', }}> {amount}</Text>
          </Text>
        </View>

        <View className="flex-row justify-center items-center mt-3">
          {/* Drink Butonu */}
          <TouchableOpacity onPress={handleDrink} className="rounded-full py-2 px-16 bg-blue-600 items-center justify-center">
            <Text className="text-white text-lg">Drink ({selectedCup})</Text>
          </TouchableOpacity>

          {/* Su Bardağı İkonu */}
          <TouchableOpacity
            onPress={() => navigation.navigate('CupSelection', { setSelectedCup })} // setSelectedCup fonksiyonunu parametre olarak geçiriyoruz
            className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center ml-5">
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

