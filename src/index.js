import PictureApiService from './js/picture-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryTpl from './templates/gallery-card.hbs';
import throttle from 'lodash.throttle';
import SmoothScroll from 'smoothscroll-for-websites';

const refs = {
  searchForm: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  submitButton: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  homeButton: document.querySelector('.home-btn'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.homeButton.addEventListener('click', onSmoothScroll);
refs.input.addEventListener('input', throttle(onInput), 300);

let lightbox = null;
const pictureServise = new PictureApiService();

function onSearch(evt) {
  evt.preventDefault();
  pictureServise.query = evt.currentTarget.elements.searchQuery.value;
  fetchingQuery();
  refs.input.value = '';
  pictureServise.resetPageNumber();
  cleanMarcUp();
  refs.submitButton.setAttribute('disabled', 'disabled');
  observer.unobserve(refs.loader);
}

function fetchingQuery() {
  refs.loader.classList.remove('hidden');
  pictureServise.fetchPicture().then(renderGallery).catch(console.log);
}

function renderGallery(data) {
  if (!data) {
    observer.unobserve(refs.loader);
    refs.loader.classList.add('hidden');
    refs.submitButton.setAttribute('disabled', 'disabled');
    refs.homeButton.classList.add('hidden');
    return;
  }
  marcUp(data);
  observer.observe(refs.loader);
  refs.loader.classList.add('hidden');
  refs.homeButton.classList.remove('hidden');

  if (pictureServise.totalPage < pictureServise.pageNumber) {
    observer.unobserve(refs.loader);
    refs.loader.classList.add('hidden');
  }
}

function marcUp(dataArray) {
  if (!dataArray) return;

  lightbox && lightbox.destroy();

  const marcUp = galleryTpl(dataArray);
  refs.gallery.insertAdjacentHTML('beforeend', marcUp);

  lightbox = new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function cleanMarcUp() {
  refs.gallery.innerHTML = '';
}

const options = {
  root: null,
  rootMargin: '200px',
  threshold: 0,
};

const observer = new IntersectionObserver(observerCallback, options);

function observerCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchingQuery();
    }
  });
}

function onSmoothScroll(evt) {
  evt.preventDefault();
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function onInput(evt) {
  refs.submitButton.removeAttribute('disabled');
}

SmoothScroll({
  stepSize: 175,
  animationTime: 800,
  accelerationDelta: 200,
  accelerationMax: 6,
  keyboardSupport: true,
  arrowScroll: 100,
});
// function onScroll() {
//   setTimeout(() => {
//     const documentRect = document.documentElement.getBoundingClientRect();
//     console.log(documentRect.bottom);
//     if (documentRect.bottom < document.documentElement.clientHeight + 100) {
//       refs.loader.classList.remove('hidden');
//       pictureServise
//         .fetchPicture()
//         .then(data => {
//           // if (!data) {
//           //   window.removeEventListener('scroll', onScroll);
//           //   return;
//           // }
//           refs.loader.classList.add('hidden');
//           renderGallery(data);
//         })
//         .catch();
//     }
//   }, 500);
// }

// function onClick() {
//   refs.loader.classList.remove('hidden');
//   pictureServise.fetchPicture().then(data => {
//     renderGallery(data);
//     if (data.length < 40) {
//       // refs.loadMoreButton.classList.add('hidden');
//       refs.homeButton.classList.add('center');
//       // refs.loadMoreButton.setAttribute('disabled', 'disabled');
//       // refs.footer.classList.add('center');
//     }
//     refs.loader.classList.add('hidden');
//   });
// }

// function a(val) {
//   return true - val;
// }

// const b = a('4') + a('-4') + a(-'4') + a(4);
// console.log(b);
// console.log(a('4'), a('-4'), a(-'4'), a(4));
