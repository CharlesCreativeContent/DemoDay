// File for your custom JavaScript
      document.querySelector('body').style.backgroundColor='black'
          document.querySelector('body').style.backgroundColor = '#efefef'
    //Takes care of vacation creation
    let newVacation = ()=>{
      console.log('Still running here')

    let location = document.getElementById('vacationLocation').value
    let name = document.getElementById('vacationName').value
    document.getElementById('vacationName').value=''
    document.getElementById('vacationLocation').value=''
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
