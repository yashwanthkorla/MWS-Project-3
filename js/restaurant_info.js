let restaurant;
var newMap;
let addReview = document.getElementById('AddReview');
let ratingValue = document.getElementById('ratingValue');
let reviewerName = document.getElementById('reviewer_name');
let reviewTextArea = document.getElementById('commentArea');
let is_favorite = false;
let add_favorite = document.getElementById("add_favorite");

// Adding review i.e. doing post requet.
function addReviewFunction() {
  let name = reviewerName.value;
  let rating = ratingValue.value;
  let comments = reviewTextArea.value;
  if (name == '') {
    return alert('Please enter the name');
  }
  else if (rating == 'placeholder_for_rating') {
    return alert('Please select a rating');
  }
  else if (comments == '') {
    return alert('Please write a comment');
  }
  else {
    const rest_id = getParameterByName('id');
    const headers = new Headers({ 'Content-Type': 'application/json' });
    fetch('http://localhost:1337/reviews/', {
      method: "POST",
      cache: "no-cache",
      headers: headers,
      body: JSON.stringify({
        "restaurant_id": rest_id,
        "name": name,
        'rating': rating,
        "comments": comments,
        "createdAt": new Date()
      })
    }).then((res) => {
      return res.json();
    }).then((data) => {
      if (data) {
        // console.log(data);
        const ul = document.getElementById('reviews-list');
        ul.appendChild(createReviewHTML(data));
        // You can use jquery to minimize the code.
        resetFields();
        alert('Submitted Your Review');
      }
    }).catch((err) => {
      alert('Network Failure,but dont worry we will add your review');
      resetFields();
      console.error(err)
    })
  }
}

function resetFields() {
  reviewerName.value = '';
  reviewTextArea.value = '';
  ratingValue.value = 'placeholder_for_rating';
}
/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoieWFzaHdhbnRoa29ybGEiLCJhIjoiY2prNTh4aDh1MTZiMjNycXFiMWZxOGtuaSJ9.lnpebJNiR4wmBk7ND3gz5A',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  console.log('Inside Fill RestaurantHTML')
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  console.log(alt_array[restaurant.id])
  image.setAttribute('alt', alt_array[restaurant.id]);
  image.title = restaurant.name;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  //Mark as favoruite
  is_favorite = restaurant.is_favorite;
  console.log(is_favorite, "knowing the valie of is_favorite variable");
  if (is_favorite) {
    console.log('is true')
    add_favorite.classList.add('loved_it');
    add_favorite.innerHTML = `<span style='color:red'>♥</span> You loved it`;
  } else {
    add_favorite.classList.remove('loved_it')
    add_favorite.innerHTML = `<span>♡</span> You like it?`;
  }
  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  const id_param = getParameterByName('id');

  DBHelper.fetchReviewsById(`http://localhost:1337/reviews?restaurant_id=${id_param}`).then((data) => {
    fillReviewsHTML(data);
    web_worker.postMessage([data, 'saveReviews']);
  }).catch((err) => {
    console.log(err);
    if (window.indexedDB) {
      let indexedDB = window.indexedDB;
      let request = indexedDB.open('review_db', '2');
      request.onerror = (event) => {
        console.log('Inside catch block', event)
      }
      request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction('reviewStore', "readonly").objectStore('reviewStore');
        let index = transaction.index('restaurant_id')
        index.getAll(parseInt(getParameterByName('id'))).onsuccess = (event) => {
          fillReviewsHTML(event.target.result)
        }
      }
      console.log('Browser supports indexeddb feature');
    }
    else {
      console.log('Browser doesnt support indexeddb feature');
    }
  });
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
function createReviewHTML(review) {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.classList.add('name');
  name.innerHTML = review.name;
  li.appendChild(name);

  const createdDate = document.createElement('p');
  createdDate.innerHTML = new Date(review.createdAt).toDateString();
  createdDate.classList.add('date');
  li.appendChild(createdDate);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.classList.add('rating');
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.classList.add('comments');
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function bookmarkButton() {
  if (is_favorite) {
    is_favorite = false;
    add_favorite.classList.remove('loved_it');
    add_favorite.innerHTML = `<span>♡</span> You like it?`;
    favoritePutRequest(is_favorite);
  } else {
    is_favorite = true;
    add_favorite.classList.add('loved_it');
    add_favorite.innerHTML = `<span style='color:red'>♥</span> You loved it`;
    favoritePutRequest(is_favorite);
  }
  console.log(is_favorite);
}

function favoritePutRequest(value) {
  console.log(is_favorite);
  return fetch(
    `http://localhost:1337/restaurants/${getParameterByName(
      "id"
    )}`,
    {
      method: "POST",
      body: JSON.stringify({ "is_favorite": value })
    }
  )
    .then(res => res.json())
    .then(data => {
      console.log(data);
    }).catch(err => {
      alert("Failed to save, Please check your internet connection", err);
    });
}