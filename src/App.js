import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map'
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  //State = how to write a variable in React
  // https://disease.sh/v3/covid-19/countries

  //USEFFECT= Runs a piece of code based on a given condition

  useEffect(() => {
    //async -> send a request, wait for it, do something with it
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => ({
          name: country.country, //United Kingdom, United Stateds
          value: country.countryInfo.iso2, // UK, USA, FR
        }));

        setCountries(countries);
      });

    };
    getCountriesData();
    //The code inside here will run once
    //when the component loads and not againj
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    console.log('Yooooooo>>>>>>', countryCode);

    setCountry(countryCode);
  };

  return (
    <div className="app">
      <div className="app__header">
        <h1>Covid 19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            {/* ;oop through all the countries and show a deop down list of options*/}
            <MenuItem value="worldwide">WorldWide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}

            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Nepal</MenuItem>
            <MenuItem value="worldwide">banglore</MenuItem>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Worldwide</MenuItem> */}
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        {/* Info boxs title="coronavirues*/}

        <InfoBox title="Coronavirus Cases" cases={12376876} total={20000} />

        <InfoBox title="Recovered Cases" cases={1237686} total={20000} />

        <InfoBox title="Deaths" cases={12376876} total={20000} />

      </div>

      {/* Table */}
      {/* Graph*/}

      {/* Map */}
      <Map />
    </div>
  );
}

export default App;
