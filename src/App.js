import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [data, setData] = useState(null);
  const [latitude, setLatitude] = useState(30.2672);
  const [longitude, setLongitude] = useState(-97.7431);
  const [submittedLatitude, setSubmittedLatitude] = useState(latitude);
  const [submittedLongitude, setSubmittedLongitude] = useState(longitude);
  const [error, setError] = useState(null);

  const cities = {
    Dallas: { latitude: 32.7767, longitude: -96.7970 },
    Houston: { latitude: 29.7604, longitude: -95.3698 },
    Austin: { latitude: 30.2672, longitude: -97.7431 },
  };

  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${submittedLatitude}&longitude=${submittedLongitude}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1`)
      .then(response => response.json())
      .then(
        (result) => {
          setData(result);
          setError(null);
        },
        (error) => {
          setError(error);
          setData(null);
        }
      )
  }, [submittedLatitude, submittedLongitude]);

  const handleLatitudeChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitude(event.target.value);
  };

  const handleCityClick = (city) => {
    const tempLatitude = (cities[city].latitude);
    const tempLongitude = (cities[city].longitude);
    setSubmittedLatitude(tempLatitude);
    setSubmittedLongitude(tempLongitude);
  };

  const handleSubmit = () => {
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setError("Invalid latitude or longitude! Please enter a latitude between -90 and 90 and a longitude between -180 and 180.");
      return;
    }
    setSubmittedLatitude(latitude);
    setSubmittedLongitude(longitude);
    setError(null);
  };
  
  return (
    <div>
      <button onClick={() => handleCityClick('Dallas')}>Dallas</button>
      <button onClick={() => handleCityClick('Houston')}>Houston</button>
      <button onClick={() => handleCityClick('Austin')}>Austin</button>
      <br></br><br></br>
      <input type="text" value={latitude} onChange={handleLatitudeChange} placeholder="Latitude" />
      <input type="text" value={longitude} onChange={handleLongitudeChange} placeholder="Longitude" />
      <button onClick={handleSubmit}>Submit</button>
      {error && <div>Error: {error}</div>}
      {!error && data && (
        <div>
          <h1>Weather Data for Today:</h1>
          <h3>Latitude: {submittedLatitude}, Longitude: {submittedLongitude}</h3>
          <div> 
            {data.hourly && data.hourly.time.map((item, index) => {
            const day = new Date(item);
            const dateTime = day.toLocaleTimeString();

            return (
              <div key={index}>
                <p>{dateTime} ~ {data.hourly.temperature_2m[index]}{data.hourly_units.temperature_2m}</p>
              </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
