import React, { Component,useState, useEffect }  from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '5da4af11f12e1928506a8378ef49884b';

//날씨 가져오기 
function App() {
  const [temp,setTemp] = useState(0);
  const [weather,setWeather] = useState('Loading..');
  const [city,setCity] = useState('Seoul');
  const getWeather = async () =>{
    const {data:{main:{temp},weather,name:city}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}&units=metric`);
    setTemp(temp);
    setWeather(weather[0].main);
    setCity(city);
    console.log({temp});
  };
  useEffect(() => {
    var a = getWeather()
    console.log(a)
  });
  return (
    <div className="App">
      <header className="App-header">
        <h1>Now Let's Make Weather Forecast</h1>
        <p>🌡Now Temperature is {temp} </p>
        <p>☀️Now Weather is {weather}</p>
        <p>🏙We are in {city}</p>
      </header>
    </div>
  );
}

export default App;
