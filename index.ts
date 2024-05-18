const input = document.getElementById("input") as HTMLInputElement;
const button = document.getElementById("button") as HTMLButtonElement;
const result = document.getElementById("result") as HTMLButtonElement;

function parseInput(input: string): string[] {
  let timestamps = input.split(" ").filter(time => time >= "09:00");
  if (timestamps.length === 0 || timestamps[0] > "09:00") timestamps.unshift("09:00");
  return timestamps;
}

function calculateWorkTime(timestamps: string[]): string {
  if (timestamps.length % 2 !== 1) {
    const error = "Erro. O número de horários deve ser ímpar. Este erro também pode ser causado se você entrou antes das 09:00. Modifique o horário de entrada para 09:00."
    result.textContent = error;
    throw new Error(error);
  }

  const [enterTimes, leaveTimes] = splitTimestamps(timestamps);
  const totalMinutes = calculateTotalMinutes(enterTimes, leaveTimes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return formatTime(hours, minutes);
}

function splitTimestamps(timestamps: string[]): [string[], string[]] {
  const enterTimes: string[] = [];
  const leaveTimes: string[] = [];

  timestamps.forEach((timestamp, index) => {
    if (index % 2 === 0) enterTimes.push(timestamp);
    else leaveTimes.push(timestamp);
  });

  return [enterTimes, leaveTimes];
}

function calculateTotalMinutes(enterTimes: string[], leaveTimes: string[]): number {
  let totalMinutes = 0;
  const minArrayLength = Math.min(enterTimes.length, leaveTimes.length);

  for (let i = 0; i < minArrayLength; i++) {
    const enterTimeInMinutes = convertTimeToMinutes(enterTimes[i]);
    const leaveTimeInMinutes = convertTimeToMinutes(leaveTimes[i]);
    totalMinutes += leaveTimeInMinutes - enterTimeInMinutes;
  }

  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const lastEnterTimeInMinutes = convertTimeToMinutes(enterTimes[enterTimes.length - 1]);
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  totalMinutes += currentTimeInMinutes - lastEnterTimeInMinutes;

  return totalMinutes;
}

function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(hours: number, minutes: number): string {
  return `${padZero(hours)}:${padZero(minutes)}`;
}

function padZero(value: number): string {
  return value.toString().padStart(2, "0");
}

function calculateRemainingTime(totalWorkTime: string): string {
  const totalWorkTimeInMinutes = convertTimeToMinutes(totalWorkTime);
  const targetWorkTimeInMinutes = 6 * 60; // 6 hours in minutes

  if (totalWorkTimeInMinutes >= targetWorkTimeInMinutes) return "00:00";

  const remainingTimeInMinutes = targetWorkTimeInMinutes - totalWorkTimeInMinutes;
  const remainingHours = Math.floor(remainingTimeInMinutes / 60);
  const remainingMinutes = remainingTimeInMinutes % 60;

  return formatTime(remainingHours, remainingMinutes);
}

function calculateLeaveTime(remainingTime: string): string {
  const remainingTimeInMinutes = convertTimeToMinutes(remainingTime);
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;
  const leaveTimeInMinutes = currentTimeInMinutes + remainingTimeInMinutes;
  const leaveHours = Math.floor(leaveTimeInMinutes / 60);
  const leaveMinutes = leaveTimeInMinutes % 60;

  return formatTime(leaveHours, leaveMinutes);
}

function calculateEarlyLeaveTime(leaveTime: string): string {
  const leaveTimeInMinutes = convertTimeToMinutes(leaveTime);
  const earlyLeaveTimeInMinutes = leaveTimeInMinutes - 30;
  const earlyLeaveHours = Math.floor(earlyLeaveTimeInMinutes / 60);
  const earlyLeaveMinutes = earlyLeaveTimeInMinutes % 60;

  return formatTime(earlyLeaveHours, earlyLeaveMinutes);
}

button.addEventListener("click", () => {
  const timestamps = parseInput(input.value);
  const totalWorkTime = calculateWorkTime(timestamps);
  const remainingTime = calculateRemainingTime(totalWorkTime);
  const leaveTime = calculateLeaveTime(remainingTime);
  const earlyLeaveTime = calculateEarlyLeaveTime(leaveTime);
  result.innerHTML = `Você trabalhou ${totalWorkTime} horas hoje.<br>Faltam ${remainingTime} horas para completar 6 horas de trabalho.<br>Saída prevista às ${leaveTime}.<br>Se quiser sair mais cedo, pode sair às ${earlyLeaveTime}.`;
});