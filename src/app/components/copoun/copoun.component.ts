import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Copoun } from '../../models/copoun';
import { CopounService } from '../../services/copoun.service';

@Component({
  selector: 'app-copoun',
  standalone: true,
  imports: [
  CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './copoun.component.html',
  styleUrl: './copoun.component.css',
})
export class CopounComponent implements OnInit {
  copounJsonData: any[] = [];

  copoun: Copoun = {} as Copoun;

  updateMode: boolean = false;

  URL: string = '';

  selectedCouponId: string = ''

  addCopounForm: FormGroup; //new

  constructor(
    private CopounService: CopounService,
    private formbuilder: FormBuilder
  ) {
    this.addCopounForm = this.formbuilder.group({
      couponCode: new FormControl('', [Validators.required]),
      couponValue: new FormControl('', [Validators.required]),
      expireIn: new FormControl('', [Validators.required]),
    });
  }

  get couponCode() {
    return this.addCopounForm.get('couponCode');
  }

  get couponValue() {
    return this.addCopounForm.get('couponValue');
  }

  get expireIn() {
    return this.addCopounForm.get('expireIn');
  }

  getAllCopouns() {
    this.CopounService.getAllCopouns().subscribe({
      next: (data: any) => {
        this.copounJsonData = data.data.coupons;
        console.log('Fetched coupons:', this.copounJsonData); // Add this line for debugging
      },
      error: (error: any) => {
        console.error('Error fetching coupons:', error);
        // Handle error
      }
    });
  }

  ngOnInit(): void {
    this.getAllCopouns();
  }

  clearForm(){
    this.copoun.couponCode='';
    this.copoun.couponValue=0;
    this.copoun.expireIn=new Date();

  }

  createCopoun(){
    this.copoun.couponCode=this.couponCode?.value;
    this.copoun.couponValue=this.couponValue?.value;

    this.copoun.expireIn=this.expireIn?.value;

  this.CopounService.createCopoun(this.copoun).subscribe({
    next:(data)=>{
      console.log(data);

    }
  })
  }



  deleteCopoun(id: any) {
    Swal.fire({
      icon: "warning",
      title: `Are you sure you want to DELETE this copoun?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "CANCEL",
      confirmButtonColor: "#8B0000",
      cancelButtonColor: "#ccafaf",
      iconColor: "#8B0000",
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('Deleting coupon with id:', id);
        if (!id) {
          console.error('Error: ID is undefined');
          return; // Return early if id is undefined
        }

        this.CopounService.deleteCopoun(id).subscribe({
          next: (data) => {
            console.log('Coupon deleted successfully:', data);
            this.getAllCopouns();
          },
          error: (error) => {
            console.error('Error deleting coupon:', error);
            // Handle error
          }
        });
      }
    });
  }



  updateCopoun() {
    if (!this.selectedCouponId) {
      console.error('Selected coupon ID is not provided');
      return;
    }

    this.CopounService.updateCopoun(this.selectedCouponId, this.copoun).subscribe({
      next: () => {
        this.updateMode = false;
        this.getAllCopouns();
        this.clearForm();
      }
    });
  }


    updateButton(id: any) {
      const updateCopoun=this.copounJsonData.filter((copoun)=>copoun._id ===id);
      console.log('update coupon with id:', updateCopoun);
      this.updateMode = true;
      this.copoun.couponCode =updateCopoun[0].couponCode;
      this.copoun.couponValue = updateCopoun[0].couponValue;
      this.copoun.expireIn = updateCopoun[0].expireIn;
    }





}
