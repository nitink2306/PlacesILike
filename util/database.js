import * as SQLite from "expo-sqlite";

import { Place } from "../models/place";

let db;

(async () => {
  db = await SQLite.openDatabaseAsync("places.db");
})();

export const initPlacesDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );
  `);

  console.log("Table created successfully");
};

export const insertPlace = async (title, imageUri, address, location) => {
  const result = await db.runAsync(
    "INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?);",
    [title, imageUri, address, location.latitude, location.longitude]
  );
  console.log("Place inserted successfully", result);
  return result.lastInsertRowId;
};

export const fetchPlaces = async () => {
  const formatted_places = [];
  const places_from_db = await db.getAllAsync("SELECT * FROM places;");
  for (const obj of places_from_db) {
    formatted_places.push(
      new Place(
        obj.title,
        obj.imageUri,
        {
          address: obj.address,
          lat: obj.lat,
          lng: obj.lng,
        },
        obj.id
      )
    );
  }
  console.log(formatted_places);
  return formatted_places;
};

export const fetchPlaceWithId = async (id) => {
  const place = await db.getFirstAsync("SELECT * FROM places WHERE id = ?;", [
    id,
  ]);
  console.log(place);
  return place;
};

export const deletePlace = async (id) => {
  const result = await db.runAsync("DELETE FROM places WHERE id = ?;", [id]);
  console.log("Place deleted successfully", result);
  return result.changes;
};

export const updatePlace = async (place) => {
  const result = await db.runAsync(
    "UPDATE places SET title = ?, imageUri = ?, address = ?, lat = ?, lng = ? WHERE id = ?;",
    [place.title, place.imageUri, place.address, place.lat, place.lng, place.id]
  );
  console.log("Place updated successfully", result);
  return result.changes;
};
