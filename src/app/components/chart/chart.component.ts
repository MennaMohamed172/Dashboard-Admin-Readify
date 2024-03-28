import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { BookService } from '../../services/book.service';
interface CategoryWithBookCount {
  _id: string;
  categoryName: string;
  booksCount: number;
}
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.getCategoryDataAndCreateChart();
  }

  getCategoryDataAndCreateChart(): void {
    this.bookService.getCategoriesWithBookCount().subscribe({
      next: (response) => {
        const categoryNames = response.data.map(
          (category: CategoryWithBookCount) => category.categoryName
        );
        const bookCounts = response.data.map(
          (category: CategoryWithBookCount) => category.booksCount
        );

        this.createChart(categoryNames, bookCounts);
      },
      error: (error) => console.error('There was an error!', error),
    });
  }

  createChart(categoryLabels: string[], bookData: number[]): void {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    const categoryChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            label: 'Number of Books',
            data: bookData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(199, 199, 199, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(159, 159, 159, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            ticks: {
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
      },
    });
  }
}
