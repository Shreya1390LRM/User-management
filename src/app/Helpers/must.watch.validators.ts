import { AbstractControl ,ValidationErrors,ValidatorFn} from "@angular/forms";

export function MustMatch(Password:string,confirmPassword:string):ValidatorFn{
    return (ctrl:AbstractControl):ValidationErrors | null =>{
     const Passwordctrl = ctrl.get(Password);
     const confirmPasswordctrl = ctrl.get(confirmPassword);


   if(confirmPasswordctrl.errors && !confirmPasswordctrl.errors['MustMatch']){
    return null;
   }

      if(Passwordctrl.value !== confirmPasswordctrl.value){
          confirmPasswordctrl.setErrors({mustMatch:true})
      }
      else{
        confirmPasswordctrl.setErrors(null)
      }
      return null;
    }
}