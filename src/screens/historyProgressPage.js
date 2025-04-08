import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Progress from 'react-native-progress';
import { Calendar } from 'react-native-calendars';
import { fetchData, queryGoalId } from '../storage/database';
import { auth } from '../../firebase';

export default function HistoryProgressPage() {
    const navigation = useNavigation();
    const userId = auth.currentUser.uid;

    const [dailyData, setDailyData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // Fetch daily progress when component is focused
    useFocusEffect(
        useCallback(() => {
            const getDailyProgress = async () => {
                try {
                    const data = await fetchData("dailyProgressModel", userId);
                    const formattedData = await Promise.all(data.map(async (item) => {
                        try {
                            const AmountData = await queryGoalId("Amount", item.goal_id);
                            return {
                                goalId: item.goal_id,
                                totalDrink: item.progressTotalDrink,
                                date: formatDateForCalendar(item.date),
                                goal: AmountData[0]?.amount || 0,
                            };
                        } catch (innerErr) {
                            return null;
                        }
                    }));
                    setDailyData(formattedData.filter(item => item !== null));
                } catch (err) {
                    console.log("getDailyProgress error:", err);
                }
            };
            getDailyProgress();
        }, [userId])
    );

    const formatDateForCalendar = (dateString) => {
        const dateParts = dateString.split(" - ");
        const datePartOne = dateParts[1];
        const [day, month, year] = datePartOne.split(".");
        return `${year}-${month}-${day}`;
    };

    const formatDateForText = (dateString) => {
        const dateParts = dateString.split("-");
        const [year, month, day] = dateParts;
        return `${day}.${month}.${year}`;

    };

    const CustomDay = React.memo(({ date }) => {
        const dateStr = date.dateString;
        const day = parseInt(date.day, 10);

        const data = useMemo(() => {
            return dailyData ? dailyData.find(item => item.date === dateStr) : null;
        }, [dateStr, dailyData]);

        const progress = data ? data.totalDrink / data.goal : 0;

        return (
            <View className="items-center justify-center">
                <TouchableOpacity
                    onPress={() => {
                        setSelectedDate(dateStr);
                        if (data && data.goalId) {
                            historyList(data.goalId);
                        }
                    }}
                >
                    <Progress.Circle
                        progress={progress}
                        size={40}
                        thickness={3}
                        formatText={() => <Text>{day}</Text>}
                        showsText={true}
                        textStyle={{ fontSize: 15, color: 'red' }}
                        color={"#4caf50"}
                        unfilledColor="#e0e0e0"
                        borderWidth={0}
                    />
                </TouchableOpacity>
            </View>
        );
    });

    const historyList = async (goalId) => {
        if (goalId) {
            const success = await queryGoalId("drinkWater", goalId);
            if (success) {
                return success;
            }
        }
    };

    const selectedData = useMemo(() => {
        return dailyData && selectedDate ? dailyData.find(item => item.date === selectedDate) : null;
    }, [selectedDate, dailyData]);

    return (
        <SafeAreaView className="bg-gray-100 flex-1">
            <View className="w-full flex-row items-center justify-between px-5 py-2 mt-5">
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menu" size={45} />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Water App</Text>
                <View className="w-[30px]" />
            </View>

            <View className="bg-white rounded-xl mx-3 mt-5 pb-6 pt-4 px-4">

                {/* Tarih - sağ üst köşe */}
                <View className="flex-row justify-between items-center mb-2">
                    <View /> {/* boş bırakılarak tarih sola yapışmasın */}
                    <TouchableOpacity className="bg-blue-100 px-3 py-1 rounded-xl">
                        <Text className="text-sm font-semibold text-blue-600">
                            {formatDateForText(selectedDate) || "Tarih Yükleniyor..."}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Su Tüketimi ve Progress */}
                <View className="items-center justify-center mb-6">
                    <Text className="text-lg mb-3">
                        {selectedData ? `${selectedData.totalDrink || 0} ml / ${selectedData.goal || 0} ml` : "0 ml / 0 ml"}
                    </Text>
                    <Progress.Circle
                        progress={selectedData ? selectedData.totalDrink / selectedData.goal : 0}
                        color="#4E5496"
                        size={100}
                        unfilledColor="#E0E0E0"
                        showsText={true}
                        formatText={() =>
                            `${Math.round(selectedData ? (selectedData.totalDrink / selectedData.goal) * 100 : 0)}%`
                        }
                        thickness={7}
                    />
                </View>

                {/* Geçmiş Butonu */}
                <TouchableOpacity
                    onPress={async () => {
                        if (selectedData?.goalId) {
                            const success = await historyList(selectedData.goalId);
                            if (success) {
                                navigation.navigate('DetailsHistoryProgress', { historyData: success });
                            }

                        }
                        else {
                            navigation.navigate('DetailsHistoryProgress', { historyData: 0 });
                        }

                    }}
                    className="rounded-full py-3 px-10 bg-blue-600 items-center justify-center"
                >
                    <Text className="text-white text-lg">Su Tüketim Geçmişi</Text>
                </TouchableOpacity>

            </View>

            <View className="mt-5 mb-5 mx-3 rounded-xl px-2 justify-center bg-white">
                <Text className="text-lg mt-5 font-semibold text-center">Günlük Takvim</Text>
                <Calendar
                    dayComponent={({ date }) => <CustomDay date={date} />}
                    theme={{
                        calendarBackground: '#fff',

                    }}
                />
            </View>
        </SafeAreaView>
    );
}
