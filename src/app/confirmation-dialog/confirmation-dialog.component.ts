import { Component } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  row: any

  constructor(private api: ApiService) { }

    deleteProduct(row: any){
      this.api.deleteProduct(row.id)
      .subscribe(res=> {
        alert('Product Deleted')
      })
  }
}
