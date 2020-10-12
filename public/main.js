//Takes care of vacation creation
let newVacation = ()=>{

let location = document.getElementById('vacationLocation').value
let name = document.getElementById('vacationName').value
document.getElementById('vacationName').value=''
document..getElementById('vacationLocation').value=''
let arr = Array.from(document.querySelectorAll('.vacationList')).map(x=>x.innerHTML.toLowerCase())
if (arr.includes(name.toLowerCase())){alert('Vacation name taken! Try a different Name')}else
{
//Mapping API Fetch
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.replace(/' '/g,'%20') }.json?access_token=pk.eyJ1IjoieHNoYXduY3giLCJhIjoiY2tlams1YTNnMDZ3MDJycXNsNGlxbzJlYyJ9.yhpBv07FJ2TZfJW62fs7sA`)
    .then(response => response.json())
    .then(data => {
console.log(data)
//Database Document Creation
      fetch('newVacation', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'name': name,
          'location': data.features[0].center,
          'localName': data.features[0].text
        })
      })
      .then(response => response.json())
      .then(data =>
window.location.assign(`/vacation/${data}`)
      )
    })
    }
  }

document.getElementById('button').addEventListener('click',newVacation)

//======Future Clone and Like========//
// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });
//==========FutureDeleteButton=======//
// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
