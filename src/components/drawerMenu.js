import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../screens/profile";
import Home from "../screens/home";
import GoalsDrawer from "../screens/goalsDrawer";
import HistoryProgressPage from "../screens/historyProgressPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLastAdd } from "../storage/database";
import { auth } from "../../firebase";

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
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      
      {/* Eğer hedef tamamlanmamışsa GoalsDrawer görünür */}
      {!isCompleted && <Drawer.Screen name="GoalDrawer" component={GoalsDrawer} />}
      
      <Drawer.Screen name="HistoryProgressPage" component={HistoryProgressPage} />
    </Drawer.Navigator>
  );
}
