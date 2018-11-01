let db_name = 'RR_indexeddb';
let db_objectstore_name = "RestaurantsInfo";
self.onmessage = (event) => {
    switch (event.data[1]) {
        case 'AddingRestaurants':
            addRestaurants(event.data[0]);
            break;
        case 'GettingRestaurants':
            getRestaurantsWhenYouGoOffline();
            break;
        case 'saveReviews':
            saveReviews(event.data[0]);
            break;
    }

}
addRestaurants = (val) => {
    if (self.indexedDB) {
        let indexedDB = self.indexedDB;
        let request = indexedDB.open(db_name, '1');
        request.onerror = (event) => {
            console.log(event)
        }
        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            let objectStoreName = db.createObjectStore(db_objectstore_name, { keyPath: 'id' });
            objectStoreName.transaction.oncomplete = (event) => {
                let transaction = db.transaction([db_objectstore_name], "readwrite").objectStore(db_objectstore_name);
                val.forEach(element => {
                    console.log(element)
                    transaction.put(element).onsuccess = (event) => {
                        console.log('Addded' + event)
                    }
                });;
            }
        }
        console.log('Browser supports indexeddb feature');
    }
    else {
        console.log('Browser doesnt support indexeddb faeture');
    }
}

getRestaurantsWhenYouGoOffline = () => {
    if (self.indexedDB) {
        let indexedDB = self.indexedDB;
        let request = indexedDB.open(db_name, '1');
        request.onerror = (event) => {
            console.log('Inside catch block', event)
        }
        request.onsuccess = function (event) {
            let db = event.target.result;
            let transaction = db.transaction([db_objectstore_name], "readonly").objectStore(db_objectstore_name);
            let getresult = transaction.getAll();
            getresult.onsuccess = () => {
                // console.log(typeof(getresult.result))
                postMessage(getresult.result);
            }
        }

        console.log('Browser supports indexeddb feature');
    }
    else {
        console.log('Browser doesnt support indexeddb feature');
    }
}

saveReviews = (val) => {
    console.log('inside save')
    if (self.indexedDB) {
        let indexedDB = self.indexedDB;
        let request = indexedDB.open('review_db', '2');
        request.onerror = (event) => {
            console.log(event)
        }
        request.onupgradeneeded = (event) => {
            // console.log('inside success')
            let db = event.target.result;
            let objectStoreName = db.createObjectStore('reviewStore', { keyPath: 'id' , autoIncrement :true});
            objectStoreName.createIndex('restaurant_id','restaurant_id');
            objectStoreName.transaction.oncomplete = (event) => {
                // console.log('Inside  complete event ')
                let transaction = db.transaction('reviewStore', "readwrite").objectStore('reviewStore');
                val.forEach(element => {
                    // console.log(element)
                    transaction.put(element).onsuccess = (event) => {
                        // console.log('Addded' + event)
                    }
                });;
            }
        }
        request.onsuccess = (event) => {
            let db = event.target.result;
            let transaction = db.transaction('reviewStore',"readwrite").objectStore('reviewStore');
            val.forEach(element => {
                // console.log(element)
                transaction.put(element).onsuccess = (event) => {
                    // console.log('Addded' + event)
                }
            });;
        }
        console.log('Browser supports indexeddb feature');
    }
    else {
        console.log('Browser doesnt support indexeddb faeture');
    }
}