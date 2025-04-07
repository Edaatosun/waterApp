import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView, Dimensions, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Progress from 'react-native-progress';
import { LineChart } from "react-native-chart-kit";
import { Calendar } from 'react-native-calendars';
import { fetchData, getItem, queryGoalId } from '../storage/database';
import { auth } from '../../firebase';

export default function HistoryProgressPage() {
    const navigation = useNavigation();
    const userId = auth.currentUser.uid;

    const [dailyData, setDailyData] = useState(null);

    useEffect(() => {
        const getDailyProgress = async () => {
            // Veriyi alıyoruz
            const data = await fetchData("dailyProgressModel", userId);

            // Her item için AmountData'yı almak
            const formattedData = await Promise.all(data.map(async (item) => {
                // Her bir goal_id için AmountData'yı alıyoruz
                const AmountData = await queryGoalId("Amount", item.goal_id);
                console.log("amountttttt", AmountData[0].amount);

                // Formatlı veri oluşturuyoruz
                return {
                    goalId: item.goal_id,
                    totalDrink: item.progressTotalDrink,
                    date: formatDateForCalendar(item.date),
                    goal: AmountData[0].amount, // Burada AmountData her item için dinamik şekilde alınıyor
                };
            }));

            console.log(formattedData);
            setDailyData(formattedData); // Veriyi setliyoruz
        };

        getDailyProgress();
    }, []);


    useEffect(() => {
        if (dailyData !== null) {
            console.log("daily data:", dailyData);
        }
    }, [dailyData]);

    const formatDateForCalendar = (dateString) => {
        const dateParts = dateString.split(" - ");  // "07.04.2025" kısmını ayırıyoruz.
        const datePartOne = dateParts[1];  // "07.04.2025" kısmını aldık.

        // Gün, ay ve yılı ayırıyoruz
        const [day, month, year] = datePartOne.split("."); // "07", "04", "2025" olarak ayırır

        // Yeni formatta birleştiriyoruz: "2025-04-07"
        return `${year}-${month}-${day}`;
    };





    // Kullanıcı tarafından seçilen bir gün için custom bir takvim öğesi
    const CustomDay = ({ date }) => {
        console.log("date formatııııı", date);
        const dateStr = date.dateString; // Seçilen günün tarihini alıyoruz (2025-05-03): yıl-ay-gün
        const day = parseInt(date.day, 10); // Gün bilgisini integer'a çeviriyoruz
        console.log("dayyyyy", day);
        // Günün verisini buluyoruz
        console.log("dateStr", dateStr);  // Bu, Calendar'dan gelen tarihi gösterir
        console.log("dailyData", dailyData);  // Bu, tüm günlük verinizi gösterir
        const data = dailyData ? dailyData.find(item => {
            console.log("Item Date:", item.date); // item.date'i logluyoruz
            return item.date === dateStr;
        }) : null;

        console.log("Found Data:", data);

        // Eğer veri varsa, toplam içilen suyu ve hedefi alıyoruz, yoksa 0 olarak kabul ediyoruz
        const progress = data ? data.totalDrink / data.goal : 0;

        const formatText = (progress) => {
            return `${day}`; // Metin olarak gün numarasını döndürüyoruz
        };


        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                <TouchableOpacity onPress={() => { Alert.alert("heyoooooooxnckvjn") }}>  {/* Takvime tıklanınca alert göster */}
                    <Progress.Circle
                        progress={progress}
                        size={40}
                        thickness={3}
                        formatText={formatText}  // Gün numarasını formatlıyoruz
                        showsText={true}
                        textStyle={{ fontSize: 15, color: 'red' }}
                        color={"#4caf50"}
                        unfilledColor="#e0e0e0"
                        borderWidth={0}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    // Aylık su tüketimi verisi, bu sablon veriyi Chart için kullanacağız
    const data = {
        labels: ["Ock", "Şbt", "Mart", "Nsn", "May", "Haz", "Tem", "Ağsts", "Eyl", "Ekim", "Kasım", "Arlk"],
        datasets: [
            {
                data: [2000, 2800, 3500, 3000, 4000, 3700, 5000, 0, 0, 0, 0, 0], // Bu verileri dinamik hale getirebilirsiniz
                color: (opacity = 1) => `rgba(78, 84, 150, ${opacity})`, // Grafik rengini belirliyoruz
                strokeWidth: 2,
            },
        ],
        legend: ["Aylık Su Tüketimi"], // Grafikte görünen başlık
    };

    // Ekran genişliği, çizimi doğru boyutlandırmak için kullanıyoruz
    const screenWidth = Dimensions.get("window").width;

    // Grafik ayarlarını buradan yapıyoruz
    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(78, 84, 150, ${opacity})`,
        labelColor: () => '#000',  // Grafik etiket rengi
        strokeWidth: 2,
        barPercentage: 0.75,
        decimalPlaces: 0,
    };

    return (
        <SafeAreaView className="bg-gray-100 flex-1">
            {/* Başlık kısmı */}
            <View className="w-full flex-row items-center justify-between px-5 py-3 mt-5">
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menu" size={45} />
                </TouchableOpacity>
                <Text className="text-lg font-bold">Water App</Text>
                <View style={{ width: 30 }} />
            </View>

            {/* İçerik kısmı */}
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
                <View className="items-center mt-4">
                    <Text className="text-lg mb-2">
                        {dailyData && dailyData.length > 0
                            ? `${dailyData[0]?.totalDrink || 0} ml / ${dailyData[0]?.goal || 3500} ml`
                            : "Veri Yükleniyor..."}
                    </Text>
                    <Progress.Circle
                        progress={dailyData && dailyData[0]
                            ? dailyData[0].totalDrink / dailyData[0].goal
                            : 0}
                        color="#4E5496"
                        size={100}
                        unfilledColor="#E0E0E0"
                        showsText={true}
                        formatText={() => `${Math.round(dailyData && dailyData[0]
                            ? dailyData[0].totalDrink / dailyData[0].goal * 100
                            : 0)}%`}
                        thickness={7}
                    />
                </View>

                {/* Aylık su tüketimi grafiği */}
                <View className="mt-8">
                    <Text className="text-lg font-semibold mb-2 text-center">Aylık Su Tüketim Grafiği</Text>
                    <LineChart
                        data={data}
                        width={screenWidth - 20}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{ borderRadius: 16 }}
                    />
                </View>

                {/* Günlük takvim kısmı */}
                <View className="mt-10 px-4 w-full">
                    <Text className="text-lg font-semibold mb-2 text-center">Günlük Takvim</Text>
                    {/* burda her gün için özel bileşen render ediliyor. */}
                    <Calendar
                        dayComponent={({ date }) => <CustomDay date={date} />}
                        theme={{
                            calendarBackground: '#fff',
                            textDayFontWeight: '500',
                            textMonthFontSize: 18,
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
