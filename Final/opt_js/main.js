let restaurants,neighborhoods,cuisines;var newMap,markers=[];document.addEventListener("DOMContentLoaded",e=>{initMap(),fetchNeighborhoods(),fetchCuisines()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const a=document.createElement("option");a.innerHTML=e,a.value=e,t.append(a)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const a=document.createElement("option");a.innerHTML=e,a.value=e,t.append(a)})}),initMap=(()=>{self.newMap=L.map("map",{center:[40.722216,-73.987501],zoom:12,scrollWheelZoom:!1}),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1IjoieWFzaHdhbnRoa29ybGEiLCJhIjoiY2prNTh4aDh1MTZiMjNycXFiMWZxOGtuaSJ9.lnpebJNiR4wmBk7ND3gz5A",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',id:"mapbox.streets"}).addTo(newMap),updateRestaurants()}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),a=e.selectedIndex,n=t.selectedIndex,s=e[a].value,o=t[n].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(s,o,(e,t)=>{e?console.error(e):(resetRestaurants(t),console.log(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers&&self.markers.forEach(e=>e.remove()),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),addMarkersToMap()}),createRestaurantHTML=(e=>{const t=document.createElement("li"),a=document.createElement("img");a.className="restaurant-img",a.src=DBHelper.imageUrlForRestaurant(e),a.setAttribute("alt",alt_array[e.id]),a.title=e.name,t.append(a);const n=document.createElement("h2");n.innerHTML=e.name;let s=e.name;console.log(s.toLowerCase()),n.setAttribute("aria-label",`${s.toLowerCase()}`),t.append(n);const o=document.createElement("p");o.innerHTML=e.neighborhood,t.append(o);const r=document.createElement("p");r.innerHTML=e.address,t.append(r);const i=document.createElement("a");return i.innerHTML="View Details",i.setAttribute("aria-label",`View Details for ${e.name}`),i.href=DBHelper.urlForRestaurant(e),i.title=`View More about ${e.name}`,t.append(i),t}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.newMap);t.on("click",function(){window.location.href=t.options.url}),self.markers.push(t)})});