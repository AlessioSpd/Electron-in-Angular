# Guida integrazione Electron.js con Angular

## Setup Base
- ### Creazione nuovo progetto Angular
    ```console
    ng new ProjectName
    ```
- ### Installazione Electron per Angular
    ```console
    npm install ngx-electron --save
    ```

- ### All'interno della nostra app, bisogna creare il `main.js` per Electron, nel mio caso, lo chiamo app.js e lo inserisco nella directory radice.<br>All'interno del file, scriviamo la basi per far partire la desktop-app.
    ```javascript
    const {app, BrowserWindow, ipcMain} = require('electron');
    const url = require("url");
    const path = require('path');

    let mainWindow;

    const createWindow = () => {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        mainWindow.loadURL(
            url.format({
                //path che prende l'html root dalla build di angular, 'test-electron' lo dovrai sostituire con il nome del tuo progetto
                pathname: path.join(__dirname, `./dist/test-electron/index.html`),
                protocol: 'file:',
                slashes: true
            })
        );

        mainWindow.webContents.openDevTools();
    }

    app.whenReady().then( () => {
        createWindow()
    });
    ```

- ### Ora, all' interno di `package.json` linkiamo il main di electron
    ```javascript
    ...
    "main": "app.js",
    ...
    ```

- ### Cambiamo l'esecuzione alla chiamata del comando `start`
    ```javascript
    "start": "ng serve" /*diventa*/ "start": "ng build --base-href ./ && electron ."
    ```

## Setup ed esempio di come gestire le comunicazione con ipc
- ### Setup
    - #### Installiamo il modulo
        ```console
        npm i ngx-electron --save
        ```

    - #### Importiamo il modulo nell'app.module.ts di Angular
        ```typescript
        import { NgModule } from '@angular/core';
        import { BrowserModule } from '@angular/platform-browser';

        import { AppRoutingModule } from './app-routing.module';
        import { AppComponent } from './app.component';
        //importiamo il modulo
        import { NgxElectronModule } from 'ngx-electron';

        @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            //lo inseriamo negl'imports
            NgxElectronModule
        ],
        providers: [],
        bootstrap: [AppComponent]
        })
        export class AppModule { }
        ```
        ora possiao utilizzare le comunicazione con ipc, facciamo un'esempio.
    - ### Creaiamo
        ```console
        npm i ngx-electron --save
        ```
- ### Esempio
    - #### Creiamo un semplice button all'interno dell'html del nostro componente
        ```html
        <button (click)="test()">Click Me!</button>
        ```
    - #### All'interno del `.ts` de componente, importiamo la libreria e creiamo la funzione
        ```typescript
        import { Component } from '@angular/core';
        //importiamo il modulo
        import { ElectronService } from 'ngx-electron';

        @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
        })
        export class AppComponent {
        title = 'TestElectron';

        //lo definiamo dal costruttore
        constructor(private ElecServ : ElectronService){
            //definiamo l' handler che riceve dati dal main di electron
            this.ElecServ.ipcRenderer.on('risposta', () => {
            console.log('ho ricevuto la risposta');
            });
        }

        //definiamo la funzione che manda dati al main di electron
        public prova() {
            if (this.ElecServ.isElectronApp){
                this.ElecServ.ipcRenderer.send('prova');
            }
        }
        ```

    - #### Infine, andiamo a definire l'handler e il sender anche nel main di electron
        ```javascript
        ipcMain.on('prova', () => {
            console.log('prova ricevuta da app.js');
            mainWindow.webContents.send('risposta');
        })
        ```
        Come noterete, nel terminale relativo ad electron, e nella console dall'applicazione web, avremo i messaggi mandati tra i due soggetti.
