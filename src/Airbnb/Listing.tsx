import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { Feather as Icon } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Extrapolate,
  and,
  block,
  call,
  cond,
  eq,
  interpolate,
  not,
  set,
  useCode
} from "react-native-reanimated";

import { SharedElement } from "react-navigation-shared-element";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useMemoOne } from "use-memo-one";
import {
  onGestureEvent,
  snapPoint,
  timing,
  useValues
} from "react-native-redash";
import { Description } from "./components";
import { Listing as ListingModel } from "./components/Listing";

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width,
    height: width
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16
  }
});
export const SNAP_BACK = height / 2;
const Listing = () => {
  const { goBack, getParam } = useNavigation();
  const listing: ListingModel = getParam("listing");
  const [
    translationX,
    translationY,
    velocityY,
    state,
    translateX,
    translateY,
    shouldSnapBack
  ] = useValues([0, 0, 0, State.UNDETERMINED, 0, 0, 0], []);
  const snapTo = snapPoint(translationY, velocityY, [0, SNAP_BACK]);
  const scale = interpolate(translateY, {
    inputRange: [0, SNAP_BACK],
    outputRange: [1, 0.8],
    extrapolate: Extrapolate.CLAMP
  });
  const gestureHandler = useMemoOne(
    () =>
      onGestureEvent({
        translationX,
        translationY,
        velocityY,
        state
      }),
    [state, translationX, translationY, velocityY]
  );
  useCode(
    () =>
      block([
        cond(
          and(not(shouldSnapBack), eq(snapTo, SNAP_BACK), eq(state, State.END)),
          set(shouldSnapBack, 1)
        ),
        cond(
          shouldSnapBack,
          call([], () => goBack()),
          cond(
            eq(state, State.END),
            [
              set(translateX, timing({ from: translateX, to: 0 })),
              set(translateY, timing({ from: translateY, to: 0 }))
            ],
            [set(translateX, translationX), set(translateY, translationY)]
          )
        )
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }, { translateY }, { scale }],
            backgroundColor: "white"
          }}
        >
          <View>
            <SharedElement id={listing.id}>
              <Image
                style={styles.image}
                resizeMode="cover"
                source={listing.picture}
              />
            </SharedElement>
            <SafeAreaView style={styles.thumbnailOverlay}>
              <Icon.Button
                name="x"
                backgroundColor="transparent"
                underlayColor="transparent"
                onPress={() => goBack()}
              />
            </SafeAreaView>
          </View>
          <Description />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
Listing.sharedElements = (navigation: ReturnType<typeof useNavigation>) => {
  const listing = navigation.getParam("listing");
  return [listing.id];
};
export default Listing;
