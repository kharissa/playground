const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-prev');
const nextButton = document.querySelector('.lightbox-next');
const lightbox = document.querySelector('.lightbox');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightboxImage = document.querySelector('.lightbox-image');

let currentImageIndex;
let changeImageIndex;

function showImage(event) {
    // show lightbox
    lightbox.classList.remove('hidden');

    // replace lightbox image with clicked image 
    const elementClickedOn = event.target;
    const galleryItemParent = elementClickedOn.parentElement;

    // change slide index
    currentImageIndex = galleryItemParent.getAttribute('currentSlide');

    // Change lightbox to element clicked on html
    lightboxImage.innerHTML = galleryItemParent.innerHTML;

}

function nextImage(event) {
    event.preventDefault();

    if (currentImageIndex == galleryItems.length) {
        changeImageIndex = 1;
    } else {
        changeImageIndex = parseInt(currentImageIndex) + 1;
    }

    // Call next slide
    changeSlide(changeImageIndex);
}

function prevImage(event) {
    event.preventDefault();
    
    if (currentImageIndex == 1) {
        changeImageIndex = galleryItems.length;
    } else {
        changeImageIndex = parseInt(currentImageIndex) - 1;
    }

    // Call next slide
    changeSlide(changeImageIndex);
}

function changeSlide(n) {
    let match = document.querySelectorAll("li\[currentSlide\='" + n + "']");

    // Change lightbox to corresponding image
    lightboxImage.innerHTML = match[0].innerHTML;

    // Update slide index
    currentImageIndex = changeImageIndex;
}

function hideImage(event) {
    event.preventDefault();
    lightbox.classList.add('hidden');
}

// For every gallery item, functionality to show image on lightbox on click
for (let index in galleryItems) {
    galleryItems[index].onclick = showImage;
}

// Hide lightbox upon close button click
closeButton.onclick = hideImage;
nextButton.onclick = nextImage;
prevButton.onclick = prevImage;