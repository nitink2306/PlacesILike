import { useEffect, useState } from "react";
import PlacesList from "../components/Places/PlacesList";
import { useIsFocused } from "@react-navigation/native";

function AllPlaces({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && route.params) {
    }
  }, [isFocused, route]);
  return <PlacesList />;
}

export default AllPlaces;
