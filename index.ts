const input = document.getElementById("input") as HTMLInputElement;
const button = document.getElementById("button") as HTMLButtonElement;
const result = document.getElementById("result") as HTMLButtonElement;

function parseInput(input: string): string[] {
  let timestamps = input.split(" ");
  timestamps = timestamps.filter(time => time >= "09:00");

  if (timestamps.length === 0 || timestamps[0] > "09:00") {
    timestamps.unshift("09:00");
  }

  return timestamps;
}
function calculateWorkTime(timestamps: string[]): string {
  if (timestamps.length % 2 !== 1) {
    const error = "Erro. O número de horários deve ser ímpar. Este erro também pode ser causado se você entrou antes das 09:00. Modifique o horário de entrada para 09:00."
    result.textContent = error;
    throw new Error(error);
  }

  const enterTimes: string[] = [];
  const leaveTimes: string[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    if (i % 2 === 0) {
      enterTimes.push(timestamps[i]);
    } else {
      leaveTimes.push(timestamps[i]);
    }
  }

  let totalMinutes = 0;

 const minArrayLength = Math.min(enterTimes.length, leaveTimes.length);

for (let i = 0; i < minArrayLength; i++) {
    const enterTime = enterTimes[i].split(":");
    const leaveTime = leaveTimes[i].split(":");

    const enterHours = parseInt(enterTime[0]);
    const enterMinutes = parseInt(enterTime[1]);
    const leaveHours = parseInt(leaveTime[0]);
    const leaveMinutes = parseInt(leaveTime[1]);

    const enterTimeInMinutes = enterHours * 60 + enterMinutes;
    const leaveTimeInMinutes = leaveHours * 60 + leaveMinutes;

    totalMinutes += leaveTimeInMinutes - enterTimeInMinutes;
}

  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  const lastEnterTime = enterTimes[enterTimes.length - 1].split(":");
  const lastEnterHours = parseInt(lastEnterTime[0]);
  const lastEnterMinutes = parseInt(lastEnterTime[1]);

  const lastEnterTimeInMinutes = lastEnterHours * 60 + lastEnterMinutes;
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  totalMinutes += currentTimeInMinutes - lastEnterTimeInMinutes;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${padZero(hours)}:${padZero(minutes)}`;

  function padZero(value: number): string {
    return value.toString().padStart(2, "0");
  }
}

function calculateRemainingTime(totalWorkTime: string): string {
  const [totalHours, totalMinutes] = totalWorkTime.split(":").map(Number);
  const totalWorkTimeInMinutes = totalHours * 60 + totalMinutes;

  const targetWorkTimeInMinutes = 6 * 60; // 6 hours in minutes

  if (totalWorkTimeInMinutes >= targetWorkTimeInMinutes) {
    return "00:00";
  }

  const remainingTimeInMinutes =
    targetWorkTimeInMinutes - totalWorkTimeInMinutes;
  const remainingHours = Math.floor(remainingTimeInMinutes / 60);
  const remainingMinutes = remainingTimeInMinutes % 60;

  return `${padZero(remainingHours)}:${padZero(remainingMinutes)}`;

  function padZero(value: number): string {
    return value.toString().padStart(2, "0");
  }
}

function calculateLeaveTime(remainingTime: string): string {
  const [remainingHours, remainingMinutes] = remainingTime.split(":").map(Number);
  const remainingTimeInMinutes = remainingHours * 60 + remainingMinutes;

  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  const leaveTimeInMinutes = currentTimeInMinutes + remainingTimeInMinutes;
  const leaveHours = Math.floor(leaveTimeInMinutes / 60);
  const leaveMinutes = leaveTimeInMinutes % 60;

  return `${padZero(leaveHours)}:${padZero(leaveMinutes)}`;

  function padZero(value: number): string {
    return value.toString().padStart(2, "0");
  }
}

function calculateEarlyLeaveTime(leaveTime: string): string {
  const [leaveHours, leaveMinutes] = leaveTime.split(":").map(Number);
  const leaveTimeInMinutes = leaveHours * 60 + leaveMinutes;

  const earlyLeaveTimeInMinutes = leaveTimeInMinutes - 30;
  const earlyLeaveHours = Math.floor(earlyLeaveTimeInMinutes / 60);
  const earlyLeaveMinutes = earlyLeaveTimeInMinutes % 60;

  return `${padZero(earlyLeaveHours)}:${padZero(earlyLeaveMinutes)}`;

  function padZero(value: number): string {
    return value.toString().padStart(2, "0");
  }
}

button.addEventListener("click", () => {
  const timestamps = parseInput(input.value);
  const totalWorkTime = calculateWorkTime(timestamps);
  const remainingTime = calculateRemainingTime(totalWorkTime);
  const leaveTime = calculateLeaveTime(remainingTime);
  const earlyLeaveTime = calculateEarlyLeaveTime(leaveTime);
  result.innerHTML = `Você trabalhou ${totalWorkTime} horas hoje.<br>Faltam ${remainingTime} horas para completar 6 horas de trabalho.<br>Saída prevista às ${leaveTime}.<br>Se quiser sair mais cedo, pode sair às ${earlyLeaveTime}.`;
});