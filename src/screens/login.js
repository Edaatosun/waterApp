import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userSession = await AsyncStorage.getItem('userSession');
      if (userSession) {
        const session = JSON.parse(userSession);
        if (session.isLoggedIn) {
          // Oturum açılmışsa MainPage'e yönlendir
          navigation.navigate("Home");
        }
      }
    };

    checkLoginStatus();
  }, []);

  const signIn = async () => {
    if (!email || !password) {
      return Alert.alert("HATA", "E-posta ve şifre boş olamaz.");
    }
  
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Kullanıcı ID'sini almak ve AsyncStorage'a kaydetmek
      const userId = userCredential.user.uid; // kullanıcı id'sini login işleminden alıyoruz
      // Firestore'dan kullanıcıyı kontrol et
      const userDocRef = doc(db, "users", userId); // "users" koleksiyonundaki ilgili belgeyi al
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Kullanıcı gerçekten Firestore'da varsa giriş başarılı
        await AsyncStorage.setItem(
          "userSession",
          JSON.stringify({ isLoggedIn: true, userId: userId })
        );
        console.log("Hoşgeldiniz");
        Alert.alert("Başarılı", "Giriş başarılı.");
        navigation.navigate("Home"); // Ana sayfaya yönlendirme
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
        }else if(error.code==="auth/invalid-credential"){
          Alert.alert("HATA","kullanıcı adı veya şifre yanlış /n lütfen tekrar deneyiniz");
        } else {
          Alert.alert("HATA", "Giriş yapılamadı. Lütfen tekrar deneyin.");
        }
    }
  };
  

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

      {/* Login Butonu */}
      <TouchableOpacity
        onPress={signIn}
        className="bg-[#4E5496] px-6 py-2 rounded-lg mt-4 w-full max-w-sm items-center"
      >
        <Text className="text-white  text-lg">LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}
