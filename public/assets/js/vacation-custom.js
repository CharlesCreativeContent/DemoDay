console.log('Im walking over here')
let search = ()=>{
  let query = document.getElementById('mainQuery').value
  window.location.assign(`/browse/${query.replace(/ /g,'%20')}/${window.location.pathname.split('/').reverse()[0]}`)
}
document.getElementById('query').addEventListener('click',search)
