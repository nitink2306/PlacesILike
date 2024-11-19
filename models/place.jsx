export class Place {
  // Constructor for creating a Place instance
  constructor(title, imageUri, location, id) {
    this.title = title; // Title of the place
    this.imageUri = imageUri; // Image URI for the place
    this.address = location.address; // Address of the place, extracted from the location object
    this.location = {
      latitude: location.lat, // Latitude coordinate of the place
      longitude: location.lng, // Longitude coordinate of the place
    };
    this.id = id; // Unique identifier for the place (optional)
  }
}
