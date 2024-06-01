import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
// import { HttpClihent } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Ibook } from '../../models/ibook';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit {
  searchTitle: string = ''; // Input field value for searching book title
  searchResults: any[] = []; // Array to store search results
  currentPage: number = 1; // Current page number
  booksPerPage: number = 4;
  apiUrl = 'http://localhost:4000/book'; // Define apiUrl here
  displayedBooks: any[] = [];

  updateDone: boolean = false;
  bookJsonData: any[] = [];
  selectedFile: File | null = null;
  imageSelected: boolean = false;
  selectedPdfFile: File | null = null;
  book: Ibook = {} as Ibook;
  categoryNames: any[] = [];
  updateMode: boolean = false;
  books: any = {
    newBookTitle: '',
    newBookDescription: '',
    newBookPrice: '',
    newDiscount: '',
    newAuthor: '',
    newbookImage: null,
    newbookPdf: '',
    newCategory: '',
    newPlanProfilePicture: null,
  };
  URL: string = '';
  addBookForm: FormGroup;
  constructor(
    private http: HttpClient,
    private BookService: BookService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {
    this.addBookForm = this.formbuilder.group({
      bookTitle: new FormControl('', [
        Validators.required,
        // Validators.minLength(6),
      ]),
      bookDescription: new FormControl('', [Validators.required]),
      bookPrice: new FormControl('', [Validators.required]),
      discount: new FormControl('', [Validators.required]),
      Author: new FormControl('', [Validators.required]),
      bookImage: new FormControl('', [Validators.required]),
      bookPdf: new FormControl('', [Validators.required]),
      category: new FormControl('', []),
    });
  }

  get bookTitle() {
    return this.addBookForm.get('bookTitle');
  }

  get bookDescription() {
    return this.addBookForm.get('bookDescription');
  }

  get bookPrice() {
    return this.addBookForm.get('bookPrice');
  }

  get discount() {
    return this.addBookForm.get('discount');
  }

  get Author() {
    return this.addBookForm.get('Author');
  }

  get bookImage() {
    return this.addBookForm.get('bookImage');
  }

  get bookPdf() {
    return this.addBookForm.get('bookPdf');
  }

  get category() {
    return this.addBookForm.get('category');
  }

  onSelectFile(e: any): void {
    // console.log(e.target.files[0].bookTitle);
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.addEventListener('load', (event: Event) => {
          this.URL = (event.target as FileReader).result as string;
          this.book.bookImage = this.URL;
        });
        reader.addEventListener('error', (event: Event) => {
          console.log(event);
        });
      }
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.imageSelected = true;
  }

  onPdfSelected(event: any): void {
    this.selectedPdfFile = event.target.files[0];
  }
  getAllBooks(): void {
    this.BookService.getAllbook().subscribe({
      next: (data: any) => {
        this.bookJsonData = data.data.allBooks;
        // Perform pagination after fetching books
        this.paginateBooks();
      },
      error: (error: any) => {
        console.error('Error fetching books:', error);
      },
    });
  }

  fetchReviewsForBooks(): void {
    // Iterate over each book and fetch reviews
    this.bookJsonData.forEach(book => {
      // Assuming you have the book ID available in 'book._id'
      this.BookService.getReviewsForBook(book._id).subscribe({
        next: (data: any) => {
          book.reviews = data.reviews;
        },
        error: (error: any) => {
          console.error('Error fetching reviews for book:', book._id, error);
        }
      });
    });
  }
  
  paginateBooks(): void {
    const startIndex = (this.currentPage - 1) * this.booksPerPage;
    const endIndex = startIndex + this.booksPerPage;
    this.displayedBooks = this.bookJsonData.slice(startIndex, endIndex);
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.bookJsonData.length / this.booksPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginateBooks();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateBooks();
    }
  }
  fetchCategories() {
    this.BookService.getAllCategories().subscribe({
      next: (data: any) => {
        console.log('Categories:', data.data.allCategories);
        this.categoryNames = data.data.allCategories; // Store both ID and name
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  ngOnInit(): void {
    
    this.getAllBooks();
    this.fetchCategories();
  
    // Check if the element with id 'searchTitle' exists before adding event listener
    // const searchInputElement = document.getElementById('searchTitle');
    // if (searchInputElement) {
    //   searchInputElement.addEventListener('input', (event) => {
    //     const inputValue = (event.target as HTMLInputElement).value.trim();
    //     this.searchTitle = inputValue;
    //     this.searchBooks();
    //   });
    // }
  }
  

  addBook() {
    const formData = new FormData();
    console.log(formData.get('bookTitle'));
    console.log(this.bookTitle?.value); // Using optional chaining here
    console.log(formData.get('bookDescription'));
    console.log(this.bookDescription?.value);
    if (this.selectedFile) {
      formData.append('bookImage', this.selectedFile);
    }
    if (this.selectedPdfFile) {
      formData.append('bookPdf', this.selectedPdfFile);
    }
    formData.append('category', this.books.newCategory);
    const selectedCategory = this.categoryNames.find(
      (category) => category._id === this.books.newCategory
    );
    if (selectedCategory) {
      formData.append('categoryName', selectedCategory.categoryName);
    }
    formData.append('bookTitle', this.books.newBookTitle);
    formData.append('bookDescription', this.books.newBookDescription);
    formData.append('bookPrice', this.books.newBookPrice);
    formData.append('discount', this.books.newDiscount);
    formData.append('Author', this.books.newAuthor);
    // formData.append('category', this.books.newCategory);

    this.BookService.addBook(formData).subscribe({
      next: (data: any) => {
        if (data && data.newBook) {
          console.log(data.newBook); // Check the structure of the response
          this.book = data.newBook;
          this.bookJsonData.push(data.newBook); // Assuming the response contains the new book object
          this.getAllBooks();
          // this.addBookForm.reset();
        } else {
          console.error('Unexpected response format:', data);
        }
      },
    });
  }

  deletebook(id: any) {
    Swal.fire({
      icon: 'warning',
      title: `Are you sure you want to DELETE this book?`,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'CANCEL',
      confirmButtonColor: '#8B0000',
      cancelButtonColor: '#ccafaf',
      iconColor: '#8B0000',
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('Deleting book with id:', id);
        if (!id) {
          console.error('Error: ID is undefined');
          return; // Return early if id is undefined
        }

        this.BookService.deletebook(id).subscribe({
          next: (data) => {
            console.log('Coupon deleted successfully:', data);
            this.getAllBooks();
          },
          error: (error) => {
            console.error('Error deleting coupon:', error);
            // Handle error
          },
        });
      }
    });
  }

  updateBook(id: string) {
    let updatedBook = this.bookJsonData.find((book) => book._id === id);
    if (updatedBook) {
      // Populate the form with the selected book's data
      this.books = {
        newBookTitle: updatedBook.bookTitle,
        newBookDescription: updatedBook.bookDescription,
        newBookPrice: updatedBook.bookPrice,
        newDiscount: updatedBook.discount,
        newAuthor: updatedBook.Author,
        newCategory: updatedBook.category,
        newBookImage: updatedBook.bookImage.url, // Add this line to populate the image field
        newbookPdf: updatedBook.bookPdf.url, // Add this line to populate the PDF field
      };
      // Set the flag to indicate update mode
      this.updateDone = true;
    }
  }
  

  // Method to update the book
  updateBookData() {
    // Call the service method to update the book data
    this.BookService.updateBook(this.books).subscribe({
      next: () => {
        // Reset the form and update flag
        this.addBookForm.reset();
        this.updateDone = false;
        // Fetch all books again after update
        this.getAllBooks();
      },
      error: (error) => {
        console.error('Error updating book:', error);
        // Handle error
      },
    });
  }
  submitBook() {
    if (this.updateDone) {
      this.updateBookData(); // Call update method
    } else {
      this.addBook(); // Call add method
    }
  }
  getBookById(bookId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${bookId}`).pipe(
      map((bookData: any) => {
        // Assuming you receive category ID in bookData.category
        // Fetch category name using category ID and populate categoryName property
        this.BookService.getCategoryById(bookData.category).subscribe({
          next: (categoryData: any) => {
            bookData.categoryName = categoryData.categoryName;
          },
          error: (error: any) => {
            console.error('Error fetching category name:', error);
          },
        });
        return bookData;
      })
    );
  }
  generateStarRating(numRatings: number): string {
    const maxRating = 5; // Maximum rating
    const filledStars = Math.floor(numRatings); // Get the number of filled stars
    const emptyStars = maxRating - filledStars; // Get the number of empty stars
    let stars = '';
  
    // Generate filled stars
    for (let i = 0; i < filledStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
  
    // Generate empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
  
    return stars;
  }
  searchByTitle(): void {
    if (this.searchTitle.trim() !== '') {
      this.BookService.searchBooksByTitle(this.searchTitle).subscribe({
        next: (data: any) => {
          this.bookJsonData = data; // Assuming the response is directly the array of books
          this.paginateBooks(); // Pagination logic if needed
        },
        error: (error: any) => {
          console.error('Error fetching books by title:', error);
        }
      });
    } else {
      // If the search input is empty, fetch all books
      this.getAllBooks();
    }
  }
  
  }