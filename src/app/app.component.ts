import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TestElectron';

  constructor(private ElecServ : ElectronService){
    this.ElecServ.ipcRenderer.on('risposta', () => {
      console.log('ho ricevuto la risposta');
    });
  }

  public prova() {
    if (this.ElecServ.isElectronApp){
      this.ElecServ.ipcRenderer.send('prova');
    }
  }
}
