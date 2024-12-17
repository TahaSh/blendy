import './style.css'
import { createBlendy } from '../../src'

const blendy = createBlendy({ animation: 'dynamic' })

const button = document.querySelector('.button') as HTMLElement
const modalTemplate = document.querySelector('#modal') as HTMLTemplateElement

button?.addEventListener('click', (e) => {
  e.stopPropagation()
  document.body.appendChild(modalTemplate.content.cloneNode(true))
  blendy.toggle('example')
})

document.body.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).classList.contains('modal__close')) {
    blendy.untoggle('example', () => {
      const modal = document.querySelector('.modal')
      if (modal) {
        modal.remove()
      }
    })
  }
})
