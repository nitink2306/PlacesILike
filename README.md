# Places I Like

**Author:** Nitin Bavineni  
**GitHub Repository:** [Places I Like](https://github.com/nitink2306/PlacesILike)

## 📌 **Introduction**

**Places I Like** is a React Native app that lets users capture and save their favorite locations along with photos and detailed metadata. The app supports offline access using SQLite, making it reliable and efficient. It combines features like photo capture, geolocation, and a refined user interface to provide a smooth and enjoyable user experience.

## 📝 **Features**

### 1. **Photo Capture**

- Use the device camera to capture photos of places you like.

- Save these photos with relevant location metadata.

### 2. **Geolocation**

- Select a location on an interactive map.

- Use geocoding to translate coordinates into readable addresses.

### 3. **SQLite Persistence**

- Store photos, locations, and addresses in a local SQLite database.

- Access your data offline for convenience.

### 4. **Place Management**

- View saved places in a list or on a map with interactive markers.

- Edit and delete places as needed.

### 5. **Search and Filters**

- Search for places by title or address.

- Filter places by categories such as "Favorites."

### 6. **Share Functionality**

- Share details of a place, including its image and location, via a generated Google Maps link or the photo itself.

---

## 🎯 **Project Scope**

### **Threshold Goals (MVP)**

- Basic photo capture using the camera.

- Location selection with geocoding to retrieve addresses.

- SQLite database integration to store and list saved places.

### **Target Goals**

- Map-based display of saved places.

- Edit and delete functionality.

- UI/UX improvements for better usability.

### **Stretch Goals**

- Category-based filtering (e.g., Favorites).

- Advanced search functionality by name or location.

- Share options for photos and location details.

---

## 🛠️ **Setup**

### **Prerequisites**

- Node.js installed

- Expo CLI installed

- SQLite support via `expo-sqlite`

### **Getting Started**

1\. Clone the repository:

   ```bash

   git clone https://github.com/nitink2306/PlacesILike.git

   cd PlacesILike

   ```

2\. Install dependencies:

   ```bash

   npm install

   ```

3\. Run the development server:

   ```bash

   npm start

   ```

4\. Launch the app on your preferred device or emulator via Expo.

---

## 🗺️ **Key Screens**

### 1. **Home Screen**

- Search for places and view them in a list format.

- Quick access to map view and "Add Place" screen.

### 2. **Add Place**

- Capture photos and select locations for new places.

### 3. **Edit Place**

- Update details of saved places, including title, photo, and location.

### 4. **Map View**

- Display all saved places as interactive markers.

### 5. **Favorite Places**

- View all places marked as favorites.

---

## 🚀 **Technologies Used**

- **React Native**: Frontend framework for cross-platform development.

- **Expo**: Simplified development with access to native device features.

- **SQLite**: Local database for offline data storage.

- **Google Maps API**: Geolocation and map functionality.

---

## 🔄 **Milestones**

### **Milestone 1: Project Setup & Photo Capture**

- Set up the project structure and implement photo capture.

### **Milestone 2: Geolocation**

- Add map-based location selection and geocoding.

### **Milestone 3: Data Persistence**

- Integrate SQLite and create the saved places list.

### **Milestone 4: Advanced Features**

- Enable map markers, editing, and deletion of saved places.

### **Milestone 5: UI/UX Refinements**

- Finalize design and implement search, filtering, and sharing functionality.
