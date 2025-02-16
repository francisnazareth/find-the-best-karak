let map;
let markers = [];
let clues = [];

fetch('clues.json')
    .then(response => response.json())
    .then(data => {
        clues = data;
        displayClue();
        initMap();
    })
    .catch(error => console.error('Error loading clues:', error));

let currentClueIndex = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 25.276987, lng: 51.520008 }, // Center map on Doha
        zoom: 11
    });
    clearMarkers();
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function addMarker(clue) {
    const marker = new google.maps.Marker({
        position: { lat: clue.lat, lng: clue.lng },
        map: map,
        title: clue.location
    });
    markers.push(marker);
}

function addPlaceToList(clue) {
    const placesList = document.getElementById('places-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${clue.location}</span>
        <img src="${clue.image}" alt="${clue.location}">
        <div class="star-rating">
            <input type="radio" id="${clue.location}-star5" name="${clue.location}" value="5"><label for="${clue.location}-star5">★</label>
            <input type="radio" id="${clue.location}-star4" name="${clue.location}" value="4"><label for="${clue.location}-star4">★</label>
            <input type="radio" id="${clue.location}-star3" name="${clue.location}" value="3"><label for="${clue.location}-star3">★</label>
            <input type="radio" id="${clue.location}-star2" name="${clue.location}" value="2"><label for="${clue.location}-star2">★</label>
            <input type="radio" id="${clue.location}-star1" name="${clue.location}" value="1"><label for="${clue.location}-star1">★</label>
        </div>
    `;
    placesList.appendChild(listItem);
}

function displayClue() {
    if (clues.length > 0) {
        document.getElementById('clue').innerText = clues[currentClueIndex].clue;
        map.setCenter({ lat: clues[currentClueIndex].lat, lng: clues[currentClueIndex].lng });
    }
}

function checkLocation() {
    const userInput = document.getElementById('location').value;
    if (userInput.toLowerCase() === clues[currentClueIndex].location.toLowerCase()) {
        addMarker(clues[currentClueIndex]);
        addPlaceToList(clues[currentClueIndex]);
        currentClueIndex++;
        document.getElementById('location').value = '';
        if (currentClueIndex < clues.length) {
            displayClue();
            map.panTo({ lat: clues[currentClueIndex].lat, lng: clues[currentClueIndex].lng });
        } else {
            document.getElementById('clue').innerText = "Congratulations! You've found the best Karak Places!";
        }
    } else {
        alert('Incorrect location. Try again!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (clues.length === 0) {
        displayClue();
    }
});