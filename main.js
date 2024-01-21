const input = document.getElementById('input');
const button = document.getElementById('button');
const result = document.getElementById('result');

function getTimestamps() {
  return input.value.split(' ');
}

function convertHoursToMinutes(hourTimestamps) {
  const minutesArray = []; // Change variable name to avoid conflict

  for (let i = 0; i < hourTimestamps.length; i++) {
    const [hours, minutes] = hourTimestamps[i].split(':');
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    minutesArray.push(totalMinutes); // Use the correct variable name
  }

  return minutesArray;
}

function calculateWorkedHours(timestamps) {
  const minutes = convertHoursToMinutes(timestamps);
  let totalWorkedMinutes = 0;
  const currentTime = new Date(); // current time

  for (let i = 0; i < minutes.length; i += 2) {
    let endTime;

    if (i + 1 < minutes.length) {
      endTime = minutes[i + 1];
    } else {
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      endTime = currentHours * 60 + currentMinutes;
    }

    totalWorkedMinutes += endTime - minutes[i];
  }
  const totalWorkedHours = totalWorkedMinutes / 60;
  return totalWorkedHours
}

function calculateLeavingTimeAndWorkedHours(currentTime, timestamps) {
  const totalWorkedHours = calculateWorkedHours(timestamps);
  const hoursNeeded = 6;
  const hoursNeededIfLevingEarlier = 5.5;

  if (totalWorkedHours >= hoursNeeded) {
    return {
      leavingTime: "You can leave now",
      workedHours: totalWorkedHours,
    };
  }

  const leavingTime = new Date(currentTime.getTime() + (hoursNeeded - totalWorkedHours) * 60 * 60 * 1000);
  const leavingEarlierTime = new Date(currentTime.getTime() + (hoursNeededIfLevingEarlier - totalWorkedHours) * 60 * 60 * 1000);

  const formatedLeavingTime = leavingTime.toTimeString().split(' ')[0];
  const formatedLeavingEarlierTime = leavingEarlierTime.toTimeString().split(' ')[0];

  return {
    leavingTime: formatedLeavingTime,
    leavingEarlierTime: formatedLeavingEarlierTime,
    workedHours: totalWorkedHours,
  };
}

button.addEventListener('click', () => {
  const timestamps = getTimestamps();
  const currentTime = new Date();
  const { leavingTime, leavingEarlierTime, workedHours } = calculateLeavingTimeAndWorkedHours(currentTime, timestamps);
  result.textContent = `Total worked hours: ${workedHours.toFixed(2)} hours. Leave at ${leavingTime} or after ${leavingEarlierTime}`;
});
