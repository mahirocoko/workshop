const cardTransitonElem = document.querySelector('.card-transition')
const cardTransitonWrapperElem = document.querySelector('.card-transition-wrapper')
cardTransitonElem.addEventListener('click', () => {
  if (cardTransitonElem.classList.toString().includes('active')) cardTransitonElem.classList.remove('active')
  else cardTransitonElem.classList.add('active')
})

cardTransitonWrapperElem.addEventListener('mousemove', (e) => {
  const ract = cardTransitonWrapperElem.getBoundingClientRect()

  const x = e.pageX - ract.left - ract.width / 2
  const y = -(e.pageY - ract.top - ract.width / 2)
  const d = 5

  cardTransitonElem.style.transform = `
    rotateY(calc(${x / d}deg))
    rotateX(calc(${y / d}deg))
  `
})

cardTransitonWrapperElem.addEventListener('mouseleave', (e) => {
  cardTransitonElem.style.transform = `rotateX(0deg) rotateY(0deg)`
})