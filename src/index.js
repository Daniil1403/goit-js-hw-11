import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

import { refs } from './js/refs';
import { emptyMarkup, renderMarkup } from './js/markupFunctions';
import { getPictures } from './js/searchFunction';
import { onLoad } from './js/onLoadFunction';

refs.loadMoreBtn.hidden = true;

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  emptyMarkup();

  const searchName = refs.input.value.trim();

  try {
    await getPictures(searchName).then(response => {
      if (response.data.totalHits > 0) {
        // console.log('response:  ', response);
        //console.log('response.data.totalHits (after SUBMIT): ' , response.data.totalHits);

        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );

        refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(response));

        const lightbox = new SimpleLightbox('.gallery a', {
          showCounter: false,
        });

        refs.loadMoreBtn.hidden = false;

        refs.loadMoreBtn.addEventListener('click', onLoad);
        lightbox.refresh();

        // if (refs.gallery.childElementCount >= response.data.totalHits || response.status === 400) {

        //   refs.loadMoreBtn.hidden = true;

        //   Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

        //   throw new Error();
        // }
      } else {
        emptyMarkup();
        throw new Error();
      }
    });
  } catch (error) {}
}
