import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  myCarts: any[] = [];
  displayedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  pages: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fetchCarts();
  }

  fetchCarts(): void {
    axios
      .get('http://localhost:4000/cart/all')
      .then((response) => {
        this.myCarts = response.data.carts;
        this.totalPages = Math.ceil(this.myCarts.length / this.itemsPerPage);
        this.updateDisplayedUsers();
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }
  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.myCarts.slice(startIndex, endIndex);
    this.generatePageNumbers();
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
