import { Component, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [

  ],
  template: `
    <div class="modal" data-blendy-to="example">
      <div>
        <div class="modal__header">
          <h2 class="modal__title">Blendy</h2>
          <button class="modal__close" (click)="close.emit()"></button>
        </div>
        <div class="modal__content">
          <p>
            Meet Blendy, a framework-agnostic tool that smoothly transitions
            one element into another with just a few lines of code.
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  readonly close = output();
}
