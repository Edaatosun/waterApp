import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';



export default function Graph() {

      const screenWidth = Dimensions.get("window").width;

      const data = {
        labels: ["Ock", "Şbt", "Mart", "Nsn", "May", "Haz", "Tem", "Ağsts", "Eyl", "Ekim", "Kasım", "Arlk"],
        datasets: [
          {
            data: [2000, 2800, 3500, 3000, 4000, 3700, 5000, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(78, 84, 150, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ["Aylık Su Tüketimi"],
      };
     const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(78, 84, 150, ${opacity})`,
        labelColor: () => '#000',
        strokeWidth: 2,
        barPercentage: 0.75,
        decimalPlaces: 0,
      };

    return (
        <View classNam= "mt-8 px-4 items-center">
          <Text className = "text-xl font-semibold mb-2 text-center">
                Aylık Su Tüketim Grafiği
            </Text>
            <LineChart
                data={data}
                width={screenWidth - 20}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={tailwind('rounded-lg mt-4')}
            />
            
        </View>
    );
}
