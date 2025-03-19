import React, { useEffect } from "react";
import { TextInput, View } from "react-native";
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
const duration = 60000;

const ProgressCircle = () => {
  const strokeOffset = useSharedValue(circumference);
  const waveOffset = useSharedValue(0); // Dalga hareketi için sharedValue

  const percentage = useDerivedValue(() => {
    return withTiming(((circumference - strokeOffset.value) / circumference) * 100, { duration });
  });

  const strokeColor = useDerivedValue(() => {
    return interpolateColor(
      percentage.value,
      [0, 50, 100],
      ["#9E4784", "#66347F", "#37306B"]
    );
  });

  useEffect(() => {
    waveOffset.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  // Dalga çizimi (içini yuvarlak ve düzgün dolduruyor)
  const animatedWaveProps = useAnimatedProps(() => {
    const waveAmplitude = 4; // Dalganın yüksekliği
    const waveFrequency = 15; // Dalga genişliği

    // Dalganın yukarı çıkmasını sağlayan kısım (yüzdeye bağlı yükseklik)
    const waveHeight = interpolate(percentage.value, [0, 100], [100,0]);

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

    return {
      d: path,
      fill: strokeColor.value, // Dalga rengini animasyonla değiştiriyoruz
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
        text: `${Math.round(percentage.value)} %`
    };
  });


  useEffect(() => {
    strokeOffset.value = 0;
  }, []);

  return (
    <View  style={{ width: 240, height: 300, justifyContent: "center", alignItems: "center" }}>
    <AnimatedText
        style = {{
        flex:1,
        color:"red",
        fontSize:24,
       fontWeight:"bold",
        position:"absolute",
        zIndex: 10, 
          }}
        animatedProps={animatedTextProps}
     />        
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Defs>
          {/* Dalga için bir maske oluşturuyoruz */}
          <Mask id="waveMask">
            <Circle cx="50" cy="50" r="45" fill="white" />
          </Mask>
        </Defs>

        {/* Arkasındaki gri çember
          cx ve cy çemberin merkezini oluşturuyor.
          r yarıçapı
          stroke çizginin rengi
          storkeidth çizginin klaınlığo
          fill de iç kısmının rengini temsil ediyor.
         */}
        <Circle cx="50" cy="50" r="45" stroke="#E7E7E7" strokeWidth="10" fill="transparent" />

        {/* Dalga animasyonu animated: dalgaın sürekli olması anlamına gelir.
        mask çizdiğimiz yukardaki mask ifadesidir.
        kenar çizgisi yoktur : storkeWidth */}
        <AnimatedPath animatedProps={animatedWaveProps} mask="url(#waveMask)" strokeWidth="0" />
      </Svg>
    </View>
  );
};

/* Mask: bir nesneyi görünmez kılabilir veya belirli bir bölgede görünmesinin sağlayabiliriz
burda dalganın çemberin içinde görünmesi gerekiyordu.
<Circle cx="50" cy="50" r="45" fill="white" /> çemberin içinde görünmesini sağlıyor.
 */

export default ProgressCircle;
