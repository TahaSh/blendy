import { Component, signal } from '@angular/core';
import { createBlendy } from '../../../../src'
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  imports: [
    ModalComponent
  ],
  template: `


    <app-modal [hidden]="!showModal()" (close)="close()"></app-modal>
    

    <button class="button" data-blendy-from="example" (click)="open()">
      <span>Open</span>
    </button>
  `,
  styles: [],
})
export class AppComponent {
  title = 'blendy-angular-example';
  readonly showModal = signal(false);

  private readonly blendy = createBlendy({ animation: 'spring' });
  open() {
    this.blendy.toggle('example', () => {
      this.showModal.set(true);
    })
  }

  close() {
    this.blendy.untoggle('example', () => {
      this.showModal.set(false);
    });
  }
}
