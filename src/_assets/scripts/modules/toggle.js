function togglePressed() {
  let pressedState = this.getAttribute('aria-pressed')
  document.body.classList.toggle(this.dataset.toggle)
	if (pressedState === 'true') {
		this.setAttribute('aria-pressed', 'false')
	} else {
		this.setAttribute('aria-pressed', 'true')
	}
}

export function initToggle() {
  const toggles = document.querySelectorAll('.button-toggle')
  Array.from(toggles).forEach(el => {
    el.addEventListener('click', togglePressed)
  })
}
