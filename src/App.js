import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
const API_KEY = "5da4af11f12e1928506a8378ef49884b";
//날씨 가져오기

function App() {
  const weatherOption = {
    Clouds: {
      videoName: "./weather_source/night_cloudy.mp4",
    },
    Clear: {
      videoName: "./weather_source/day_clear.mp4",
    },
    Rain: {
      videoName: "./weather_source/night_rain.mp4",
    },
    Mist: {
      videoName: "./weather_source/foggy_day.mp4",
    },
    Loading: {
      videoName: "./weather_source/night_Clear.mp4",
    },
  };
  const [temp, setTemp] = useState(0); // 온도
  const [weather, setWeather] = useState("Loading"); // 날씨 (Clouds Clear Rain Mist 등)
  const [city, setCity] = useState("..."); // 지역
  const [descript, setDescript] = useState("..."); // 날씨설명
  const [dt, setDt] = useState(new Date()); // 타임
  const [sun, setSun] = useState({ sunset: 0, sunrise: 0 }); // 일출, 일몰 시간
  const [loading, setLoading] = useState(true); // 로딩중?

  const getPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = useCallback(async () => {
    try {
      const position = await getPosition(); // 사용자 권한을 기다림
      const {
        coords: { latitude: lat, longitude: long },
      } = position;
      const {
        data: {
          main: { temp },
          weather,
          name: city,
          sys: { sunrise, sunset }, // ES6부터 key와 동일한 변수는 생략 가능
        },
      } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric&lang=kr`);
      setTemp(temp);
      setWeather(weather[0].main);
      setDescript(weather[0].description);
      setCity(city);
      setSun({ sunset, sunrise });
      setLoading(false);
    } catch (err) {
      // 권한을 거절했을 경우도 여기로 감
      alert("날씨나 위치를 못 불러왔어요.");
      console.error(err.message);
    }
  }, []);
  useEffect(() => {
    void getWeather();
    const intervalKey = setInterval(() => getWeather(), 360000);
    var timer = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timer);
      clearInterval(intervalKey);
    };
  }, [getWeather]);
  function tick() {
    setDt(new Date());
  }
  if (loading) {
    return (
      <div className="App">
        <header className="Loading-header">
          <h1>Loading...</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="article">
          <h1>
            <span role="img" aria-label="city">
              🏙
            </span>{" "}
            We are in {city}
          </h1>
          <p>
            <span role="img" aria-label="clock">
              ⏰ {dt.toLocaleTimeString()}
            </span>
          </p>
          <p>
            <span role="img" aria-label="temper">
              🌡
            </span>{" "}
            Current Temperature is {temp}
            <span role="img">°C</span>{" "}
          </p>
          <p>
            <span role="img" aria-label="sun">
              ☀️
            </span>{" "}
            Current Weather : {descript}
          </p>
        </div>
        <div className="fullscreen-video">
          <video muted={true} autoPlay={true} loop={true} src={weatherOption[weather].videoName}></video>
        </div>
      </header>
    </div>
  );
}

export default App;
