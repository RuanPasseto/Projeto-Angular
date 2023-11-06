import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { ProductModel } from './product-dashboard.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

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
  desc: any
  categories: string[] = [];
  filteredProductData: any[] = [];
  productToDelete: any;
  showConfirmationDialog: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private modalService: NgbModal,
    private confirmService: NgConfirmService,
    private toast: NgToastService
    ) {}

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
    this.getDescription();
  }

  getDescription(){
    this.api.getDescription().subscribe((res:any) =>{
      this.desc = res
      console.log(res)
    })
  }

  getCategories() {
    this.api.getCategories().subscribe((categories: string[]) => {
      this.categories = categories;
    });
  }

  confirmDelete(row: any) {
    this.confirmService.showConfirm("Are you sure you want to Delete?",
    ()=>{
      this.api.deleteProduct(row.id)
      .subscribe(res=>{
        this.toast.success({detail:"Succes",
            summary:"Product Deleted",
            duration:5000,
            position:'topCenter'});
        this.getAllProducts()
      })
    },
    ()=>{

    }
    )
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
      this.toast.info({detail:"Succes",
            summary:"Updated Successfully",
            duration:5000,
            position:'topCenter'});
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllProducts();
    });
  }

}

