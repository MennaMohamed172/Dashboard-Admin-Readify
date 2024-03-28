import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  displayedCategories: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4; // Number of categories per page
  totalPages: number = 1;
  pages: number[] = [];
  myCategories: any[] = [];
  selectedImageFile: File | null = null;

  constructor() {}

  ngOnInit(): void {
    this.fetchCategories();
  }
  fetchCategories(): void {
    axios
      .get('http://localhost:4000/category')
      .then((response: any) => {
        if (response.data && response.data.status === 'SUCCESS') {
          this.myCategories = response.data.data.allCategories;
          this.totalPages = Math.ceil(
            this.myCategories.length / this.itemsPerPage
          );
          this.updateDisplayedCategories();
          // window.location.reload();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  updateDisplayedCategories(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedCategories = this.myCategories.slice(startIndex, endIndex);
    this.generatePageNumbers();
  }

  handleDelete(id: any): void {
    Swal.fire({
      icon: 'warning',
      title: `Are you sure you want to DELETE this category?`,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'CANCEL',
      confirmButtonColor: '#8B0000',
      cancelButtonColor: '#ccafaf',
      iconColor: '#8B0000',
    }).then((result: any) => {
      if (result.isConfirmed) {
        // If user confirms, proceed with delete action
        axios
          .delete(`http://localhost:4000/category/${id}`)
          .then((res) => {
            console.log(res);
            // Update categories list after successful deletion
            this.myCategories = this.myCategories.filter(
              (category: any) => category._id !== id
            );
            Swal.fire({
              icon: 'success',
              title: 'Category deleted successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed to delete category!',
              text:
                err.message || 'An error occurred while deleting the category.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#8B0000',
            });
          });
      }
    });
  }

  handleEdit(category: any, form: NgForm): void {
    form.setValue({
      newCategory: category.categoryName,
    });

    axios
      .delete(`http://localhost:4000/category/${category._id}`)
      .then((res) => {
        if (res.data && res.data.status === 'SUCCESS') {
          console.log('Category deleted successfully:', res.data.message);
        } else {
          console.error('Delete request failed:', res.data.message);
        }
      })
      .catch((err) => {
        console.error('Failed to delete category:', err);
      });
  }

  handleSubmit(form: NgForm): void {
    // // Get category name from form
    // let category = form.value.newCategory;
    // // Get image file from component property
    // let imageFile = this.selectedImageFile;
    // // Check if image file is available
    // if (imageFile) {
    //   // Create FormData object
    //   let formData = new FormData();
    //   formData.append('categoryName', category);
    //   formData.append('categoryImage', imageFile);
    //   // Make axios POST request
    //   axios
    //     .post(`http://localhost:4000/category`, formData)
    //     .then((res) => {
    //       console.log(res); // Log the response for debugging
    //       if (res.data && res.data.status === 'SUCCESS') {
    //         // Update UI to reflect the newly created category
    //         this.myCategories.push(res.data.data.newCategory);
    //         // Optionally, you can reset the form here
    //         form.reset();
    //       } else {
    //         console.error('Category creation failed:', res.data.message);
    //       }
    //     })
    //     .catch((err) => {
    //       console.error('Failed to create category:', err);
    //     });
    // } else {
    //   console.error('Image file not selected.');
    // }
    // Get category name from form
    let category = form.value.newCategory;

    // Get image file from component property
    let imageFile = this.selectedImageFile;

    // Check if image file is available
    if (imageFile) {
      // Create FormData object
      let formData = new FormData();
      formData.append('categoryName', category);
      formData.append('categoryImage', imageFile);

      // Make axios POST request to add the category
      axios
        .post(`http://localhost:4000/category`, formData)
        .then((res) => {
          console.log(res); // Log the response for debugging
          if (res.data && res.data.status === 'SUCCESS') {
            // After successful addition, fetch the updated list of categories
            this.fetchCategories();
            // Optionally, you can reset the form here
            form.reset();
          } else {
            console.error('Category creation failed:', res.data.message);
          }
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
          console.error('Failed to create category:', err);
        });
    } else {
      this.errorMessage = 'Image file not selected.';
      console.error('Image file not selected.');
    }
  }

  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedImageFile = fileList[0];
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCategories();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedCategories();
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedCategories();
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }
}
