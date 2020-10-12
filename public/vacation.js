var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
let button = document.querySelector('#query')

let newSearch = ()=>{
let query = document.querySelector('[name="query"]')

window.location.assign(`/browse/${query.value.replace(/ /g,'%20')}/${window.location.pathname.split('/').reverse()[0]}`)

/*
fetch('/maps', {
  method: 'put',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    'vacation': window.location.pathname.split('/').reverse()[0],
    'search': query.value
  })
})
.then(response => response.json())
.then(data=>console.log(data))
*/

}

//Takes care of vacation creation
let newEvent = ()=>{
let dateTime = document.querySelector('[name="dateTime"]').value
let name = document.querySelector('[name="event"]').value
document.querySelector('[name="dateTime"]').value=''
document.querySelector('[name="event"]').value=''

let arr = Array.from(document.querySelectorAll('.events')).map(x=>x.innerHTML.toLowerCase())
if (arr.includes(name.toLowerCase())){alert('Event name taken! Try a different Name')}else
{
//Database Document Creation
      fetch('newEvent', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'name': name,
          'dateTime': dateTime,
          'id':id
        })
      })
      .then(data => {
        window.location.reload()
      })

}
}

var input = document.querySelector('[type="submit"]')
input.addEventListener('click',newEvent)
button.addEventListener('click', newSearch)

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
//
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
