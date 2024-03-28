import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

  reviews: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    axios.get("http://localhost:4000/review")
      .then(response => {
        this.reviews = response.data.reviews;
      })
      .catch(error => {
        console.error("Error fetching reviews:", error);
      });
  }


  handleDelete(id: any): void {
    Swal.fire({
      icon: "warning",
      title: `Are you sure you want to DELETE this review?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "CANCEL",
      confirmButtonColor: "#8B0000",
      cancelButtonColor: "#ccafaf",
      iconColor: "#8B0000",
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:4000/review/${id}`)
          .then((res) => {
            console.log(res);
            this.reviews = this.reviews.filter(review => review._id !== id);
            Swal.fire("Deleted!", "The review has been deleted.", "success");
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("Error!", "Failed to delete the review.", "error");
          });
      }
    });
  }

}