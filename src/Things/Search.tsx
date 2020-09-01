import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import Animated, { Extrapolate, sub } from "react-native-reanimated";
import { clamp, interpolateColor } from "react-native-redash";
import { StyleGuide } from "../components";

const size = 48;
const marginTop = 32;
const CONTAINER_HEIGHT = 100;
export const THRESHOLD = CONTAINER_HEIGHT + marginTop;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -CONTAINER_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  },
  search: {
    width: size,
    height: size,
    borderRadius: size / 2,
    justifyContent: "center",
    alignItems: "center"
  }
});

interface SearchProps {
  translateY: Animated.Value<number>;
}

export default memo(({ translateY }: SearchProps) => {
  const searchTranslateY = clamp(translateY, 0, THRESHOLD);
  const backgroundColor = interpolateColor(translateY, {
    inputRange: [CONTAINER_HEIGHT, THRESHOLD],
    outputRange: ["rgb(186, 187, 199)", "rgb(56, 132, 255)"]
  });
  const opacity = Animated.interpolate(translateY, {
    inputRange: [CONTAINER_HEIGHT, THRESHOLD],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });
  const oppositeOpacity = sub(1, opacity);
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.search,
          { transform: [{ translateY: searchTranslateY }], backgroundColor }
        ]}
      >
        {/* <View>
          <Icon name="search" size={32} color="#babbc7" />
        </View> */}
        {/* <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center"
          }}
        > */}
        <Icon name="search" size={32} color="white" />
        {/* </View> */}
      </Animated.View>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Animated.View style={{ opacity }}>
          <Icon name="chevron-down" size={32} color="#babbc7" />
        </Animated.View>
        <Animated.View
          style={{ ...StyleSheet.absoluteFillObject, opacity: oppositeOpacity }}
        >
          <Icon
            name="chevron-down"
            size={32}
            color={StyleGuide.palette.primary}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
});
