import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, SafeAreaView, FlatList, Image, Dimensions, Alert } from "react-native";
import ProgressCircle from "../components/progressCircle"
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
import { DailyProgressModel } from "../model/dailyProgressModel"

export default function Home() {
  const heightWindow = Dimensions.get("window").height;
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state. Check:',
  ]);
  const navigation = useNavigation();
  const userId = auth.currentUser.uid;
  const [drink, setDrink] = useState(0);// toplam içilen miktar default 0 gelecek
  const [amount, setAmount] = useState(2000); // amount değeri  herhangi bir amount değeri yoksa default 0 gelecek.
  const [historyObject, setHistoryObject] = useState(null); // geçmiş için
  const [selectedCup, setSelectedCup] = useState({
    ml: 200,
    name: "Varsayılan Bardak",
    url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F3.png?alt=media&token=479d07e7-f10d-4dde-825a-4f854af595a4"
  }); //seçilen bardak (cup objesi) default olarak verildi. (buton içine yazılıyor.)
  const [isEqual, setIsEqual] = useState(false); // hedef ve amount değerleri eşit mi diye kontrol ediyor.
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // drink butonunun disabled ayarlıyor.

// amount ve completed için sayfa başlangıcı önemli veriler.////////
  useFocusEffect(
    React.useCallback(() => {
      const fetchDataAndCheckGoalStatus = async () => {
        const lastGoal = await getLastAdd("Amount", userId); // bugünün hedefini al
        if (lastGoal) {
          setAmount(lastGoal.amount); // hedefi setstate et.
          
          // eğer içilen değer ve hedef eşit ve  hedef completed değilse
          if (amount === drink && !lastGoal.completed) {
            setIsEqual(true); // eşitliği true yap ve bu isprize ı çalıştıracak aslında.
          } else if(amount === drink){
            setIsButtonDisabled(true); // sadece eşitlik bile olsa buton disabled yap.
          }
          else {
            setIsEqual(false); // hedef henüz tamamlanmadıysa ve eşit değilse eşitlik durumunu false yap.
          }
          
          // durum ne olursa olsun prize forceLink. çağır.
          isPrize();
        }
      };
  
      fetchDataAndCheckGoalStatus();
      historyList(); // her ekrana girildiğinde historyList listelenmeli.
    }, [amount, drink, isEqual]) // amount drink ve isEqual değerleri değişirse burdaki işlemleri tekrarla.
  );
  
 //////////////////////////////
 //// burası da seçtiğimiz bardak ve kaydedilen içme değeri var toplam içilen miktar kaydediliyor.
  useFocusEffect( 
    React.useCallback(() => {
      const getMlLocal = async () => {
        console.log("hayır burdayımm getMlLocal fonkkkk");
        const localCup = await AsyncStorage.getItem("localSelectedCup"); // seçilen cup değeri bunu localde tutuyoruz çünkü diğer taraftada setSelectedCup ı göndermek problem yaratıyor.
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

        // içilen miktarı alıp getiriyordu.
        const savedDrink = await AsyncStorage.getItem("savedDrink");
        if (savedDrink) {
          const localSavedDrink = JSON.parse(savedDrink);
          console.log("kaydedildiiiiiiiiiiiiiiiii:", localSavedDrink);
          setDrink(localSavedDrink.savedDrink);
          console.log(localSavedDrink.savedDrink); // direkt olarak drink yazsaydık eğer 
          // setState işlemleri asenkron çalışıyor eski değeri verebilir o yüzden güncel veriyi bu şekilde logluyoruz
        }
        else {
          return;
        }
      };


      getMlLocal();
    }, [])
  );
  /////////////////////////////////////////
//// history için gerekli fonk.///////
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
    const lastGoal = await getLastAdd("Amount", userId);
    console.log("Bugünkü hedefffff", lastGoal);
    console.log(lastGoal.goal_id);
    const drinkWater = new DrinkWaterModel(selectedCup, createdAt, lastGoal.goal_id);
    const success = await addItem("drinkWater", drinkWater);
    if (success) {
      Alert.alert("Aferinn :)");
      console.log("su içildi aferinnn şak şak şak");
    }

  };
 /// geçmişi listelemek için fonk.
  const historyList = async () => {
    const lastGoal = await getLastAdd("Amount", userId);
    console.log(lastGoal.goal_id);
    const success = await queryGoalId("drinkWater", lastGoal.goal_id)
    if (success) {
      setHistoryObject(success);
      console.log("Geçmiş veriler başarılı şekilde alındı:");
    }

  };
/////////////////////////////////////
  //progress bilgisi için tuttuğumuz içilen miktar 
  const handleDrink = async () => {
    // Yeni drink miktarını hesapla
    //setDrink(prev => Math.min(prev + selectedCup, amount)); bu hatalı bir kod oldu çünkü
    // bu hemen çalışıyor ancak setDrink asenkron olduğu için hemen güncellenmiyor.
    // bu durumda, drink eski değerinde kalıyor.
    const newDrink = Math.min(drink + selectedCup.ml, amount); // Maksimum amount aşılmamalı
    setDrink(newDrink); // Yeni drink değerini state'e set et

    // AsyncStorage'e yeni drink değerini kaydet
    // burası toplam içilen mmiktar her su içe işlmeinde çalışıyor.
    await AsyncStorage.setItem("savedDrink", JSON.stringify({ userId: userId, savedDrink: newDrink }));
  };


  /////////////////////////

// ödül alacak mı fonk.////
const isPrize = async () => {
  console.log("Prizeeeeeeeeeeeeeeeee");
  if (isEqual) { 
    setIsButtonDisabled(true); 
    const lastGoal = await getLastAdd("Amount", userId); 
    const now = new Date();
    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const dayName = days[now.getDay()];
    const date = `${dayName} - ${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    console.log(date); //  "Perşembe - 28.03.2025 - 11:49"
    // Create DailyProgressModel with the drink amount
    const data = new DailyProgressModel(userId, lastGoal.goal_id, date, drink);
    const dailyProgressStored = await addItem("dailyProgressModel", data); 
    if (dailyProgressStored) {
      navigation.navigate("Prize");
    } else {
      console.log("Error saving daily progress.");
    }
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


            <TouchableOpacity
              onPress={() => { handleDrink(); historyDrink(); historyList(); }}
              className={`rounded-full py-2 px-16 ${isButtonDisabled ? 'bg-gray-400' : 'bg-blue-600'} items-center justify-center`}
              disabled={isButtonDisabled} // Butonun devre dışı bırakılmasını burada kontrol ediyoruz
            >
              <Text className="text-white text-lg">
                {isButtonDisabled ? 'Hedef Tamamlandı' : `İçmek (${selectedCup.ml} mL)`}
              </Text>
            </TouchableOpacity>


            {/* Su Bardağı İkonu */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CupSelection')}
              className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center ml-5">
              <Image
                style={{ width: 30, height: 30, alignItems: "center", marginStart: 2 }}
                source={{ uri: selectedCup.url }}
              />
            </TouchableOpacity>

          </View>

        </View>
      </View>

      <View className="justify-center items-center mt-10">
          <View className="w-[95%] bg-white rounded-xl p-5  shadow-md pb-5">
            {/* Head  */}
            <View className="flex-row w-full justify-between">
              <Text className="text-xl font-bold">Geçmiş</Text>
              <TouchableOpacity onPress={() => { navigation.navigate("AllHistoryPage") }} className="flex-row">
                <Text className="text-lg font-bold mr-2 text-blue-400">Tümünü Gör</Text>
                <RightIcon name="arrowright" size={30} color={"#60A5FA"} />
              </TouchableOpacity>
            </View>
            <View className="border w-full mt-2 border-gray-400 opacity-30" />
  
            {historyObject && historyObject.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}
                style={{ maxHeight: 220 }}>
                {historyObject
                  .sort((a, b) => {
                    const [hourA, minA] = a.drinkClock.split(':').map(Number);
                    const [hourB, minB] = b.drinkClock.split(':').map(Number);
  
                    // Önce saatleri karşılaştır, eşitse dakikaları karşılaştır
                    return hourB - hourA || minB - minA;
                  })
                  .map((item, index) => (
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

