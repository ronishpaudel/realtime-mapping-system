const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit('send-location', { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

// Create the map instance and set the view
const map = L.map('map').setView([0, 0], 16);

// Add a tile layer to the map (you need this to see the actual map tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Realtime Mapping System',
}).addTo(map);

const markers={}

socket.on("recieve-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 17);
    if(!markers[id]){
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    else{
        markers[id].setLatLng([latitude, longitude]);
    }
})

socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})