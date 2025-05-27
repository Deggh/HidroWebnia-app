import { Clipboard } from '@capacitor/clipboard';
import { firstValueFrom } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverModalComponent } from '../../models/popover-modal/popover-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false,
})
export class AdminPage implements OnInit {

  devices: any[] | null = null;  // Variável para armazenar os dispositivos

  constructor(private authService: AuthService, private router: Router, private devicesService: DevicesService, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, private toastController: ToastController, private popoverCtrl: PopoverController) {}

  async ngOnInit() {
    const devicesObservable = await this.devicesService.getDevices();
    devicesObservable.subscribe(data => {
      this.devices = data;
    });
  }

  async openPopover(ev: Event, id: string, name: string, description: string) {
    const popover = await this.popoverCtrl.create({
      component: PopoverModalComponent,
      event: ev,
      translucent: true,
      componentProps: {
        id,
        name,
        description
      }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data?.action === 'editar') {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      this.mostrarFormulario(data.id, formData);
    } else if (data?.action === 'deletar') {
      this.confirmarDeletar(data.id);
    }
  }

  async mostrarFormulario(id: string, formData: FormData) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Dados',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: formData.get('name') || '',
          placeholder: 'Digite o Nome',
        },
        {
          name: 'description',
          type: 'text',
          value: formData.get('description') || '',
          placeholder: 'Digite a Descrição',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            console.log('Dados Salvos:', data.name, data.description);
            formData.set('name', data.name);
            formData.set('description', data.description);

            try {
              const response = await firstValueFrom(this.devicesService.patchDevice(id, formData));

              // Atualiza a lista de dispositivos após salvar
              (await this.devicesService.updateDevices()).subscribe((updatedDevices) => {
                this.devices = updatedDevices;
              });

              const message = typeof response === 'string' ? response : response?.msg || 'Dispositivo atualizado com sucesso!';
              const toast = await this.toastController.create({
                message: message,
                duration: 3000,
                color: 'success',
                position: 'top',
                positionAnchor: 'menuA',
              });
              await toast.present();
            } catch (error: any) {
              const errorMessage = error.error?.msg || error.error?.message || 'Ocorreu um erro. Tente novamente.';
              const toast = await this.toastController.create({
                message: `${errorMessage}`,
                duration: 3000,
                color: 'danger',
                position: 'top',
                positionAnchor: 'menuA',
              });
              await toast.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }


  async confirmarDeletar(id: string) {
    try {
      await firstValueFrom(this.devicesService.deleteDevice(id));

      (await this.devicesService.updateDevices()).subscribe(updatedDevices => {
        this.devices = updatedDevices;  // Atualiza a lista de dispositivos
      });

      const message = 'Dispositivo deletado com sucesso!';

      const toast = await this.toastController.create({
        message: message,
        duration: 3000,
        color: 'success',
        position: 'top',
        positionAnchor: 'menuA',
      });
      await toast.present();

    } catch (error: any) {
      const errorMessage = error.error?.msg || error.error?.message || 'Ocorreu um erro. Tente novamente.';

      const toast = await this.toastController.create({
        message: `${errorMessage}`,
        duration: 3000,
        color: 'danger',
        position: 'top',
        positionAnchor: 'menuA',
      });
      await toast.present();
    }
  }

/*
  async mostrarFormulario(id: string, formData: FormData) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Dados',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: formData.get('name') || '',
          placeholder: 'Digite o Nome'
        },
        {
          name: 'description',
          type: 'text',
          value: formData.get('description') || '',
          placeholder: 'Digite a Descrição'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            console.log('Dados Salvos:', data.name, data.description);
            formData.set('name', data.name);
            formData.set('description', data.description);
            console.log('Novos Dados:', formData.get('name'), formData.get('description'));
            try {
              const response = await firstValueFrom(this.devicesService.patchDevice(id, formData));

              (await this.devicesService.updateDevices()).subscribe(updatedDevices => {
                this.devices = updatedDevices;  // Atualiza a lista de dispositivos
              });

              const message = typeof response === 'string' ? response : response?.msg || 'Dispositivo atualizado com sucesso!';

              const toast = await this.toastController.create({
                message: message,
                duration: 3000,
                color: 'success',
                position: 'top',
                positionAnchor: 'menuA',
              });
              await toast.present();

            } catch (error: any) {
              const errorMessage = error.error?.msg || error.error?.message || 'Ocorreu um erro. Tente novamente.';

              const toast = await this.toastController.create({
                message: `${errorMessage}`,
                duration: 3000,
                color: 'danger',
                position: 'top',
                positionAnchor: 'menuA',
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarDeletar(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Deleção',
      message: 'Tem certeza de que deseja deletar essa hidroponia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Deletar',
          handler: async () => {
            try {
              await firstValueFrom(this.devicesService.deleteDevice(id));

              (await this.devicesService.updateDevices()).subscribe(updatedDevices => {
                this.devices = updatedDevices;  // Atualiza a lista de dispositivos
              });

              const message = 'Dispositivo deletado com sucesso!';

              const toast = await this.toastController.create({
                message: message,
                duration: 3000,
                color: 'success',
                position: 'top',
                positionAnchor: 'menuA',
              });
              await toast.present();

            } catch (error: any) {
              const errorMessage = error.error?.msg || error.error?.message || 'Ocorreu um erro. Tente novamente.';

              const toast = await this.toastController.create({
                message: `${errorMessage}`,
                duration: 3000,
                color: 'danger',
                position: 'top',
                positionAnchor: 'menuA',
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openActionsMenu(id: string, name: string, description: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Descrição: ${description}`,
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);

            this.mostrarFormulario(id, formData);
          }
        },
        {
          text: 'Deletar',
          handler: () => {
            this.confirmarDeletar(id);
          }
        },
      ]
    });

    await actionSheet.present();
  }
*/


  /*
  image: File | null = null;

  selecionarImagem(event: any) {
    this.image = event.target.files[0];
  }
  */

  name = '';
  description = '';
  email = '';

  async registerDevice() {
    if (!this.name || !this.email) {
        const toast = await this.toastController.create({
          message: 'Nome e Email são obrigatórios!',
          duration: 3000,
          color: 'warning',
          position: 'top',
          positionAnchor: 'menuA',
        });
        await toast.present();
        return; // Interrompe a execução
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('email', this.email);

    this.devicesService.postDevice(formData).subscribe(
      async () => {
        const message = 'Dispositivo cadastrado com sucesso!';
        const toast = await this.toastController.create({
          message: message,
          duration: 3000,
          color: 'success',
          position: 'top',
          positionAnchor: 'menuA',
        });
        await toast.present();
        (await this.devicesService.updateDevices()).subscribe(updatedDevices => {
          this.devices = updatedDevices;  // Atualiza a lista de dispositivos
        });
      },
      async (error) => {
        const errorMessage = error.error?.msg || error.error?.message || 'Ocorreu um erro. Tente novamente.';
        const toast = await this.toastController.create({
          message: `${errorMessage}`,
          duration: 3000,
          color: 'danger',
          position: 'top',
          positionAnchor: 'menuA',
        });
        await toast.present();
      }
    );
}

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  hidroponia = false;
  detalhes = false;
  novaHidroponia = false;

  copiado: { [key: string]: boolean } = {};

  async copiarTexto(event: Event, id: string) {
    event.stopPropagation(); // Impede que o clique ative o evento do .card

    await Clipboard.write({
      string: id
    });

    // Troca o ícone para "check"
    this.copiado[id] = true;

    // Exibir um Toast confirmando a cópia
    const toast = await this.toastController.create({
      message: `ID copiado: ${id}`,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();

    // Restaurar o ícone original após 2 segundos
    setTimeout(() => {
      this.copiado[id] = !this.copiado[id];
    }, 2000);
  }


  setDefaultImage(event: any) {
    event.target.src = '../../assets/img/default_hidroponia.png'; // Caminho da imagem padrão
  }

  async logout() {
    try {
      await this.authService.logout(); // Garante que o token foi removido
      console.log('Token removido com sucesso');
      this.router.navigate(['/login']); // Só redireciona depois que o token foi removido
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}


