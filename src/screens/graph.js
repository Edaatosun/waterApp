import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fetchData } from '../storage/database';
import { auth } from '../../firebase';
import { format, subDays, startOfDay, isSameDay, parse } from 'date-fns';
import { tr } from 'date-fns/locale';
import Icon from "react-native-vector-icons/Ionicons";

export default function Graph() {
  const screenWidth = Dimensions.get("window").width;
  const [dailyData, setDailyData] = useState([]);
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();

  // Ekran odaklanınca veri çekmek için useFocusEffect kullanıyoruz
  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        if (!userId) return;

        const dailyProgress = await fetchData("dailyProgressModel", userId);

        if (dailyProgress && dailyProgress.length > 0) {
          const today = startOfDay(new Date());
          const last7Days = Array.from({ length: 7 }, (_, i) =>
            subDays(today, 6 - i)
          );

          const dailyTotals = last7Days.map((day) => {
            const matchingEntries = dailyProgress.filter((item) => {
              const itemDate = parse(item.date, "EEEE - dd.MM.yyyy - HH:mm", new Date(), { locale: tr });
              return isSameDay(startOfDay(itemDate), day);
            });

            return matchingEntries.reduce(
              (sum, entry) => sum + (entry.progressTotalDrink || 0),
              0
            );
          });

          const labels = last7Days.map((d) => format(d, 'dd MMM', { locale: tr }));

          setDailyData({
            labels: labels,
            datasets: [
              {
                data: dailyTotals,
                color: (opacity = 1) => `rgba(78, 84, 150, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ["Son 7 Günlük Su Tüketimi"],
          });
        } else {
          // Eğer veri yoksa varsayılan grafik verisi ekle
          const labels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
          const emptyData = [0, 0, 0, 0, 0, 0, 0]; // Varsayılan sıfır verisi
          setDailyData({
            labels: labels,
            datasets: [
              {
                data: emptyData,
                color: (opacity = 1) => `rgba(78, 84, 150, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ["Son 7 Günlük Su Tüketimi"],
          });
        }
      };

      getData();
    }, [userId])
  );

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(78, 84, 150, ${opacity})`,
    labelColor: () => '#000',
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,

  };
  return (
    <View className='w-full h-full mt-5'>
      {/* Header */}
      <View className="w-full flex-row items-center justify-between px-5 py-2 mt-5">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={45} />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Water App</Text>
        <View className="w-[30px]" />
      </View>

      <View className='items-center justify-center'>
        {/* Grafik render edilirken dailyData varsa grafiği göster, yoksa varsayılan grafik göster */}
        {dailyData.labels && dailyData.labels.length > 0 ? (
          <>
            {/* Eğer veriler yoksa mesaj göster */}
            {dailyData.datasets[0].data.every((value) => value === 0) ? (
              <Text className="text-center mt-5 text-lg text-gray-600 font-semibold">
                Henüz günlük su tüketim veriniz bulunmamaktadır.
              </Text>
            ) : null}

            <LineChart
              data={dailyData}
              width={screenWidth}
              height={500}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16,
                marginTop: 16,
              }}
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
            />
          </>
        ) : (
          // Veriler yükleniyorsa bekleme mesajı
          <Text className="text-center mt-5 text-lg text-gray-600 font-semibold">Veriler yükleniyor...</Text>
        )}
      </View>
    </View>
  );
}

