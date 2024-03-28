import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deactivated-users',
  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './deactivated-users.component.html',
  styleUrls: ['./deactivated-users.component.css']

})
export class DeactivatedUsersComponent implements OnInit {
  deactivatedUsers: any[] = [];

  constructor() { }
  ngOnInit(): void {
    this.fetchDeactivatedUsers();
  }

  fetchDeactivatedUsers(): void {
    axios.get("http://localhost:4000/auth/deactivated")
      .then(response => {
        console.log(response.data); // Log the response to inspect its structure
        if (response.data && response.data.deactivatedAccounts) {
          this.deactivatedUsers = response.data.deactivatedAccounts;
        } else {
          console.error("Invalid response structure:", response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching deactivated users:", error);
      });
  }
  
  activateUser(userId: string): void {
    Swal.fire({
      icon: "warning",
      title: `Are you sure you want to activate this user?`,
      showCancelButton: true,
      confirmButtonText: "Activate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios.post(`http://localhost:4000/auth/deactivated`, { userId })
          .then((res) => {
            console.log(res);
            // Optionally, update UI to remove the activated user from the list
            this.fetchDeactivatedUsers();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  
}
}