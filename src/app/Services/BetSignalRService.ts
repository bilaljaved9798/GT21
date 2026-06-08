import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserbetSignalRService {
   public hubConnection!: signalR.HubConnection;

  // Observable stream
  private userBetsSource = new Subject<any>();

  // Public observable
  userBets$ = this.userBetsSource.asObservable();

  startConnection(userId: string) {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7243/bethub?userId=${userId}`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR Connected');
      })
      .catch(err => console.log(err));

    this.hubConnection.on('ReceiveUserBets', (data) => {
      this.userBetsSource.next(data);
      console.log(data);
    });
  }

  getUserBets(userId: number) {
    this.hubConnection.invoke('GetUserBets', userId)
      .catch(err => console.log(err));
  }
}