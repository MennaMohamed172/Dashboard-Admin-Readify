import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-subscribed-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './subscribed-users.component.html',
  styleUrl: './subscribed-users.component.css'
})
export class SubscribedUsersComponent {
  subscribedUsers: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.fetchSubscribedUsers();
  }

  fetchSubscribedUsers(): void {
    axios.get("http://localhost:4000/subscribtion")
      .then(response => {
        this.subscribedUsers = response.data.subscribedUsers;
      })
      .catch(error => {
        console.error("Error fetching subscribed users:", error);
      });
  }
}

