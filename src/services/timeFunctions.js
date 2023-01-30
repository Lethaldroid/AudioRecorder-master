export const convertToSecInt = (time) => {
    const HourMinuteSecMilsec = time.split(':')
    const seconds = parseInt(HourMinuteSecMilsec[0]) * 3600
        + parseInt(HourMinuteSecMilsec[1].replace(/\s+/g, ' ').trim()) * 60
        + parseInt(HourMinuteSecMilsec[2].replace(/\s+/g, ' ').trim())
        + parseInt(HourMinuteSecMilsec[3].replace(/\s+/g, ' ').trim()) / Math.pow(10, HourMinuteSecMilsec[3].replace(/\s+/g, ' ').trim().length);
    return seconds
}