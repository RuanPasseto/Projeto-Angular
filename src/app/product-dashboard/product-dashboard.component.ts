import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { ProductModel } from './product-dashboard.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent {

  porductModelObj: ProductModel = new ProductModel()
  formValue!: FormGroup;
  productData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router){}

  ngOnInit(): void{
    this.formValue = this.formBuilder.group({
      name: [''],
      description: [''],
      category: [''],
      price: [''],
      quantity: [''],
      supplier: ['']
    })
    this.getAllProducts();
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
      alert('Product Added')
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllProducts();
    },
    err=>{
      alert('Something Went wrong')
    })
  }

  getAllProducts(){
    this.api.getProduct()
    .subscribe(res=>{
      this.productData = res;
    })
  }

  deleteProduct(row: any){
    this.api.deleteProduct(row.id)
    .subscribe(res=> {
      alert('Product Deleted')
      this.getAllProducts()
    })
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
      alert("Updated Seccessfully")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllProducts();
    })
  }
}
