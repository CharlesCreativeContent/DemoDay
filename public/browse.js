'use strict';

var tinderContainer = document.querySelector('.tinder');
var allCards = document.querySelectorAll('.tinder--card');
var nope = document.getElementById('nope');
var love = document.getElementById('love');

function initCards( trigger=false, card, index) {
  var newCards = document.querySelectorAll('.tinder--card:not(.removed)');
if(trigger){
        //Database Document Creation
              fetch('../../vacation/newEvent', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'name': card.children[1].innerHTML,
                  'dateTime': 'This Works',
                  'id':window.location.pathname.split('/').reverse()[0]
                })
              })
              .then(data => {
                console.log('saved')
              })
}
  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    card.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on('pan', function (event) {
    el.classList.add('moving');
  });

  hammertime.on('pan', function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
    tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
  });

  hammertime.on('panend', function (event) {
    el.classList.remove('moving');
    tinderContainer.classList.remove('tinder_love');
    tinderContainer.classList.remove('tinder_nope');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle('removed', !keep);

    if (keep) {
      event.target.style.transform = '';
    } else {
      if(document.querySelectorAll('.tinder--card:not(.removed)').length<=1){
        document.getElementById('searchBar').style.display='block'
      }
      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;
      if(event.deltaX>0){
console.log(el.children[0])
        fetch('../../vacation/newEvent', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': el.children[4].children[0].innerHTML,
            'dateTime': '',
            'id':window.location.pathname.split('/').reverse()[0],
            'link': el.children[0].href,
            'img': el.children[3].src,
            'category': [el.children[2].innerHTML, el.children[0].children[0].src],
            'location': card.children[4].children[1].innerHTML,
            'distance': el.children[4].children[3].innerHTML.slice(0,-3),
          })
        })
        .then(data => {
          console.log('saved')
        })
      }
      event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';

      initCards();
    }
  });
});

function createButtonListener(love) {
  return function (event) {

    var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add('removed');
    if(cards.length<=1){
      document.getElementById('searchBar').style.display="block"
    }
    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';

            //Database Document Creation
                  fetch('../../vacation/newEvent', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      'name': card.children[4].children[0].innerHTML,
                      'dateTime': '',
                      'link': card.children[0].href,
                      'id':window.location.pathname.split('/').reverse()[0],
                      'img': card.children[3].src,
                      'category': [card.children[2].innerHTML, card.children[0].children[0].src],
                      'location': card.children[4].children[1].innerHTML,
                      'distance': card.children[4].children[3].innerHTML.slice(0,-3),
                    })
                  })
                  .then(data => {
                    console.log('saved')
                  })


    } else {
      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';

    }

    initCards();

    event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);

let newSearch = ()=>{
  let input = document.querySelector('[name=query]').value
  if(input===''){
    alert('Enter Search Query')
  }else{
    let vacation = window.location.pathname.split('/').reverse()[0]
    window.location.assign(`/browse/${input.replace(/ /g,'%20')}/${vacation}`)
  }
}

document.querySelector('#nextSearch').addEventListener('click',newSearch)
document.querySelector('#topLogo').addEventListener('click',()=>{
  window.location.assign(`../../vacation/${window.location.pathname.split('/').reverse()[0]}`)
})
