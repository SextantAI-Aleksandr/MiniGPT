var textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml2 .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.ml2',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });



/*https://codepen.io/juliangarnier/pen/VwKdEjm */

//SPINNER 3
anime({
    targets: '.fading-circle',
    easing: 'easeOutElastic',
    loop: true,
    scale: [0, 1],
    opacity: {
      value: [1, 0],
      easing: 'linear',
      duration: 1200,
    },
    delay: (el, i) => 150 * i,
  })
  
  