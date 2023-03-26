import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import createCountryList from '../src/components/countri-list.hbs';
import createCountryCard from '../src/components/cards.hbs';
import { RestcountriesAPI } from './components/fetchCountries';

const DEBOUNCE_DELAY = 300;
const restcoutriesApi = new RestcountriesAPI();

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryCardEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
  const searchCountry = event.target.value.trim();

  if (searchCountry === '') {
    resetElement();
    return;
  }

  restcoutriesApi
    .fetchCountry(searchCountry)
    .then(date => {
      if (date.length > 10) {
        resetElement();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (date.length > 1 || date.length < 10) {
        countryCardEl.innerHTML = '';
        createCountryListCardMurkup(date);
      }

      if (date.length === 1) {
        countryListEl.innerHTML = '';
        createCountryCardMurkup(date);
        return;
      }
    })
    .catch(error => {
      resetElement();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function resetElement() {
  countryListEl.innerHTML = '';
  countryCardEl.innerHTML = '';
}

function createCountryCardMurkup(country) {
  countryCardEl.innerHTML = createCountryCard(country);
}

function createCountryListCardMurkup(country) {
  countryListEl.innerHTML = createCountryList(country);
}
