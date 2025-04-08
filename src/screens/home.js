import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, SafeAreaView, FlatList, Image, Dimensions, Alert } from "react-native";
import ProgressCircle from "../components/progressCircle";
import Icon from "react-native-vector-icons/Ionicons";
import IconWater from "react-native-vector-icons/FontAwesome6"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LogBox } from 'react-native';
import { auth } from "../../firebase";
import { addItem, getItem, getLastAdd, queryGoalId, updateItem } from "../storage/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RightIcon from "react-native-vector-icons/AntDesign"
import { ScrollView } from "react-native-gesture-handler";
import { DrinkWaterModel } from "../model/drinkWater";
import { GoalModel } from "../model/goal";
import { DailyProgressModel } from "../model/dailyProgressModel";
import SeeAllHistoryPage from "./allHistoryPage";

export default function Home() {
  const heightWindow = Dimensions.get("window").height;
  LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state. Check:']);
  const [drink, setDrink] = useState(0);  // Toplam içilen miktar
  const [amount, setAmount] = useState(2000);  // Hedef miktar
  const navigation = useNavigation();
  const [historyObject, setHistoryObject] = useState();
  const [selectedCup, setSelectedCup] = useState({
    ml: 200,
    name: "Varsayılan Bardak",
    url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F3.png?alt=media&token=479d07e7-f10d-4dde-825a-4f854af595a4"
  }); // Seçilen bardak (cup objesi)
  const userId = auth.currentUser.uid;
  const [isEqual, setIsEqual] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isPrizee, setIsPrizee] = useState(false);  // Prize durumu

  // Prize kontrolünü AsyncStorage'dan alalım
  useEffect(() => {
    const checkPrizeStatus = async () => {
      const prizeStatus = await AsyncStorage.getItem("isPrize");
      if (prizeStatus === 'true') {
        setIsPrizee(true); // Prize durumu true ise set et
        setIsButtonDisabled(true); // Butonu devre dışı bırak
        resetGoalData();
      } else {
        // Yeni günse hedefleri sıfırla
        const lastResetDate = await AsyncStorage.getItem('lastResetDate');
        const currentDate = new Date().toDateString();
        if (lastResetDate !== currentDate) {
          await AsyncStorage.setItem('lastResetDate', currentDate);
          resetGoalData(); // Hedefleri sıfırlama
        }
      }
    };
    checkPrizeStatus();
  }, []); // Sayfa ilk yüklendiğinde çalışır

  // Drink ve amount karşılaştırmasını yapalım
  useEffect(() => {
    if (amount === drink) {
      setIsEqual(true);
    }
  }, [amount, drink]);

  useEffect(() => {
    const getAmount = async () => {
      const lastGoal = await getLastAdd("Amount", userId);
      setAmount(lastGoal.amount);
    };
    historyList();
    getAmount();
  }, [isEqual]);

  // Drink işlemi ve AsyncStorage kaydetme
  const handleDrink = async () => {
    const newDrink = Math.min(drink + selectedCup.ml, amount);
    setDrink(newDrink);
    await AsyncStorage.setItem("savedDrink", JSON.stringify({ userId: userId, savedDrink: newDrink }));
  };

  const historyDrink = async () => {
    const createdAt = getCurrentTime();
    const lastGoal = await getLastAdd("Amount", userId);
    const drinkWater = new DrinkWaterModel(selectedCup, createdAt, lastGoal.goal_id);
    const success = await addItem("drinkWater", drinkWater);
    if (success) {
      Alert.alert("Aferinn :)");
    }
  };

  const historyList = async () => {
    const lastGoal = await getLastAdd("Amount", userId);
    const success = await queryGoalId("drinkWater", lastGoal.goal_id);
    if (success) {
      setHistoryObject(success);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes}`;
  };

  const resetGoalData = async () => {
    setDrink(0);
    setAmount(0);
    setHistoryObject(null);
    setSelectedCup({ ml: 0, name: "", url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F3.png?alt=media&token=479d07e7-f10d-4dde-825a-4f854af595a4" });
    await AsyncStorage.setItem("savedDrink", JSON.stringify({ userId: userId, savedDrink: 0 }));
    navigation.navigate("Prize");
  };

  const isPrize = async () => {
    if (isEqual) {
      setIsButtonDisabled(true);
      const lastGoal = await getLastAdd("Amount", userId);
      const updateData = new GoalModel(userId, lastGoal.goal_id, lastGoal.amount, lastGoal.createdAt, lastGoal.resetAt, true);
      const updatedData = await updateItem("Amount", lastGoal.docId, updateData);
      if (updatedData) {
        const now = new Date();
        const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
        const dayName = days[now.getDay()];
        const date = `${dayName} - ${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const data = new DailyProgressModel(userId, lastGoal.goal_id, date, drink);
        await addItem("dailyProgressModel", data);
        await AsyncStorage.setItem("isPrize", 'true'); // Prize durumu true olarak kaydet
        resetGoalData();
      }
    }
  };

  return (
    <SafeAreaView className="bg-gray-100">
      <View className="w-full flex-row items-center justify-between px-5 py-3 mt-5">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={45} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Water App</Text>
        <View style={{ width: 30 }} />
      </View>
      {/* Üst Card */}
      <View className="justify-center items-center">
        <View className="h-[380] w-[95%] bg-white rounded-xl items-center">
          <ProgressCircle drink={drink} amount={amount} />
          <View className="mt-3 items-center justify-center">
            <Text className="font-bold">
              <Text style={{ fontWeight: isEqual ? 'bold' : 'normal', fontSize: 24, color: isEqual ? 'green' : 'black' }}>{drink} </Text>
              <Text className="font-bold text-2xl text-black"> / </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 24, color: isEqual ? 'green' : 'gray' }}>{amount}</Text>
            </Text>
          </View>
          <View className="flex-row justify-center items-center mt-3">
            <TouchableOpacity onPress={() => { handleDrink(); historyDrink(); historyList(); isPrize(); }}
              className={`rounded-full py-2 px-16 ${isButtonDisabled ? 'bg-gray-400' : 'bg-blue-600'} items-center justify-center`}
              disabled={isButtonDisabled}>
              <Text className="text-white text-lg">
                {isButtonDisabled ? 'Hedef Tamamlandı' : `İçmek (${selectedCup.ml} mL)`}
              </Text>
            </TouchableOpacity>
            {/* Cup Seçim Butonu */}
            <TouchableOpacity onPress={() => navigation.navigate('CupSelection')}
              className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center ml-5">
              <Image style={{ width: 30, height: 30 }} source={{ uri: selectedCup.url }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Geçmiş Kartı */}
      <View className="justify-center items-center mt-10">
        <View className="w-[95%] bg-white rounded-xl p-5 shadow-md pb-5">
          <View className="flex-row w-full justify-between">
            <Text className="text-xl font-bold">Geçmiş</Text>
            <TouchableOpacity onPress={() => { navigation.navigate("AllHistoryPage") }} className="flex-row">
              <Text className="text-lg font-bold mr-2 text-blue-400">Tümünü Gör</Text>
              <RightIcon name="arrowright" size={30} color={"#60A5FA"} />
            </TouchableOpacity>
          </View>
          <View className="border w-full mt-2 border-gray-400 opacity-30" />
          {historyObject && historyObject.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 220 }}>
              {historyObject
                .sort((a, b) => {
                  const [hourA, minA] = a.drinkClock.split(':').map(Number);
                  const [hourB, minB] = b.drinkClock.split(':').map(Number);
                  return hourB - hourA || minB - minA;
                })
                .map((item, index) => (
                  <View key={index}>
                    <View className="flex-row items-center w-full min-h-[70] justify-between">
                      <View className="flex-row items-center justify-center">
                        <View className="w-[70] items-center justify-center">
                          <Image style={{ width: 40, height: 40 }} source={{ uri: item.Cup.url }} />
                        </View>
                        <View>
                          <Text className="text-lg font-bold">Water</Text>
                          <Text className="align-bottom">{item.drinkClock}</Text>
                        </View>
                      </View>
                      <Text className="text-lg font-bold p-5">{item.Cup.ml} mL</Text>
                    </View>
                    <View className="border w-full mt-2 border-gray-400 opacity-30" />
                  </View>
                ))}
            </ScrollView>
          ) : (
            <View className="justify-center items-center">
              <Image className="w-[100] h-[210]" source={require("../../assets/images/noDoc.png")} />
              <Text className="text-gray-400 text-lg font-bold">Geçmişiniz bulunmamaktadır.</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
