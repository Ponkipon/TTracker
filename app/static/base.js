export function formatDate(date){
    const dateObject = new Date(date);
    const formattedDate = dateObject.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = dateObject.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedDate}, ${formattedTime}`
}

export function getTime(date){
    const dateObject = new Date(date);
    const formattedTime = dateObject.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedTime}`
}

export function getDate(date){
    const dateObject = new Date(date);
    const formattedDate = dateObject.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return `${formattedDate}`
}
// shamelessly copied function from chatgpt to calculate duration with dynamic formatting
export function getDuration(startdate, enddate) {
    const timerStartTime = new Date(startdate);
    var currentTime;
    if (enddate){
        currentTime = new Date(enddate);
    }else {
        currentTime = new Date();
    }

    const durationMs = currentTime.getTime() - timerStartTime.getTime();

    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60) % 24;
    const days = Math.floor(totalMinutes / (60 * 24));

    let result = [];
    if (days > 0) result.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (totalHours > 0 || days > 0) result.push(`${totalHours} ${totalHours === 1 ? "hour" : "hours"}`);
    if (minutes > 0 || result.length === 0) result.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);

    return `${result.join(", ")}`;
}

export function hide(object) {
    object.innerHTML = '';
    object.className = '';
}
