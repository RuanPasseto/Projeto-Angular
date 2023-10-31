import { Component } from '@angular/core';
import { ProductDetail } from './product-details.model';
import { FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  porductModelObj: ProductDetail = new ProductDetail()
  productForm!: FormGroup;
  productData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;

  minQuantity = 1;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router){}

  ngOnInit(): void{
    this.productForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3)]),
      category: new FormControl('', [Validators.required, Validators.minLength(3)]),
      price: new FormControl('', [Validators.required, this.priceValidator]),
      quantity: new FormControl('', [Validators.required, this.quantityValidator.bind(this)]),
      supplier: new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
  }

  quantityValidator(control: AbstractControl): ValidationErrors | null {
    const quantityValue = parseInt(control.value, 10);

    if (isNaN(quantityValue) || quantityValue <= 0 || quantityValue < this.minQuantity) {
      return { quantityInvalid: true, requiredValue: this.minQuantity, actualValue: quantityValue };
    }
    return null;
  }

  priceValidator(control: AbstractControl): ValidationErrors | null {
    const priceValue = parseFloat(control.value);

    if (isNaN(priceValue) || priceValue <= 0) {
      return { priceInvalid: true, requiredLength: 0, actualLength: priceValue };
    }
    return null;
  }

  submit(){
    console.log('enviou')
  }

  clickAddProduct(){
    this.productForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
    this.router.navigate(['/product-details']);
  }

  postProductDetails() {
    if (this.productForm.valid) {
      this.porductModelObj.name = this.productForm.get('name')!.value;
      this.porductModelObj.description = this.productForm.get('description')!.value;
      this.porductModelObj.category = this.productForm.get('category')!.value;
      this.porductModelObj.price = this.productForm.get('price')!.value;
      this.porductModelObj.quantity = this.productForm.get('quantity')!.value;
      this.porductModelObj.supplier = this.productForm.get('supplier')!.value;

      this.api.postProduct(this.porductModelObj)
        .subscribe(res => {
          console.log(res);
          alert('Product Added');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.productForm.reset();
        },
        err => {
          alert('Something Went wrong');
        });
    } else {
      alert('Please fill out the required fields correctly.');
    }
  }
}
