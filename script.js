const AUTH_URL = "https://auth.tesla.com/oauth2/v3/token";
const VEHICLE_LIST_URL = "https://owner-api.teslamotors.com/api/1/vehicles";

document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const clientId = document.getElementById("clientId").value;
  const clientSecret = document.getElementById("clientSecret").value;

  const authData = {
    grant_type: "password",
    client_id: clientId,
    client_secret: clientSecret,
    email: email,
    password: password,
  };

  try {
    // Step 1: Authenticate
    const authResponse = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    if (!authResponse.ok) {
      throw new Error("Authentication failed. Please check your credentials.");
    }

    const authResult = await authResponse.json();
    const accessToken = authResult.access_token;

    // Step 2: Fetch Vehicle List
    const vehicleResponse = await fetch(VEHICLE_LIST_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!vehicleResponse.ok) {
      throw new Error("Failed to retrieve vehicle data.");
    }

    const vehicleResult = await vehicleResponse.json();
    displayVehicles(vehicleResult.response);
  } catch (error) {
    document.getElementById("result").innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
});

function displayVehicles(vehicles) {
  const resultDiv = document.getElementById("result");
  if (vehicles.length === 0) {
    resultDiv.innerHTML = "No vehicles found.";
    return;
  }

  let html = "<h2>Your Vehicles:</h2><ul>";
  vehicles.forEach((vehicle) => {
    html += `<li>ID: ${vehicle.id}, Name: ${vehicle.display_name}</li>`;
  });
  html += "</ul>";
  resultDiv.innerHTML = html;
}
