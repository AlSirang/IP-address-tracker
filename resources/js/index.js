const submitBtnElement = document.querySelector("#btn");
const inputElement = document.querySelector("#ip");
const resultElement = document.querySelector(".results");
const resultDataElement = document.querySelector("#result-data")
let IPAddress;

const apiUrl = "https://geo.ipify.org/api/v1";
const apiKey="at_W4P8c8iMb5Q6OOpuE5spIgMlQy4gp";

submitBtnElement.addEventListener('click', ()=>{
  if(inputElement.value){
    IPAddress = inputElement.value;
    const response = fetch(`${apiUrl}?apiKey=${apiKey}&ipAddress=${IPAddress}`)
    .then(response=>{
      if(response.ok){
        return response.json();
      }
    })
    .then(response=>{
      console.log(response)
      resultDataElement.innerHTML = returnDataList(response);
      resultElement.style.display="block";

    });
  }else{
    inputElement.classList.add("empty-field");
    
  }
 
});





// generate map
var mymap = L.map("ipLocation").setView([0, 0], 5);
let lat = 24.9,
  lng = 67.1;
const pointer = L.icon({
  iconUrl: "./resources/images/icon-location.svg",
  iconSize: [30, 36],
  iconAnchor: [15, 18],
});

const marker = L.marker([lat, lng], { icon: pointer }).addTo(mymap);

const latLngs = [marker.getLatLng()];
const markerBounds = L.latLngBounds(latLngs);
mymap.fitBounds(markerBounds, { paddingTopLeft: [lat, lng], maxZoom: 17 });
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
L.tileLayer(url, { attribution: attribution }).addTo(mymap);

// latitute longtiute
marker.setLatLng([lat, lng]);


// generate results 
function returnDataList(data){
  return `
  <div class="row">
    <h5>ip address</h4>
    <h3>${data.ip}</h2>
  </div>
  <div class="row">
    <h5>location</h4>
    <h3>${data.location.city}, ${data.location.country}, ${data.location.region}</h2>
  </div>
  <div class="row">
    <h5>timezone</h4>
    <h3>${data.location.timezone}</h2>
  </div>
  <div class="row">
    <h5>isp</h4>
    <h3>${data.isp}</h2>
  </div>`;
}