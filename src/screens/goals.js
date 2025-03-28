import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {TouchableOpacity, View, Text, Image } from "react-native";
import { GoalModel } from "../model/goal"
import {addItem} from "../storage/database";
import { auth } from "../../firebase";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

export default function Goals() {
    const [goal, setGoal] = useState(2000); // Başlangıç hedefi 2000 mL
    const navigation = useNavigation();
    const user = auth.currentUser;
    const userId = user.uid;

    const addGoal = async () => {
        console.log("goall ekleme fonskiyonundayımmmm");
        const createdAt = Date.now();
        const createdAtDate = new Date(createdAt);
        // Yalnızca yılı, ayı ve günü alarak gece 00:00'a sıfırla
        const resetAtDate = new Date(createdAtDate.getFullYear(), createdAtDate.getMonth(), createdAtDate.getDate() + 1); 
        console.log("heloooooooooo",resetAtDate);
        const resetAt = resetAtDate.getTime(); // Timestamp olarak al
        const goal_id = uuid.v4();
        const goalModal = new GoalModel(userId,goal_id, goal, createdAt, resetAt, false);
    
        console.log(goalModal); 
        const success = await addItem("Amount",goalModal);
        if(success){
            Alert.alert("Başarılı", "Hedef tanımlandı.");
            navigation.navigate("Drawer");
        }
        else{
            console.log("hata");
        }
       
    }
    const increaseGoal = () => {
        if (goal < 5000) setGoal(goal + 250); // 250 mL artır
    };

    const decreaseGoal = () => {
        if (goal > 500) setGoal(goal - 250); // 250 mL azalt
    };

    const presetGoals = [1000,1500, 2000, 2500, 3000];

    return (
        <View style={{ justifyContent:"center" , alignItems: "center",backgroundColor:"#FFF7F7", flex:1, }}>
            <Text style={{ fontSize: 20, fontWeight: "bold",marginTop:70, margin:30}}>
                Bugün ki Hedefiniz
            </Text>

               {/* Ön Tanımlı Seçenekler */}
               <View style={{ flexDirection: "row", marginBottom: 20,}}>
                {presetGoals.map((preset) => (
                    <TouchableOpacity 
                        key={preset}
                        onPress={() => setGoal(preset)}
                        style={{
                            width:60,
                            padding: 10,
                            backgroundColor: goal === preset ? "#007bff" : "#eee",
                            borderRadius: 10,
                            margin: 8,
                            alignItems:"center"
                        }}>
                        <Text style={{ color: goal === preset ? "#fff" : "#000", fontSize: 18 }}>
                            {preset / 1000} L
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ marginBottom: 10,alignItems:"center", justifyContent:"center"}}>
                <Image style={{height:270, width:265,marginLeft:40}} source={require("../../assets/images/water.png")}></Image>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"center", marginTop:70 }}>
                <TouchableOpacity 
                    onPress={decreaseGoal} 
                    style={{ padding: 15, backgroundColor: "#ddd", borderRadius: 10, marginRight: 30 }}>
                    <Text style={{ fontSize: 20 }}>−</Text>
                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: 28, // Daha büyük font
                        fontWeight: "bold", // Kalın yazı
                        textAlign: "center",
                        width: 100, // Daha geniş alan
                        borderBottomWidth: 1, // Kalın alt çizgi
                        borderColor: "#007bff",
                        paddingVertical: 5, // İç boşluk ekleme
                    }}
                >
                    {goal}
                </Text>

                <Text style={{ fontSize: 25, marginLeft: 5, fontWeight:"bold" }}>mL</Text>

                <TouchableOpacity 
                    onPress={increaseGoal} 
                    style={{ padding: 15, backgroundColor: "#ddd", borderRadius: 10, marginLeft: 30}}>
                    <Text style={{ fontSize: 20 }}>+</Text>
                </TouchableOpacity>
            </View>

           

            <View style={{ flex: 1, width: "90%", justifyContent: "flex-end", alignItems: "center", paddingBottom: 20 }}>
                <TouchableOpacity
                    onPress={() => addGoal()} 
                    style={{
                        width: "90%", 
                        padding: 15, 
                        backgroundColor: "#007bff", 
                        borderRadius: 10, 
                        alignItems: "center"
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18 }}>Hedef Belirle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
