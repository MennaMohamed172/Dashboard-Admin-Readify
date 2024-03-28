import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import axios from 'axios';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  myUsers: any[] = [];
  displayedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    axios.get("http://localhost:4000/user")
      .then(response => {
        this.myUsers = response.data.data.users;
        this.totalPages = Math.ceil(this.myUsers.length / this.itemsPerPage);
        this.updateDisplayedUsers();
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.myUsers.slice(startIndex, endIndex);
    this.generatePageNumbers();
  }

  handleDelete(id: any): void {
    Swal.fire({
      icon: "warning",
      title: "Are you sure you want to DELETE This User ",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "CANCEL",
      confirmButtonColor: "#8B0000",
      cancelButtonColor: "#ccafaf",
      iconColor: "#8B0000",
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:4000/user/${id}`)
          .then((res) => {
            console.log(res);
            this.myUsers = this.myUsers.filter((user: any) => user._id !== id);
            this.totalPages = Math.ceil(this.myUsers.length / this.itemsPerPage);
            this.currentPage = Math.min(this.currentPage, this.totalPages);
            this.updateDisplayedUsers();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedUsers();
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

}


  // deleteUser(id: string): void {
  //   axios.delete(`http://localhost:4000/user/${id}`)
  //     .then(response => {
  //       console.log("User deleted successfully");
  //       this.fetchUsers();
  //     })
  //     .catch(error => {
  //       console.error("Error deleting user:", error);
  //     });
  // }
