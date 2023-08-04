// Helpers
const wrapElements = (elems, wrapType, wrapClass) => {
  elems.forEach(char => {
    const wrapEl = document.createElement(wrapType)
    wrapEl.classList = wrapClass
    char.parentNode.appendChild(wrapEl)
    wrapEl.appendChild(char)
  })
}

// Slideshow class
class Slider {
  #current = 0

  constructor(element, reverseDirection = false) {
    this.element = element

    // Reverse direction
    this.reverseDirection = reverseDirection
    this.items = [...this.element.querySelectorAll('.slider-item')]
    this.itemsInner = this.items.map(item => item.querySelector('.slider-item-inner'))

    // Set current
    this.items[this.current].classList.add('slider-item-current')

    // Total items
    this.itemsTotal = this.items.length
    gsap.set([this.items, this.itemsInner], { 'will-change': 'transform' })
  }
  next() {
    this.navigate(1)
  }
  prev() {
    this.navigate(-1)
  }
  get current() {
    return this.#current
  }
  set current(value) {
    this.#current = value
  }
  // direction: 1 || -1 (next || prev)
  navigate(direction) {
    if (this.isAnimating) return false
    this.isAnimating = true

    const previous = this.current
    this.current = direction === 1 ?
      this.current < this.itemsTotal - 1 ? ++this.current : 0 :
      this.current > 0 ? --this.current : this.itemsTotal - 1

    const currentItem = this.items[previous]
    const currentInner = this.itemsInner[previous]
    const upcomingItem = this.items[this.current]
    const upcomingInner = this.itemsInner[this.current]

    const tl = gsap
      .timeline({
        defaults: { duration: 1.1, ease: 'power3.inOut' },
        onComplete: () => {
          this.items[previous].classList.remove('slider-item-current')
          this.items[this.current].classList.add('slider-item-current')

          this.isAnimating = false
        }
      })

    tl.to(currentItem, {
        yPercent: this.reverseDirection ? direction * 100 : -direction * 100,
        onComplete: () => gsap.set(currentItem, { opacity: 0 })
      })
      .to(currentInner, {
        yPercent: this.reverseDirection ? -direction * 30 : direction * 30,
        startAt: {
          rotation: 0
        },
        rotation: -direction * 15,
        scaleY: 2.8
      }, 0)
      .to(upcomingItem, {
        startAt: {
          opacity: 1,
          yPercent: this.reverseDirection ? -direction * 80 : direction * 80
        },
        yPercent: 0
      }, 0)
      .to(upcomingInner, {
        startAt: {
          yPercent: this.reverseDirection ? direction * 30 : -direction * 30,
          scaleY: 2.8,
          rotation: direction * 15
        },
        yPercent: 0,
        scaleY: 1,
        rotation: 0
      }, 0)
  }
}

// Background slider
const sliderBG = new Slider(document.querySelector('.slider-bg'))

// Foreground slider (passing true as the second argument to reverse the animation)
const sliderFG = new Slider(document.querySelector('.slider-fg'), true)

// Navigation
const navigate = action => {
  sliderBG[action]()
  sliderFG[action]()
} 

Observer.create({
  target: window, // can be any element (selector text is fine)
  type: "wheel,touch,scroll,pointer", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
  onUp: () => navigate('next'),
  onDown: () => navigate('prev'),
  wheelSpeed: -1
})