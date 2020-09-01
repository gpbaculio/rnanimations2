import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";

import { useMemoOne } from "use-memo-one";
import Animated, {
  Transition,
  Transitioning,
  TransitioningView
} from "react-native-reanimated";
import Content from "./Content";
import ScrollView from "./ScrollView";
import Search from "./Search";
import SearchBox from "./SearchBox";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
const transition = (
  <Transition.Together>
    <Transition.In durationMs={400} type="scale" />
    <Transition.Out durationMs={400} type="scale" />
  </Transition.Together>
);
export default () => {
  const ref = useRef<TransitioningView>(null);
  const [search, setSearch] = useState(false);
  const translateY = useMemoOne(() => new Animated.Value(0), []);
  return (
    <Transitioning.View style={styles.container} {...{ transition, ref }}>
      <Search {...{ translateY }} />
      <ScrollView
        onPull={() => {
          if (ref.current) ref.current.animateNextTransition();
          setSearch(true);
        }}
        {...{ translateY }}
      >
        <Content />
      </ScrollView>
      <SearchBox
        visible={search}
        onRequestClose={() => {
          if (ref.current) ref.current.animateNextTransition();
          setSearch(false);
        }}
      />
    </Transitioning.View>
  );
};
