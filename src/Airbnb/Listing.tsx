import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { Feather as Icon } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { SharedElement } from "react-navigation-shared-element";
import { Description } from "./components";
import { Listing as ListingModel } from "./components/Listing";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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

const Listing = () => {
  const { goBack, getParam } = useNavigation();
  const listing: ListingModel = getParam("listing");
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1
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
      </View>
    </View>
  );
};
Listing.sharedElements = (navigation: ReturnType<typeof useNavigation>) => {
  const listing = navigation.getParam("listing");
  return [listing.id];
};
export default Listing;
