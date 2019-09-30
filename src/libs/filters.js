// 年月日时分
export let dateFormat = (date) => {
  if (date) {
    let dateTime = new Date(date)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    // let week = date.getDay()
    let hour = dateTime.getHours()
    let minute = dateTime.getMinutes()
    return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2)
  }
}
// 年月日时分秒
export let dateFormatAll = (date) => {
  if (date) {
    let dateTime = new Date(date)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    // let week = date.getDay()
    let hour = dateTime.getHours()
    let minute = dateTime.getMinutes()
    let seconds = dateTime.getSeconds()
    return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + seconds).slice(-2)
  }
}
// 年月日
export let dateFormatYYYYHHDD = (date) => {
  if (date) {
    let dateTime = new Date(date)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
  }
}
