const countryName = new URLSearchParams(location.search).get('name');
const flagImage = document.querySelector('.country-details img');
const countryNameH1 = document.querySelector('.country-details h1');
const nativeName = document.querySelector('.native-name');
const population = document.querySelector('.population');
const region = document.querySelector('.region');
const subRegion = document.querySelector('.sub-region');
const capital = document.querySelector('.capital');
const topLevelDomain = document.querySelector('.top-level-domain');
const currencies = document.querySelector('.currencies');
const languages = document.querySelector('.languages');
const borderCountries = document.querySelector('.border-countries');

fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
  .then((res) => res.json())
  .then(([country]) => {
    flagImage.src = country.flags.svg;
    flagImage.alt = `${country.name.common} flag`;
    countryNameH1.innerText = country.name.common;
    population.innerText = country.population.toLocaleString('en-IN');
    region.innerText = country.region;
    topLevelDomain.innerText = country.tld?.join(', ') || 'N/A';
    capital.innerText = country.capital?.[0] || 'N/A';
    subRegion.innerText = country.subregion || 'N/A';

    nativeName.innerText =
      country.name.nativeName
        ? Object.values(country.name.nativeName)[0].common
        : country.name.common;

    currencies.innerText = country.currencies
      ? Object.values(country.currencies).map((c) => c.name).join(', ')
      : 'N/A';

    languages.innerText = country.languages
      ? Object.values(country.languages).join(', ')
      : 'N/A';

    if (country.borders && country.borders.length > 0) {
      country.borders.forEach((borderCode) => {
        fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
          .then((res) => res.json())
          .then(([borderCountry]) => {
            const borderTag = document.createElement('a');
            borderTag.innerText = borderCountry.name.common;
            borderTag.href = `country.html?name=${encodeURIComponent(borderCountry.name.common)}`;
            borderCountries.appendChild(borderTag);
          });
      });
    } else {
      borderCountries.innerHTML = '<span>No border countries</span>';
    }
  })
  .catch((err) => {
    console.error('Error fetching country data:', err);
    document.querySelector('.country-details').innerHTML = '<p>Failed to load country details.</p>';
  });
