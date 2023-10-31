import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { ProductModel } from './product-dashboard.model';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {
  porductModelObj: ProductModel = new ProductModel();
  formValue!: FormGroup;
  productData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  row:any
  searchDescription = '';
  searchMinStock: number | undefined;
  searchCategory = '';
  categories: string[] = [];
  filteredProductData: any[] = [];
  productToDelete: any;

  @ViewChild(ConfirmationDialogComponent) confirmationDialog!: ConfirmationDialogComponent;

  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: [''],
      description: [''],
      category: [''],
      price: [''],
      quantity: [''],
      supplier: ['']
    });
    this.getCategories();
    this.getAllProducts();
  }

  getCategories() {
    this.api.getCategories().subscribe((categories: string[]) => {
      this.categories = categories;
    });
  }

  applyFilters() {
    this.filteredProductData = this.productData.filter((product: any) => {
      const descriptionMatch = product.description.toLowerCase().includes(this.searchDescription.toLowerCase());
      const minStockMatch = this.searchMinStock ? product.quantity >= this.searchMinStock : true;
      const categoryMatch = this.searchCategory ? product.category === this.searchCategory : true;

      return descriptionMatch && minStockMatch && categoryMatch;
    });
  }

  clickAddProduct(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
    this.router.navigate(['/product-details']);
  }

  postProductDetails(){
    this.porductModelObj.name = this.formValue.value.name;
    this.porductModelObj.description = this.formValue.value.description;
    this.porductModelObj.category = this.formValue.value.category;
    this.porductModelObj.price = this.formValue.value.price;
    this.porductModelObj.quantity = this.formValue.value.quantity;
    this.porductModelObj.supplier = this.formValue.value.supplier;

    this.api.postProduct(this.porductModelObj)
    .subscribe(res=>{
      console.log(res);
      alert('Product Added');
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllProducts();
    },
    err=>{
      alert('Something Went wrong');
    });
  }

  getAllProducts() {
    this.api.getProduct().subscribe((res: any) => {
      this.productData = res;
      this.filteredProductData = res;
    });
  }

  deleteProduct(row: any) {
    this.productToDelete = row;
    this.showConfirmationDialog();
  }

  showConfirmationDialog() {
    const confirmationDialog = document.getElementById('confirmationDialog');
    if (confirmationDialog) {
      confirmationDialog.classList.add('show');
    }
  }


  onEdit(row: any){
    this.showAdd = false;
    this.showUpdate = true;
    this.porductModelObj.id = row.id;
    this.formValue.controls['name'].setValue(row.name);
    this.formValue.controls['description'].setValue(row.description);
    this.formValue.controls['category'].setValue(row.category);
    this.formValue.controls['price'].setValue(row.price);
    this.formValue.controls['quantity'].setValue(row.quantity);
    this.formValue.controls['supplier'].setValue(row.supplier);
  }

  updateProductDetails(){
    this.porductModelObj.name = this.formValue.value.name;
    this.porductModelObj.description = this.formValue.value.description;
    this.porductModelObj.category = this.formValue.value.category;
    this.porductModelObj.price = this.formValue.value.price;
    this.porductModelObj.quantity = this.formValue.value.quantity;
    this.porductModelObj.supplier = this.formValue.value.supplier;

    this.api.updateProduct(this.porductModelObj, this.porductModelObj.id)
    .subscribe(res=>{
      alert("Updated Successfully");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllProducts();
    });
  }
}

