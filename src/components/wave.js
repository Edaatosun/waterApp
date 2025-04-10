
// öğrenmek için denemeler yapıldı.



// import React, { useEffect } from "react";
// import { View, Dimensions } from "react-native";
// import Svg, { Path } from "react-native-svg";
// import Animated, {
//   useAnimatedProps,
//   useDerivedValue,
//   useSharedValue,
//   withRepeat,
//   withTiming,
//   Easing,
// } from "react-native-reanimated";
// import MaskedView from "@react-native-community/masked-view";
// import { mix } from "react-native-redash";

// const SIZE = Dimensions.get("window").width - 64;
// const AnimatedPath = Animated.createAnimatedComponent(Path);

// const Wave = () => {
//   const progress = useSharedValue(0);

//   useEffect(() => {
//     progress.value = withRepeat(
//       withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
//       -1,
//       true
//     );
//   }, [progress]);

//   const data = useDerivedValue(() => {
//     const m = mix.bind(null, progress.value);
//     return {
//       from: {
//         x: m(-0.1, -1),
//         y: m(0.1, 0.4),
//       },
//       c1: { x: m(0, 0.5), y: m(0.5, 1) },
//       c2: { x: m(1, 0.5), y: m(0.3, 0) },
//       to: { x: m(1.1, 2), y: m(0.8, 0.5) },
//     };
//   });

//   const path = useAnimatedProps(() => {
//     const { from, c1, c2, to } = data.value;
//     return {
//       d: `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y} L 1 1 L 0 1 Z`,
//     };
//   });

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "black",
//       }}
//     >
//       <MaskedView
//         maskElement={
//           <View
//             style={{
//               backgroundColor: "black",
//               width: SIZE,
//               height: SIZE,
//               borderRadius: SIZE / 2,
//             }}
//           />
//         }
//       >
//         <Svg
//           width={SIZE}
//           height={SIZE}
//           style={{ backgroundColor: "#242424" }}
//           viewBox="0 0 1 1"
//         >
//           {/* Tek Dalga İçin Üç Katmanlı Animasyon */}
//           <AnimatedPath fill="#86b4ff" animatedProps={path} />
//           <AnimatedPath
//             fill="#3498db"
//             animatedProps={path}
//             style={{ transform: [{ translateY: 5 }] }}
//           />
//           <AnimatedPath
//             fill="#5c99d1"
//             animatedProps={path}
//             style={{ transform: [{ translateY: 10 }] }}
//           />
//         </Svg>
//       </MaskedView>
//     </View>
//   );
// };

// export default Wave;
