import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLogin: boolean = false;
  userName: string = "Enes Demirtas";
  avatar: string = "avatar1";
  users: {key: string, value:{avatar:string, userName:string}}[] = [];

  message:string = "";
  selectedUser:string = "";
  selectedUserAvatar: string = "";

  hub: signalR.HubConnection | undefined;

  login() {
    this.isLogin = true;
    this.connection();
  }

  connection(){
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7153/chat-hub")
      .build();

    this.hub
      .start()
      .then(()=> {
        console.log("Connection started...");
        this.hub?.invoke("Connect", this.userName, this.avatar);

        this.hub?.on("Chat", (res:any)=> {
          console.log(res);
        })

        this.hub?.on("Login", (res:any[])=> {

          this.users = res.filter(p=>p.value.userName != this.userName);
        });
      });
  }

  select(user:any){
    this.selectedUser = user.value.userName;
    this.selectedUserAvatar = user.value.avatar
  }

  send(){
    this.hub?.invoke("Send",this.selectedUser, this.message);
  }
}
