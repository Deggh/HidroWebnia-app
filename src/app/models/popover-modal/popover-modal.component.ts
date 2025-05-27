import { Component, Input } from '@angular/core';
import { PopoverController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popover-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-list>
      <ion-item disabled [ngStyle]="{'opacity': 0.6, 'pointer-events': 'none'}">
        <ion-label>{{ description }}</ion-label>
      </ion-item>
      <ion-item button (click)="editar()">
        <ion-icon name="create-outline" slot="start"></ion-icon>
        <ion-label>Editar</ion-label>
      </ion-item>
      <ion-item button (click)="deletar()">
        <ion-icon name="trash-outline" slot="start"></ion-icon>
        <ion-label>Deletar</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class PopoverModalComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;

  constructor(private popoverCtrl: PopoverController) {}

  editar() {
    this.popoverCtrl.dismiss({ action: 'editar', id: this.id, name: this.name, description: this.description });
  }

  deletar() {
    this.popoverCtrl.dismiss({ action: 'deletar', id: this.id });
  }
}
