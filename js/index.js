window.onload = function(){
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          let modal = document.getElementById('modal');
          let errorText = document.getElementById('error');
          errorText.innerHTML = `<h1>Ooops! Error</h1><h2>Geolocation is not supported by this browser</h2>`;
          modal.style.display = 'block';
          let close = document.getElementById('close');
          close.addEventListener('click',()=>{
          modal.style.display = 'none';
        })
        }
    }
    getLocation();
    function showPosition(position){
      const URLS = {
        cloud:'https://s5.postimg.org/wl6idmtyf/Snow_cloud.png',
        snowflake:'https://s5.postimg.org/h9ebu5xzb/snowflake.png',
        sun:'https://s5.postimg.org/5glkmycyv/Sun.png',
        waterdrop:'https://s5.postimg.org/gmkh1nk8n/rain.png',
        fullcloud:'https://s5.postimg.org/6gggwd77r/Cloud.png',
        offcloud:'https://s5.postimg.org/fs2it5jpj/Cloud_1.png',
        thunder:'https://s5.postimg.org/toojaj7br/Thunder-512.png'
      };
       let app = {
        tempCel: '',
        tempFahr: '',
        weather: '',
        tempMode: 'celsius'
       }
       const toggle = (e)=>{
        if(app.tempMode === 'celsius'){
             e.target.innerHTML = `${app.tempFahr}° F`;
             app.tempMode = 'fahrenheit';
          }else{
            e.target.innerHTML = `${app.tempCel}° C`;
            app.tempMode = 'celsius';
          }
      }
      const toFahrenheit = (celsius)=>{
        return (celsius * (9 / 5) + 32).toFixed(0);
      }
      const fall = (cloudUrl,dropUrl,dropType)=>{
        let container = document.getElementById('icon');
        let items = [];
        for(let i = 0;i < 4;i++){
          items[i] = document.createElement('img');
          if(i === 0){
            items[i].src = cloudUrl;
            items[i].className = 'cloud';
          }else{
            items[i].src = dropUrl;
            items[i].className = 'drop';
            if(dropType === 'snowflake'){
              items[i].style.animation = 'rotation 20s infinite linear';
            }
          }
          container.appendChild(items[i]);
        }
        return items;
      }
      const rotate = (url)=>{
        let container = document.getElementById('icon');
        let item = document.createElement('img');
        item.src = url;
        container.appendChild(item);
        item.className = 'rotatingObj';
        return item;
      }
      const combine = ()=>{
        let sun = rotate(URLS.sun);
        let container = document.getElementById('icon');
        let cloud = document.createElement('img');
        cloud.src = 'https://s5.postimg.org/6gggwd77r/Cloud.png';
        container.appendChild(cloud);
        cloud.className = 'drizzleCloud';
        sun.className = 'drizzleSun';
        let drops = [];
        container.style.height = '150px';
        for(let i = 0;i < 2;i++){
          drops[i] = document.createElement('img');
          drops[i].src = URLS.waterdrop;
          drops[i].className = 'drop';
          container.appendChild(drops[i]);
        }
        console.log(container);
      }
      const clouds = (mainCLoudUrl,offCloudUrl)=>{
        let container = document.getElementById('icon');
        let mainCloud = document.createElement('img');
        let offCloud = document.createElement('img');
        mainCloud.src = mainCLoudUrl;
        offCloud.src = offCloudUrl;
        container.appendChild(mainCloud);
        container.appendChild(offCloud);
        mainCloud.className = 'mainCloud';
        offCloud.className = 'offCloud';
      }
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let promise = fetch(`https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`)
      .then((response)=>{
        return response.json();
      }).
      then((data)=>{
        app.tempCel = (data.main.temp).toFixed(0);
        app.tempFahr = toFahrenheit(data.main.temp);
        let place = document.getElementById('place');
        let weather = document.getElementById('weather');
        let toggleTemp = document.getElementById('toggleTemp');
        toggleTemp.innerHTML = `${app.tempCel}° C`;
        toggleTemp.addEventListener('click',toggle);
        place.innerHTML = `${data.name}, ${data.sys.country}`;
        app.weather = data.weather[0].main;
        weather.innerHTML = app.weather;
        switch(app.weather.toLowerCase()){
          case 'snow':fall(URLS.cloud,URLS.snowflake,'snowflake');break;
          case 'clouds':clouds(URLS.fullcloud,URLS.offcloud);break;
          case 'rain':fall(URLS.cloud,URLS.waterdrop,'waterdrop');break;
          case 'thunderstom':fall(URLS.cloud,URLS.thunder);break;
          case 'clear':rotate(URLS.sun);break;
          case 'drizzle':combine();break;
          default:clouds(URLS.fullcloud,URLS.offcloud);break;
        }
      }).catch((error)=>{
        let modal = document.getElementById('modal');
        let errorText = document.getElementById('error');
        errorText.innerHTML = `<h1>Ooops! Error</h1><h2>${error.message}</h2><h2>Please, try again later</h2>`;
        modal.style.display = 'block';
        let close = document.getElementById('close');
        close.addEventListener('click',()=>{
           modal.style.display = 'none';
        })
      });
    }
  }