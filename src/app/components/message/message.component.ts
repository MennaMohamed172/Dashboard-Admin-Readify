import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {


  messages: any[] = [];
  displayedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.fetchMessages();
  }

  fetchMessages(): void {
    axios.get("http://localhost:4000/contact")
      .then(response => {
        this.messages = response.data;
        this.totalPages = Math.ceil(this.messages.length / this.itemsPerPage);
        this.updateDisplayedUsers();
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });;
  }


updateDisplayedUsers(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedUsers = this.messages.slice(startIndex, endIndex);
  this.generatePageNumbers();
}

  handleDelete(id: any): void {
    Swal.fire({
      icon: "warning",
      title: `Are you sure you want to DELETE this message?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "CANCEL",
      confirmButtonColor: "#8B0000",
      cancelButtonColor: "#ccafaf",
      iconColor: "#8B0000",
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:4000/contact/${id}`)
          .then((res) => {
            console.log(res);
            this.messages = this.messages.filter(message => message._id !== id);
            Swal.fire("Deleted!", "The review has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("Error!", "Failed to delete the review.", "error");
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
