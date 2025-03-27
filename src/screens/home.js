import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, SafeAreaView, FlatList, Image, Dimensions, Alert } from "react-native";
import ProgressCircle from "../components/progressCircle";
import Icon from "react-native-vector-icons/Ionicons";
import IconWater from "react-native-vector-icons/FontAwesome6"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LogBox } from 'react-native';
import { auth } from "../../firebase";
import { addItem, getAllItems, getItem, getLastAdd } from "../storage/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RightIcon from "react-native-vector-icons/AntDesign"
import { ScrollView } from "react-native-gesture-handler";
import { DrinkWaterModel } from "../model/drinkWater";


export default function Home() {
  const heightWindow = Dimensions.get("window").height;
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state. Check:',
  ]);
  const [drink, setDrink] = useState(0);// toplam içilen miktar
  const [amount, setAmount] = useState(2000);
  const navigation = useNavigation();
  const [noHistoryMessage, setNoHistoryMessage] = useState(); // Görev yok mesajı için state
  const [historyObject, setHistoryObject] = useState();
  const [selectedCup, setSelectedCup] = useState({
    ml: 200,
    name: "Varsayılan Bardak",
    url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F3.png?alt=media&token=479d07e7-f10d-4dde-825a-4f854af595a4"
  }); //seçilen bardak (cup objesi)
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const getAmount = async () => {

      const lastGoal = await getLastAdd("Amount", userId);
      setAmount(lastGoal.amount);
    };
    historyList();
    getAmount();
  }, []);

  useFocusEffect( // burada ekran her açıldığında çalışmasını sağlayan fonk.
    React.useCallback(() => {
      const getMlLocal = async () => {
        console.log("hayır burdayımm");
        const localCup = await AsyncStorage.getItem("localSelectedCup");
        if (localCup) {
          try {
            const selectedLocalCup = JSON.parse(localCup);

            // Eğer veri doğru şekilde parse edildi ve ml değeri varsa
            if (selectedLocalCup && selectedLocalCup.ml) {
              console.log("Seçilen bardak ml değeri:", selectedLocalCup.ml);
              setSelectedCup(selectedLocalCup);
            } else {
              console.log("Geçersiz bardak verisi, varsayılan bardak atandı.");
              setSelectedCup({ ml: 200, name: "Varsayılan Bardak" }); // Varsayılan değer
            }
          } catch (error) {
            console.error("JSON Parse Hatası:", error);
            setSelectedCup({ ml: 200, name: "Varsayılan Bardak" }); // Varsayılan değer
          }
        }


        const savedDrink = await AsyncStorage.getItem("savedDrink");
        if (savedDrink) {
          const localSavedDrink = JSON.parse(savedDrink);
          console.log(localSavedDrink);
          setDrink(localSavedDrink.savedDrink);
          console.log(drink);
        }
        else {
          return;
        }
      };


      getMlLocal();
    }, [])
  )
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Saat ve dakika 2 basamağa tamamlansın (örneğin 8:05 yerine 08:05)
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
  };

  const historyDrink = async () => {
    console.log("fonkk girildiii..");
    const createdAt = getCurrentTime();
    console.log(createdAt);
    const drinkWater = new DrinkWaterModel(selectedCup, createdAt);
    const success = await addItem("drinkWater", drinkWater);
    if (success) {
      Alert.alert("Aferinn :)");
      console.log("su içildi");
    }

  };

  const isEqual = amount === drink;

  //progress bilgisi için tuttuğumuz içilen miktar 
  const handleDrink = async () => {
    const userId = auth.currentUser.uid;
    // Yeni drink miktarını hesapla
    //setDrink(prev => Math.min(prev + selectedCup, amount)); bu hatalı bir kod oldu çünkü
    // bu hemen çalışıyor ancak setDrink asenkron olduğu için hemen güncellenmiyor.
    // bu durumda, drink eski değerinde kalıyor.
    const newDrink = Math.min(drink + selectedCup.ml, amount); // Maksimum amount aşılmamalı
    setDrink(newDrink); // Yeni drink değerini state'e set et

    // AsyncStorage'e yeni drink değerini kaydet
    await AsyncStorage.setItem("savedDrink", JSON.stringify({ userId: userId, savedDrink: newDrink }));
  };


  const historyList = async () => {

    const success = await getAllItems("drinkWater",)
    if (success) {
      setHistoryObject(success);
      console.log("Geçmiş veriler başarılı şekilde alındı:", success);
    }

  };

  return (
    <SafeAreaView className="bg-gray-100">


      {/* Üst Menü */}
      <View className="w-full flex-row items-center justify-between px-5 py-3 mt-5">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={45} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Water App</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* ilk card yapısı */}
      <View className="justify-center items-center " >
        <View className="h-[380] w-[95%] bg-white rounded-xl items-center">
          <ProgressCircle drink={drink} amount={amount} />

          <View className=" mt-3 items-center justify-center">
            <Text className=" font-bold">
              <Text style={{ fontWeight: isEqual ? 'bold' : 'normal', fontSize: 24, color: isEqual ? 'green' : 'black', }}>{drink} </Text>
              <Text className="font-bold text-2xl text-black"> / </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 24, color: isEqual ? 'green' : 'gray', }}> {amount}</Text>
            </Text>
          </View>

          <View className="flex-row justify-center items-center mt-3">
            {/* Drink Butonu */}
            <TouchableOpacity onPress={() => { handleDrink(); historyDrink(); historyList(); }}
              className="rounded-full py-2 px-16 bg-blue-600 items-center justify-center">
              <Text className="text-white text-lg">İçmek ({selectedCup.ml})</Text>
            </TouchableOpacity>

            {/* Su Bardağı İkonu */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CupSelection')}
              className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center ml-5">
              <Image
                style={{ width: 30, height: 30, alignItems:"center", marginStart:2}}
                source={{ uri: selectedCup.url }}
              />
            </TouchableOpacity>

          </View>

        </View>
      </View>

      <View className="justify-center items-center mt-10">
        <View className="w-[95%] bg-white rounded-xl p-5  shadow-md pb-5">
          {/* Head */}
          <View className="flex-row w-full justify-between">
            <Text className="text-xl font-bold">Geçmiş</Text>
            <TouchableOpacity className="flex-row">
              <Text className="text-lg font-bold mr-2 text-blue-400">Tümünü Gör</Text>
              <RightIcon name="arrowright" size={30} color={"#60A5FA"} />
            </TouchableOpacity>
          </View>
          <View className="border w-full mt-2 border-gray-400 opacity-30" />

          {historyObject && historyObject.length > 0 ? (
            <ScrollView style={{ maxHeight: 220 }}>
              {historyObject.map((item, index) => (
                <View key={index}>
                  <View className="flex-row items-center w-full min-h-[70] justify-between">
                    <View className="flex-row items-center justify-center">
                      <View className="w-[70] items-center justify-center">
                        <Image
                          style={{ width: 40, height: 40 }}
                          source={{ uri: item.Cup.url }}
                        />
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

