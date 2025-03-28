import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchData, getItem, getLastAdd, updateItem } from "../storage/database";
import { GoalModel } from "../model/goal";
import { DailyProgressModel } from "../model/dailyProgressModel";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  useEffect(() => {
    const checkLoginStatus = async () => {
      const userSession = await AsyncStorage.getItem('userSession');
      if (userSession) {
        console.log("sesiionnnn");
        const session = JSON.parse(userSession);
        if (session.isLoggedIn) {
          const userId = session.userId; // session'dan userId'yi alıyoruz
          console.log("yeşil", userId);
          // Firestore'dan kullanıcıyı kontrol et
          setLoading(true);
          const userDocRef = await getItem("users", userId); // "users" koleksiyonundaki ilgili belgeyi al
          if (userDocRef) {
            console.log("user Varr");
            const docs = await fetchData("Amount", userId);
            console.log(docs);
            if (docs) {
              console.log("userİdye ait hedef col. mevcutt")
              console.log(docs);
              const lastDoc = await getLastAdd("Amount", userId);
              console.log(lastDoc);
              const currentTime = Date.now();
              const resetAt = lastDoc.resetAt;
              if (currentTime >= resetAt) {
                try {
                  const updateData = new GoalModel(userId, lastDoc.goal_id, lastDoc.amount, lastDoc.createdAt, lastDoc.resetAt, true);
                  const updatedData = await updateItem("Amount", lastDoc.docId, updateData);
                  console.log("güncellendiiii");
                  console.log("güncellenen hedef: ", updatedData)
                  if (updateData) {

                    const now = new Date();

                    // Haftanın gününü almak için
                    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
                    const dayName = days[now.getDay()];

                    // Tarih ve saat formatı
                    const date = `${dayName} - ${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                    console.log(date); // Örneğin: "Perşembe - 28.03.2025 - 11:49"

                    const data = new DailyProgressModel(userId, lastGoal.goal_id, date, drink);
                    const dailyProgressStored = await addItem("dailyProgressModel", data);
                    await AsyncStorage.setItem("savedDrink", JSON.stringify({ userId: userId, savedDrink: 0 }));
                    navigation.navigate("Goals");

                  }

                } catch (error) {
                  console.error("Güncelleme sırasında hata oluştu:", error);
                }
              } else {
                console.log("Hoşgeldiniz");
                Alert.alert("Başarılı", "Giriş başarılı.");
                navigation.navigate("Drawer"); // Ana sayfaya yönlendirme
              }
            } else {
              navigation.navigate("Goals");
            }
          }
        } else {
          navigation.navigate("Login"); // Eğer kullanıcı giriş yapmamışsa Login sayfasına yönlendir
        }
      } else {
        navigation.navigate("Login"); // Eğer session yoksa Login sayfasına yönlendir
      }
    }
    checkLoginStatus();
  }, []);

  const signIn = async () => {
    if (!email || !password) {
      return Alert.alert("HATA", "E-posta ve şifre boş olamaz.");
    }
    setLoading(true);

    try {

      // Firestore'dan kullanıcıyı kontrol et
      const userDocRef = await getItem("users", userId); // "users" koleksiyonundaki ilgili belgeyi al

      if (userDocRef) {
        // Kullanıcı Firestore'da varsa giriş başarılı
        await AsyncStorage.setItem(
          "userSession",
          JSON.stringify({ isLoggedIn: true, userId: userId })
        );

        const docs = await fetchData("Amount", userId);
        if (docs) {
          const lastDoc = await getLastAdd("Amount", userId);
          const currentTime = Date.now();
          const resetAt = lastDoc.resetAt;
          if (currentTime >= resetAt) {
            const updateData = GoalModel(lastDoc.userId, lastDoc.goal_id, lastDoc.amount, lastDoc.createdAt, lastDoc.resetAt, true);
            await updateItem("Amount", lastDoc.docId, updateData);
            console.log("güncellendiiii");
            if (updateData) {

              const now = new Date();

              // Haftanın gününü almak için
              const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
              const dayName = days[now.getDay()];

              // Tarih ve saat formatı
              const date = `${dayName} - ${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

              console.log(date); // Örneğin: "Perşembe - 28.03.2025 - 11:49"

              const data = new DailyProgressModel(userId, lastGoal.goal_id, date, drink);
              const dailyProgressStored = await addItem("dailyProgressModel", data);
              await AsyncStorage.setItem("savedDrink", JSON.stringify({ userId: userId, savedDrink: 0 }));
              navigation.navigate("Goals");

            }
          } else {
            console.log("Hoşgeldiniz");
            Alert.alert("Başarılı", "Giriş başarılı.");
            navigation.navigate("Home"); // Ana sayfaya yönlendirme
          }
        } else {
          navigation.navigate("Goals");
        }

      } else {
        // Kullanıcı Firestore'da yoksa giriş reddedilir
        Alert.alert("HATA", "Kullanıcı veritabanında bulunamadı. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Giriş Hatası:", error.message);

      if (error.code === "auth/user-not-found") {
        Alert.alert("HATA", "Kullanıcı bulunamadı.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("HATA", "Yanlış şifre.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("HATA", "Geçersiz e-posta adresi.");
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert("HATA", "Kullanıcı adı veya şifre yanlış /n Lütfen tekrar deneyiniz");
      } else {
        Alert.alert("HATA", "Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-4">
      <Image className="w-72 h-48 mb-6" source={require("../../assets/images/logo.png")} />

      {/* Email Input */}
      <TextInput
        className="border-2 border-blue-500 bg-white rounded-lg px-4 py-3 w-full max-w-sm"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="gray"
      />

      <View className="relative w-full max-w-sm mt-4">
        <TextInput
          className="border-2 border-blue-500 bg-white rounded-lg px-4 py-3 w-full pr-10"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          placeholderTextColor="gray"
        />

        {/* Göz İkonu */}
        <TouchableOpacity
          className="absolute right-4 top-2 -translate-y-1/2"
          onPress={() => setSecureText(!secureText)}
        >
          <Icon name={secureText ? "eye-off" : "eye"} size={30} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <View className="w-full max-w-sm mt-5">
        <TouchableOpacity>
          <Text className="text-gray-600 opacity-50 text-right text-base">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <View className="w-full max-w-sm mt-5">
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text className="text-gray-600 opacity-50 text-right text-base">KAYIT</Text>
        </TouchableOpacity>
      </View>

      {/* Login Butonu */}
      <TouchableOpacity
        onPress={signIn}
        className="bg-[#4E5496] px-6 py-2 rounded-lg mt-4 w-full max-w-sm items-center"
      >
        <Text className="text-white  text-lg">LOGIN</Text>
      </TouchableOpacity>

      {loading && (
        <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={"large"} color={"#0000ff"} />
        </View>

      )}
    </View>
  );
}
