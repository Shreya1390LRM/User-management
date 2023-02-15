import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';

const routes: Routes = [
  {
    path:'recyclebin',component:RecycleBinComponent
  },
  {
    path:'',component:ProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
