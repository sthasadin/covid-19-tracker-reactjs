import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from "./util";
import LineGraph from './LineGraph';
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

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

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });

    };
    getCountriesData();
    //The code inside here will run once
    //when the component loads and not againj
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    //tenary operator
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        //All of the data.. from the country response
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

      });
  };

  console.log("Country Infoo >>>", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* loop through all the countries and show a deop down list of options*/}
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* Info boxs title="coronavirues*/}
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

          <InfoBox title="Recovered Cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />

        </div>
        {/* Map */}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          {/* Table */}
          <Table countries={tableData} />
          <h3>WorldWide new Cases</h3>
          {/* Graph*/}
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
