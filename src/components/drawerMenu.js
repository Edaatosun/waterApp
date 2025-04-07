import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../screens/profile";
import Home from "../screens/home";
import GoalsDrawer from "../screens/goalsDrawer";
import HistoryProgressPage from "../screens/historyProgressPage";

const Drawer = createDrawerNavigator();

export default function DrawerMenu() {
  return (
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Home" component={Home}/>{/*options={{ drawerItemStyle: { display: 'none' } }}*/}
        <Drawer.Screen name="Profile" component={Profile}></Drawer.Screen>
        <Drawer.Screen name="GoalDrawer" component={GoalsDrawer}></Drawer.Screen>
        <Drawer.Screen name="HistoryProgressPage" component={HistoryProgressPage}></Drawer.Screen>
      </Drawer.Navigator>
  );
}
