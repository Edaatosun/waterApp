import { useEffect } from "react";
import { View, Text } from "react-native";
import { fetchData, queryCompleted } from "../storage/database";

export default function Notifications() {
  useEffect(() => {
    const isCompleted = async () => {
      console.log("Bildirim kontrolü başlatıldı...");

      const incompleteAmounts = await queryCompleted("Amount", false); // completed=false olanlar

      if (incompleteAmounts && incompleteAmounts.length > 0) {
        for (const item of incompleteAmounts) {
          const userId = item.user_id;

          try {
            const user = await fetchData("users", userId);

            if (user) {
              const fullName = `${user.name} ${user.surname}`;
              const email = user.email;

              const payload = {
                name_surname: fullName,
                email: email,
                message: "Saat 14:00 oldu, su içmeyi unutma!",
              };

              await sendNotification(payload);
              console.log(`Bildirim gönderildi: ${fullName}`);
            }
          } catch (error) {
            console.error("Kullanıcı verisi alınamadı:", error);
          }
        }
      } else {
        console.log("Tamamlanmamış amount verisi bulunamadı.");
      }
    };

    isCompleted();
  }, []);

  const sendNotification = async (data) => {
    try {
      const response = await fetch("https://programmeryavuz.com/api/services/add_reminder.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Bildirim gönderilemedi:", await response.text());
      }
    } catch (error) {
      console.error("POST hatası:", error);
    }
  };

  return (
    <View>
      <Text>Bildirimler gönderiliyor...</Text>
    </View>
  );
}
