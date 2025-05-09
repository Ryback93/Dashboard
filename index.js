// Time and Greeting Elements
const greetingEl = document.getElementById("greeting");
const timeEl = document.getElementById("time");

// Function to update greeting based on time of day
function updateGreeting() {
    const hours = new Date().getHours();
    const greeting =
        hours < 12 ? "Good morning" :
        hours < 18 ? "Good afternoon" :
        "Good evening";
    greetingEl.textContent = greeting;
    
    // Initially show greeting
    greetingEl.style.opacity = 1;
    
    // After 3.5 seconds, fade out greeting
    setTimeout(() => {
        greetingEl.style.opacity = 0;
        greetingEl.style.transition = "opacity 1.5s ease";
    }, 3500);
    
    // After 5 seconds, show time
    setTimeout(() => {
        timeEl.style.opacity = 1;
        timeEl.style.transition = "opacity 1.5s ease";
        timeEl.style.visibility = "visible";
    }, 5000);
}

// Function to update time
function updateTime() {
    const date = new Date();
    timeEl.textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"});
}

// Initialize time and greeting
updateGreeting();
updateTime();
setInterval(updateTime, 1000);


fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
        document.getElementById("author").textContent = `By: ${data.user.name}`
    })
    .catch(err => {
        // Use a default background image/author
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080)`
        document.getElementById("author").textContent = `By: Dodi Achmad`
    })

// ====== Crypto Section ======
const cryptoData = {
  bitcoin: { symbol: "BTC", name: "Bitcoin" },
  ethereum: { symbol: "ETH", name: "Ethereum" },
  dogecoin: { symbol: "DOGE", name: "Dogecoin" },
  solana: { symbol: "SOL", name: "Solana" }
};

const cryptoSelector = document.getElementById("crypto-selector");
const cryptoDisplay = document.getElementById("crypto-data");

async function fetchCryptoData(coinId) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    if (!res.ok) throw new Error("API Error");
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch crypto data:", err);
    return {
      error: true,
      message: err.message,
      id: coinId,
      name: cryptoData[coinId]?.name || "Unknown"
    };
  }
}

function displayCryptoData(data) {
  if (data?.error) {
    cryptoDisplay.innerHTML = `<p>Couldn't load ${data.name} data</p>`;
    return;
  }

  const priceChange24h = data.market_data.price_change_percentage_24h;
  const priceClass = priceChange24h >= 0 ? "price-up" : "price-down";

  cryptoDisplay.innerHTML = `
    <div class="crypto-coin">
      <img src="${data.image.small}" alt="${data.name}">
      <span><strong>${data.symbol.toUpperCase()}</strong> ${data.name}</span>
    </div>
    <p>Price: $${data.market_data.current_price.usd.toLocaleString()}</p>
    <p class="${priceClass}">24h: ${priceChange24h.toFixed(2)}%</p>
    <p>High: $${data.market_data.high_24h.usd.toLocaleString()}</p>
    <p>Low: $${data.market_data.low_24h.usd.toLocaleString()}</p>
  `;
}

// Initialize crypto display
cryptoSelector.addEventListener("change", async (e) => {
  const data = await fetchCryptoData(e.target.value);
  displayCryptoData(data);
});

// Load default coin
fetchCryptoData(cryptoSelector.value).then(displayCryptoData);

// Auto-refresh every 5 minutes
setInterval(() => {
  fetchCryptoData(cryptoSelector.value).then(displayCryptoData);
}, 300000);
function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}

setInterval(getCurrentTime, 1000)

navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});

fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => {
        const quote = data[0];
        document.getElementById("quote").textContent = `"${quote.q}" — ${quote.a}`;
    })
    .catch(err => {
        console.error("Failed to fetch quote:", err);
        document.getElementById("quote").textContent = `"Stay positive, work hard, make it happen." — Unknown`;
    });

// Spotify Player Controls
let currentPlaylist = '37i9dQZF1EIX8cvrp6nb6F'; // Default playlist

function updateSpotifyPlayer(playlistId) {
  const player = document.getElementById('spotify-player');
  player.innerHTML = `
    <iframe src="https://open.spotify.com/embed/playlist/${playlistId}" 
            width="300" height="80" frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media"></iframe>
  `;
}

const spotifyPlaylists = {
  workout: '37i9dQZF1DX76Wlfdnj7AP',
  focus: '37i9dQZF1DX9uKNf5jGX6m',
  chill: '37i9dQZF1DX4WYpdgoIcn6'
};

function setTimeAppropriatePlaylist() {
  const hours = new Date().getHours();
  if (hours >= 6 && hours < 12) {
    updateSpotifyPlayer(spotifyPlaylists.focus); // Morning focus
  } else if (hours >= 12 && hours < 18) {
    updateSpotifyPlayer(spotifyPlaylists.workout); // Afternoon energy
  } else {
    updateSpotifyPlayer(spotifyPlaylists.chill); // Evening relaxation
  }
}

// Initialize player
setTimeAppropriatePlaylist();