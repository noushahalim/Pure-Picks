
const submitBtn =document.getElementById("changePasswordSubmit")
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordInput=document.getElementById('password')
const confirmPasswordInput=document.getElementById('confirmPassword')
const errorShow=document.getElementById('errorShow')

passwordInput.onblur=()=>{
    if(!passwordRegex.test(passwordInput.value)){
        errorShow.type="text"
        errorShow.value='Invalid password'
    }
    else{
        errorShow.type="hidden"
        errorShow.value='true'
    }
}

confirmPasswordInput.onblur=()=>{
    if(passwordInput.value !== confirmPasswordInput.value){
        errorShow.type="text"
        errorShow.value='Confirm Password not matching'
    }
    else{
        errorShow.type="hidden"
        errorShow.value='true'
    }
}

submitBtn.addEventListener("submit",(event)=>{
    event.preventDefault()
    if(passwordInput.value==""||confirmPasswordInput.value==""){
        errorShow.type="text"
        errorShow.value='Please Provide All Details'
      }
      else{
        event.target.submit()
      }
})