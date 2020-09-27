const submitBtnElement = document.querySelector("#btn");
const inputElement = document.querySelector("#ip");
const resultElement = document.querySelector(".results");
const resultDataElement = document.querySelector("#result-data");
let IPAddress;

// random latitude and longitude
let lat = 10,
  lng = 1;

// generate map
var mymap = L.map("ipLocation").setView([lat, lng], 5);
// custome pointer icon
const pointer = L.icon({
  iconUrl: "./resources/images/icon-location.svg",
  iconSize: [30, 36],
  iconAnchor: [15, 18],
});
// url for openstreetmap
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
L.tileLayer(url, { attribution: attribution }).addTo(mymap);

// IP Address finder API url and API key
const apiUrl = "https://geo.ipify.org/api/v1";
const apiKey = "at_W4P8c8iMb5Q6OOpuE5spIgMlQy4gp";

document.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    inputElement.classList.remove("empty-field");
    actionOnIPSubmit();
  }
});
// listen for user click Event
submitBtnElement.addEventListener("click", () => {
  inputElement.classList.remove("empty-field");
  actionOnIPSubmit();
});

// when user either clicks or enters
function actionOnIPSubmit() {
  // check if input vlaue is not empty
  if (inputElement.value) {
    IPAddress = inputElement.value;
    // validate IP address
    if (!validateIP(IPAddress)) {
      // if IP Address is Invalid
      inputElement.classList.add("empty-field");
      inputElement.value = "Invalid IP";
      return;
    }
    // get data for given IP
    const response = fetch(`${apiUrl}?apiKey=${apiKey}&ipAddress=${IPAddress}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((response) => {
        // generate and displays results
        resultDataElement.innerHTML = returnDataList(response);
        resultElement.classList.add("show");

        // set new latitude and longitude from IP
        lat = response.location.lat;
        lng = response.location.lng;
        updateLatLng(lat, lng);
      });
  } else {
    inputElement.classList.add("empty-field");
  }
}

// move pointer to new latitude and longitude
function updateLatLng(x, y) {
  const lat = x,
    lng = y;
  const marker = L.marker([lat, lng], { icon: pointer }).addTo(mymap);
  const latLngs = [marker.getLatLng()];
  const markerBounds = L.latLngBounds(latLngs);
  mymap.fitBounds(markerBounds, {
    paddingTopLeft: [lat, lng],
    maxZoom: 17,
  });
  marker.setLatLng([lat, lng]);
}

// validate IP addres given by user

function validateIP(ipAddress) {
  const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipAddress.match(ipformat)) {
    return true;
  }
  return false;
}
// generate results
function returnDataList(data) {
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
