import React, {useState, useEffect }  from "react";
import axios from "axios";
import "./App.css";
const API_KEY = "5da4af11f12e1928506a8378ef49884b";
//날씨 가져오기 

function App() {
  const weatherOption = {
    Clouds :{
      videoName : "./weather_source/night_cloudy.mp4"
    },
    Clear :{
      videoName : "./weather_source/day_clear.mp4"
    },
    Rain : {
      videoName : "./weather_source/night_rain.mp4"
    },
    Mist :{
      videoName:"./weather_source/foggy_day.mp4"
    },
    Loading :{
      //videoName : "./weather_source/night_clear.mp4"
    }
  };  
  const [temp,setTemp] = useState(0);
  const [weather,setWeather] = useState("Loading");
  const [city,setCity] = useState("...");
  const [descript,setDescript] = useState("...");
  const [dt,setDt] = useState(new Date());
  const [sun,setSun]=useState({sunset:0,sunrise:0});
  const [geo,setGeo] = useState({lat:0,long:0});
  const [loading,setLoading] = useState(true);
  const getLocation =() =>{
    if  ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) =>{
        console.log(position)
      });
    } else {
      console.log("I Cant find you..")
      return {lat:0,long:0}
    }
  }
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  const getPosition = (options) => {
    return new Promise((resolve,reject) =>{
      navigator.geolocation.getCurrentPosition(resolve,reject,options);
    });
  }
 
  const getWeather = async () =>{
    getPosition()
    .then((position)=>{
      setGeo({lat:position.coords.latitude,long:position.coords.longitude});
    })
    .catch((err)=>{
      console.error(err.message);
    })
    
    const {data:{main:{temp},weather,name:city,sys:{sunrise:sunrise,sunset:sunset}}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.long}&appid=${API_KEY}&units=metric&lang=kr`);
    setTemp(temp);
    setWeather(weather[0].main);
    setDescript(weather[0].description);
    setCity(city);
    setSun({sunset:sunset,sunrise:sunrise});
    setLoading(false);
    console.log("call")
    
  };
  useEffect(() => {
    
    getWeather();
    setInterval(()=>getWeather(),360000);
    var timer =setInterval(()=>tick(),1000);
        return function cleanup(){
            clearInterval(timer);
    };
  },[]);
  function tick(){
    setDt(new Date());
  }
  if(loading){
    return(
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
            <h1><span role="img" aria-label="city">🏙</span> We are in {city}</h1>
            <p><span role="img" aria-label="clock">⏰ {dt.toLocaleTimeString()}</span></p>
            <p><span role="img" aria-label="temper">🌡</span> Current Temperature is {temp}<span role="img">°C</span> </p>
            <p><span role="img" aria-label="sun">☀️</span> Current Weather : {descript}</p>
          </div>
          <div className="fullscreen-video">
            <video muted={true} autoPlay={true} loop={true} src={weatherOption[weather].videoName}></video>
          </div>
        </header>
      </div>
    );
  
}

export default App;
