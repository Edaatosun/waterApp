import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerItemList } from "@react-navigation/drawer";
import Profile from "../screens/profile";
import Home from "../screens/home";
import GoalsDrawer from "../screens/goalsDrawer";
import HistoryProgressPage from "../screens/historyProgressPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLastAdd } from "../storage/database";
import { auth } from "../../firebase";
import Graph from "../screens/graph";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, Text, View } from "react-native";

const Drawer = createDrawerNavigator();

export default function DrawerMenu() {
  // Hedef tamamlandıysa isCompleted true olacak, aksi takdirde false olacak
  const [isCompleted, setIsCompleted] = useState(false);
  const userId = auth.currentUser.uid;

  // AsyncStorage'dan hedefin tamamlanıp tamamlanmadığını kontrol eden fonksiyon
  const checkGoalCompletion = async () => {
    try {

      const savedCompletedProcess = await AsyncStorage.getItem("completedGoalProcess");
      if (savedCompletedProcess) {
        const parsedProcess = JSON.parse(savedCompletedProcess); 
        // savedCompletedProcess'in goalId'sini kontrol ediyoruz
        // Eğer goalId eşleşiyorsa ve isCompleted true ise, hedef tamamlanmış kabul edilecek
        const savedGoalId = parsedProcess.goalId;
        const lastGoal = await getLastAdd("Amount", userId); // lastGoal'ı alıyoruz, userId ile
        if (lastGoal && lastGoal.goal_id === savedGoalId && parsedProcess.isCompleted) {
          setIsCompleted(true); // Hedef tamamlanmış
        } else {
          setIsCompleted(false); // Hedef tamamlanmamış
        }
      }
    } catch (error) {
      console.error("Error checking goal completion:", error);
    }
  };

  useEffect(() => {
    checkGoalCompletion();  // Sayfa yüklendiğinde kontrolü yapıyoruz
  }, []);

  return (
    <Drawer.Navigator 
    drawerContent={(props)=><Content {...props}/>}
    initialRouteName="Home"
    screenOptions={{ 
      headerShown: false ,
      drawerLabelStyle:{
        fontSize:18
      }
    }}>
      <Drawer.Screen name="Home" component={Home} options={
       { title: "Anasayfa",
        drawerIcon:()=><FontAwesome name="home" size={26} color="black" />
       }}
      />
      <Drawer.Screen name="Profile" component={Profile} options={
       { title: "Profilim",
        drawerIcon:()=><MaterialIcons name="account-circle" size={26} color="black" />
       }}/>
      
      {/* Eğer hedef tamamlanmamışsa GoalsDrawer görünür */}
      {!isCompleted && <Drawer.Screen name="GoalDrawer" component={GoalsDrawer} options={
       { title: "Hedef Değiştir",
        drawerIcon:()=><MaterialIcons name="published-with-changes" size={26} color="black" />
       }} />}
      
      <Drawer.Screen name="HistoryProgressPage" component={HistoryProgressPage} options={
       { title: "Takvimim",
        drawerIcon:()=><FontAwesome name="calendar" size={26} color="black" />
       }}/>
      <Drawer.Screen name="Graph" component={Graph} options={
       { title: "Grafik",
        drawerIcon:()=><Entypo name="bar-graph" size={26} color="black" />
       }} />
    </Drawer.Navigator>
  );
}

const Content = (props) => {
  return (
    <View className="flex-1 bg-gray-200">
      <View className="bg-[#A5D3FF] items-center flex-1">
        <Image className="mt-5 h-[140] w-[200]" source={require("../../assets/images/logo.png")}/>
        <Text className="font-bold italic text-2xl">Velora</Text>
      </View>
      <View className="flex-[3] px-4 pt-6">
        <DrawerItemList {...props} />
      </View>
    </View>
  );
};

