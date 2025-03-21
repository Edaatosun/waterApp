import React, { useEffect } from "react";
import { TextInput, View ,Text} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle, Path, Defs, Mask } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.createAnimatedComponent(TextInput);
const radius = 45;
const circumference = radius * Math.PI * 2;
const duration = 2000;

const ProgressCircle = ({ drink, amount }) => {
  const strokeOffset = useSharedValue(circumference);
  const percentage = useDerivedValue(() => (drink / amount) * 100);

  useEffect(() => {
    strokeOffset.value = withTiming((1 - drink / amount) * circumference, { duration });
  }, [drink]);

  const strokeColor = useDerivedValue(() => {
    return interpolateColor(percentage.value, [0, 50, 100], ["#BEDAEF", "#7EB6E0", "#3E92D1"]);
  })

  const animatedWaveProps = useAnimatedProps(() => {
    const waveAmplitude = 4;
    const waveFrequency = 15;
    const waveHeight = interpolate(percentage.value, [0, 100], [100, 0]);

    const path = `
      M 0,${waveHeight}
      C ${waveFrequency}, ${waveHeight + waveAmplitude} 
        ${waveFrequency * 2}, ${waveHeight - waveAmplitude} 
        ${waveFrequency * 3}, ${waveHeight}
      S ${waveFrequency * 4}, ${waveHeight} ${waveFrequency * 5},${waveHeight}
      S ${waveFrequency * 6}, ${waveHeight} ${waveFrequency * 7},${waveHeight}
      S ${waveFrequency * 8}, ${waveHeight} ${waveFrequency * 9},${waveHeight}
      V 100 H 0 Z
    `;
    return { d: path, fill: strokeColor.value };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return { text: `${Math.round(percentage.value)}%` };
  })

  

  return (
    <View style={{ width: 240, height: 220, justifyContent: "center", alignItems: "center" }}>
      <AnimatedText
        style={{
          flex: 1,
          color: "red",
          fontSize: 24,
          fontWeight: "bold",
          position: "absolute",
          zIndex: 10,
        }}
        animatedProps={animatedTextProps}
        editable={false}
        defaultValue={`${drink}%`}
      />
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Defs>
          <Mask id="waveMask">
            <Circle cx="50" cy="50" r="45" fill="white" />
          </Mask>
        </Defs>
        <Circle cx="50" cy="50" r="45" stroke="#E7E7E7" strokeWidth="10" fill="transparent" />
        <AnimatedPath animatedProps={animatedWaveProps} mask="url(#waveMask)" strokeWidth="0" />
      </Svg>
      
      
    </View>
  );
}

export default ProgressCircle;
