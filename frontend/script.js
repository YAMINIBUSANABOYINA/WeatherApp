document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if(data.error){
                alert(data.error);
                return;
            }

            const animationDiv = document.getElementById("weatherAnimation");
            const infoDiv = document.getElementById("weatherInfo");

            // Clear previous animations
            animationDiv.innerHTML = "";
            infoDiv.innerHTML = "";

            // Set animation based on weather condition
            const condition = data.condition.toLowerCase();
            if(condition.includes("sun") || condition.includes("clear")){
                const sun = document.createElement("div");
                sun.classList.add("sun");
                animationDiv.appendChild(sun);
            } else if(condition.includes("cloud")){
                const cloud = document.createElement("div");
                cloud.classList.add("cloud");
                animationDiv.appendChild(cloud);
            } else if(condition.includes("rain") || condition.includes("drizzle")){
                const rainContainer = document.createElement("div");
                rainContainer.classList.add("rain-container");
                for(let i=0;i<20;i++){
                    const drop = document.createElement("div");
                    drop.classList.add("raindrop");
                    rainContainer.appendChild(drop);
                }
                animationDiv.appendChild(rainContainer);
            }

            // Weather text info
            infoDiv.innerHTML =`<h2>${data.name}, ${data.country}</h2>
                                <p>Temperature: ${data.temperature} °C</p>
                                <p>Condition: ${data.condition}</p>
                                <p>Humidity: ${data.humidity}%</p>
                                <p>Wind Speed: ${data.wind_speed} m/s</p>`;
        })
        .catch(err => {
            alert("Error fetching data.");
        });
});
