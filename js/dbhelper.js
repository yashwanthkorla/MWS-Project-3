let alt_array = {
  '1': "Inside Mission Chinese Food",
  '2': "Emily Restaurent Pizza",
  '3': "Kang Ho Dong Baekjeong Interior with no peoples",
  '4': "Outside view of Katz's Delicatessen",
  '5': "Roberta's Pizza Inside view with customers",
  '6': "Hometown BBQ Inside view",
  '7': "Superiority Burger Main Entrance",
  '8': "outside view of The Dutch",
  '9': "People inside Mu Ramen",
  '10': "Inside view of Casa Enrique"
};
// Creating a web worker- to spearate the indexedDB operation from the main thread.
let web_worker = new Worker('opt_js/worker.js')
let db_name = 'RR_indexeddb';
let db_objectstore_name = "RestaurantsInfo";
/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }
  static fetchReviewsById(reviewPathId){
   return fetch(reviewPathId).then((data) => {
     return data.json();
    });
  }
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL).then((responsedata) => {
      return responsedata.json();// to get the body out of response body we are going to use json().The json method will return the promise.
    })
      .then((val) => {
        web_worker.postMessage([val,'AddingRestaurants']);
        callback(null, val)
      })
      .catch(err => {
        console.log('No network,trying to fetch from indexedDb')
        console.log(err)
        if (window.indexedDB) {
          let indexedDB = window.indexedDB;
          let request = indexedDB.open(db_name, '1');
          request.onerror = (event) => {
            console.log('Inside catch block',event)
          }
          request.onsuccess = function(event){
            let db = event.target.result;
              let transaction = db.transaction([db_objectstore_name], "readonly").objectStore(db_objectstore_name);
              let getresult = transaction.getAll();
              console.log(getresult);
              getresult.onsuccess = () => {
                callback(null,getresult.result)
              }
            }

          console.log('Browser supports indexeddb feature');
        }
        else {
          console.log('Browser doesnt support indexeddb feature');
        }
      })
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    /*for CASA restaurant that is id 10 , there was no photograph key.Instead of that i am showing no image. by using conditions

    If you want a dummy pic the use the below code.
    if(restaurant.photograph == undefined){
      return (`/img/noimage.jpg`); Have this noimage in your img directory
    }
    else{
      return (`/img/${restaurant.photograph}.jpg`);
    }
    */
    if (restaurant.photograph == undefined) {
      return (`opt_webp/noimage.webp`);
    }
    else {
      return (`opt_webp/${restaurant.photograph}.webp`);
    }
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
    marker.addTo(newMap);
    return marker;
  }
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}

