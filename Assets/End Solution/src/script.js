document.addEventListener('DOMContentLoaded', () => {
    fetch('karak.json')
        .then(response => response.json())
        .then(data => {
            const restaurantList = document.getElementById('restaurant-list');
            data.slice(1).forEach((restaurant, index) => { // Skip the first item
                const restaurantDiv = document.createElement('div');
                restaurantDiv.classList.add('restaurant');
                
                restaurantDiv.innerHTML = `
                    <h2>${restaurant.Title} <img src="images/azure-map-icon.jpg" alt="Map" class="map-icon" onclick="showMap(${restaurant.lat}, ${restaurant.lng})"></h2>
                    <p>${restaurant.Description}</p>
                    <img src="${restaurant.img}" alt="${restaurant.Title}">
                    <div class="rating">
                        <span>Taste: ${generateStars('taste', index)}</span> <span class="rating-value" id="taste-value-${index}"></span>
                        <span>Fragrance: ${generateStars('fragrance', index)}</span> <span class="rating-value" id="fragrance-value-${index}"></span>
                        <span>Ambience: ${generateStars('ambience', index)}</span> <span class="rating-value" id="ambience-value-${index}"></span>
                        <span>Value for Money: ${generateStars('value', index)}</span> <span class="rating-value" id="value-value-${index}"></span>
                        <span>Overall: ${generateStars('overall', index)}</span> <span class="rating-value" id="overall-value-${index}"></span>
                    </div>
                    <div class="feedback">
                        <textarea id="feedback-${index}" placeholder="Enter your feedback here..."></textarea>
                        <button onclick="submitFeedback(${index})">Submit</button>
                    </div>
                    <div class="share-buttons">
                        <button onclick="shareOnFacebook(${index})">Share on Facebook</button>
                        <button onclick="shareOnTwitter(${index})">Share on Twitter</button>
                        <button onclick="shareOnInstagram(${index})">Share on Instagram</button>
                    </div>
                `;
                
                restaurantList.appendChild(restaurantDiv);
            });
        });

    document.getElementById('close-map').addEventListener('click', () => {
        document.getElementById('map-popup').classList.remove('active');
    });
});

function generateStars(category, index) {
    return '★★★★★'.split('').map((star, starIndex) => `<span class="star" data-category="${category}" data-value="${starIndex + 1}" data-index="${index}">${star}</span>`).join('');
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('star')) {
        const category = event.target.getAttribute('data-category');
        const value = event.target.getAttribute('data-value');
        const index = event.target.getAttribute('data-index');
        const stars = event.target.parentElement.querySelectorAll('.star');
        
        stars.forEach(star => {
            star.classList.remove('selected');
            if (star.getAttribute('data-value') <= value) {
                star.classList.add('selected');
            }
        });

        const ratingValueElement = document.getElementById(`${category}-value-${index}`);
        ratingValueElement.textContent = `(${value}/5)`;

        console.log(`Rated ${category} with ${value} stars for item ${index}`);
    }
});

function submitFeedback(index) {
    const feedback = document.getElementById(`feedback-${index}`).value;
    const ratings = {
        taste: document.getElementById(`taste-value-${index}`).textContent,
        fragrance: document.getElementById(`fragrance-value-${index}`).textContent,
        ambience: document.getElementById(`ambience-value-${index}`).textContent,
        value: document.getElementById(`value-value-${index}`).textContent,
        overall: document.getElementById(`overall-value-${index}`).textContent,
    };

    console.log(`Feedback for item ${index}:`, feedback);
    console.log(`Ratings for item ${index}:`, ratings);
}

function shareOnFacebook(index) {
    const feedback = document.getElementById(`feedback-${index}`).value;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(feedback)}`;
    window.open(url, '_blank');
}

function shareOnTwitter(index) {
    const feedback = document.getElementById(`feedback-${index}`).value;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(feedback)}`;
    window.open(url, '_blank');
}

function shareOnInstagram(index) {
    const feedback = document.getElementById(`feedback-${index}`).value;
    const url = `https://www.instagram.com/?url=${encodeURIComponent(feedback)}`;
    window.open(url, '_blank');
}

function showMap(lat, lng) {
    const mapPopup = document.getElementById('map-popup');
    mapPopup.classList.add('active');
    const map = new atlas.Map('map', {
        center: [lng, lat],
        zoom: 15,
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: 'AZURE_MAPS_SUBSCRIPTION_KEY'
        }
    });
    map.markers.add(
    new atlas.HtmlMarker({
        position: [lng, lat],
        text: '📍'
    }));
}
