const countriesContainer = document.querySelector('.countries-container');
const filterByRegion = document.querySelector('.filter-by-region');
const searchInput = document.querySelector('.search-container input');
const themeChanger = document.querySelector('.theme-changer');

let allCountriesData = [];

const regions = ['africa', 'americas', 'asia', 'europe', 'oceania'];

async function fetchAllCountries() {
  countriesContainer.innerHTML = '<p>Loading countries by region...</p>';

  try {
    const allRegionData = await Promise.all(
      regions.map(region =>
        fetch(`https://restcountries.com/v3.1/region/${region}`).then(res => {
          if (!res.ok) throw new Error(`Failed for region: ${region}`);
          return res.json();
        })
      )
    );

    allCountriesData = allRegionData.flat();
    renderCountries(allCountriesData);
  } catch (err) {
    console.error("Error fetching countries by region:", err);
    countriesContainer.innerHTML = '<p>Failed to load countries. Try again later.</p>';
  }
}

function renderCountries(data) {
  if (!Array.isArray(data) || data.length === 0) {
    countriesContainer.innerHTML = '<p>No countries found.</p>';
    return;
  }

  countriesContainer.innerHTML = '';
  data.forEach((country) => {
    const countryCard = document.createElement('a');
    countryCard.classList.add('country-card');
    countryCard.href = `country.html?name=${encodeURIComponent(country.name.common)}`;
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <div class="card-text">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0] || 'N/A'}</p>
      </div>
    `;
    countriesContainer.appendChild(countryCard);
  });
}

filterByRegion.addEventListener('change', () => {
  fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
    .then(res => res.json())
    .then(renderCountries)
    .catch(err => {
      console.error("Error filtering by region:", err);
      countriesContainer.innerHTML = '<p>Failed to filter countries.</p>';
    });
});

searchInput.addEventListener('input', (e) => {
  const searchVal = e.target.value.toLowerCase();
  const filtered = allCountriesData.filter(country =>
    country.name.common.toLowerCase().includes(searchVal)
  );
  renderCountries(filtered);
});

themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Instead of fetching /v3.1/all, fetch all regions
fetchAllCountries();
