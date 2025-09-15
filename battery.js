function formatTime(seconds) {
  if (seconds === Infinity) return 'Calculating...';
  if (isNaN(seconds) || seconds < 0) return 'Unknown';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function updateBatteryInfo(battery) {
  const levelPercent = Math.round(battery.level * 100);
  let html = `<p>Battery Level: <span class="${levelPercent < 20 ? 'low' : 'charge'}">${levelPercent}%</span></p>`;
  html += `<p>Status: <span class="${battery.charging ? 'charging' : ''}">${battery.charging ? "Charging ⚡" : "Discharging"}</span></p>`;

  if (battery.charging) {
    html += `<p>Time to full charge: <b>${formatTime(battery.chargingTime)}</b></p>`;
  } else {
    html += `<p>Time remaining: <b>${formatTime(battery.dischargingTime)}</b></p>`;
  }

  document.getElementById('battery-info').innerHTML = html;
}

if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    // Initial update
    updateBatteryInfo(battery);

    // Listen for changes
    battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
    battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
    battery.addEventListener('chargingtimechange', () => updateBatteryInfo(battery));
    battery.addEventListener('dischargingtimechange', () => updateBatteryInfo(battery));
  });
} else {
  document.getElementById('battery-info').innerHTML = `
    <p>⚠️ Battery Status API is not supported on your browser.</p>
    <p>Try using Chrome, Edge, or another Chromium-based browser.</p>
  `;
}