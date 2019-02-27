
// Container of guess choices
const choices = document.getElementById('guess-container');

// List of images
const list = document.getElementById('list-data');

// List of random words
const queries = ['design', 'programming', 'fantasy', 'pasta', 'island', 'travel', 'sandwich', 'lol', 'fashion', 'landscape', 'vintage', 'film', 'art', 'animals', 'anime', 'magic', 'asia', 'dimsum', 'neopets', 'japan', 'DIY', 'europe', 'photography', 'airplane', 'books', 'fruits', 'desserts', 'hungry', 'train', 'boyband'];

// Store correct tag word
let correctQuery = '';


// Create random query
function random(length) {
    return Math.floor(Math.random() * length);
}

// Start game
function startGame(num) {

    // Find random index of correct term
    const index = random(num);

    // Copy list of queries to modify
    let tempQueries = queries.slice();

    // Clear current choices
    choices.innerHTML = "";

    for (let i = 0; i < num; i++) {

        // Create buttons for tag names
        const button = document.createElement('button');

        // Choose random query
        let query = tempQueries[random(tempQueries.length)];

        // Remove chosen query from list to prevent choosing again
        tempQueries.splice(tempQueries.indexOf(query), 1);

        // Choose correct query
        if ([i] == index) {correctQuery = query}; 
        
        // Add button classes & label button
        button.classList.add('btn', 'm-2', 'btn-lg');
        let color = 'rgb(' + random(250) + ',' + random(230) + ',' + 
        random(250) + ')';
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.textShadow = '0px 4px 3px rgba(0,0,0,0.4),0px 8px 13px rgba(0, 0, 0, 0.1),0px 15px 23px rgba(0, 0, 0, 0.1)';
        button.innerHTML = query;

        // Add button to choices container
        choices.appendChild(button);
    }
    getTaggedPhotos(correctQuery);
}

function guess(event) {
    const button = event.target;
    if (button.innerHTML == correctQuery) {
        window.alert("You're correct! The answer is " + correctQuery);
    } else {
        window.alert("Sorry. The correct answer is " + correctQuery);
    }
    startGame(4);
}

// Retrieve tagged photos from random query term
function getTaggedPhotos(tag){
    fetch('https://api.tumblr.com/v2/tagged?tag=' + tag + '&api_key=MU7temBW95XzD2XWfkC218pu4nkSkMIbTyETIyfF5bT2hIlhwm')
    .then(function (response) {
        if (!response.ok) {
            window.alert('Hey something seems wrong, contact us.')
        }
        return response.json();
    })
    .then(function(result) {
        if (!result) {
            return;
        }
        // clear list
        list.innerHTML = '';

        const items = result.response;

        let masonry;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const dateTime = new Date(item.timestamp * 1000).toLocaleDateString();
            if (item.photos != undefined) {
                const altSizes = item.photos[0].alt_sizes;
                const imgSrc = altSizes[altSizes.length - 3].url;
                const img = document.createElement('img');
                img.src = imgSrc;
                img.onload = function(){
                    masonry.layout();
                };

                img.setAttribute('dateTime', dateTime);
                const li = document.createElement('li');
                li.appendChild(img);
                list.appendChild(li);
            }
        }

        // Initialize Masonry
        masonry = new Masonry(list, {
            itemSelector: 'li',
        });

        masonry.layout();
    })
    .catch(function(err) {
        window.alert('The Tumblr API seems to be down.')
        console.log('Message: ', err);
    });
}

startGame(4);
choices.onclick = guess;