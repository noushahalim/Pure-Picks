const notUserLinks = document.querySelectorAll(".not-user");
const loginDiv = document.getElementById("login-div");

notUserLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        loginDiv.style.display = 'flex';
    });
});

const closeLogin=document.getElementById("close-login")

closeLogin.addEventListener("click",(event)=> {
    event.preventDefault();
    loginDiv.style.display = 'none';
});


document.getElementById('togglePassword').addEventListener('click', function() {
    var passwordInput = document.getElementById('passwordInput');
    var eyeIcon = document.getElementById('togglePassword');
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.innerHTML = '<img src="./images/eye-close.svg" alt="" />';
    } else {
      passwordInput.type = 'password';
      eyeIcon.innerHTML = '<img src="./images/eye.svg" alt="" />';
    }
  });
  

const submit=document.getElementById('login-submit')
const userNameInput=document.getElementById('userNameInput')
const passwordInput=document.getElementById('passwordInput')
const errorInput=document.getElementById("error")
const loginLocation=document.getElementById("login-location").value

submit.addEventListener('click',(event)=>{
  event.preventDefault();
  const data={
    userName:userNameInput.value,
    password:passwordInput.value
  }
  axios.post('/login',data)
  .then((response)=>{
    window.location.href=loginLocation
    error.type="text"
    error.value=response.data.message
  })
  .catch((error)=>{
    console.log(error.response);
    if(error.response.status==400){
      errorInput.type="text"
      errorInput.value=error.response.data.message
    }
  })
})


const signUpDiv = document.getElementById("signUp-div");
const notaMember=document.getElementById("notaMember")

notaMember.addEventListener("click",(event)=> {
    event.preventDefault();
    loginDiv.style.display = 'none';
    signUpDiv.style.display = 'flex';
});

const closeSignUp=document.getElementById("close-signUp")

closeSignUp.addEventListener("click",(event)=> {
    event.preventDefault();
    signUpDiv.style.display = 'none';
});

const alreadyaMember=document.getElementById("alreadyaMember")

alreadyaMember.addEventListener("click",(event)=> {
    event.preventDefault();
    signUpDiv.style.display = 'none';
    loginDiv.style.display = 'flex';
});



const inputs = document.querySelectorAll(".otp-field > input");
const button = document.querySelector(".btn");

window.addEventListener("load", () => inputs[0].focus());
button.setAttribute("disabled", "disabled");

inputs[0].addEventListener("paste", function (event) {
    event.preventDefault();

    const pastedValue = (event.clipboardData || window.clipboardData).getData("text");
    const otpLength = inputs.length;

    for (let i = 0; i < otpLength; i++) {
        if (i < pastedValue.length) {
            inputs[i].value = pastedValue[i];
            inputs[i].removeAttribute("disabled");
            inputs[i].focus;
        } else {
            inputs[i].value = "";
            inputs[i].focus;
        }
    }
});

inputs.forEach((input, index1) => {
    input.addEventListener("keyup", (e) => {
        const currentInput = input;
        const nextInput = input.nextElementSibling;
        const prevInput = input.previousElementSibling;

        if (currentInput.value.length > 1) {
            currentInput.value = "";
            return;
        }

        if (
            nextInput &&
            nextInput.hasAttribute("disabled") &&
            currentInput.value !== ""
        ) {
            nextInput.removeAttribute("disabled");
            nextInput.focus();
        }

        if (e.key === "Backspace") {
            inputs.forEach((input, index2) => {
                if (index1 <= index2 && prevInput) {
                    input.setAttribute("disabled", true);
                    input.value = "";
                    prevInput.focus();
                }
            });
        }

        button.classList.remove("active");
        button.setAttribute("disabled", "disabled");

        const inputsNo = inputs.length;
        if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
            button.classList.add("active");
            button.removeAttribute("disabled");
        }

        // Toggle CSS classes based on button state
        if (button.classList.contains("active")) {
            button.classList.remove("btn-inactive");
            button.classList.add("btn-active");
        } else {
            button.classList.remove("btn-active");
            button.classList.add("btn-inactive");
        }
    });
});

////////////////////////////////////////////////

const manageOtpLink = document.getElementById('otp-div-open');
const otpSection = document.getElementById('otp-div-opened');
const mobileNumberInput= document.getElementById('mobileNumber');
const otpVerified=document.getElementById('otpVerified')
const helperId=document.getElementById('helperId')


manageOtpLink.addEventListener('click', function(event) {
  event.preventDefault();

  const mobileNumber=mobileNumberInput.value
  axios.get(`/otp/${mobileNumber}`)
    .then(function (response){
        if(response.status==200){
            otpSection.style.display = 'flex';
            helperId.value=response.data.otpHelperId
            console.log(response.data.message);
        }
        else{
            otpSection.style.display = 'none';
            console.log(response.error.message);
        }

    })
    .catch(function(error){
        console.log(error.message);
    })
});

////////////////////////////////////////////////

const otpSubmit= document.getElementById('otpSubmit')
// const otpVerified=document.getElementById('otpVerified')
const submitBtn= document.getElementById('signUp-submitBtn')
const verified=document.getElementById('verified')


otpSubmit.addEventListener('click', function(event) {
    event.preventDefault();
  
    const otp1 = document.getElementById('otp1').value;
    const otp2 = document.getElementById('otp2').value;
    const otp3 = document.getElementById('otp3').value;
    const otp4 = document.getElementById('otp4').value;
    const otp5 = document.getElementById('otp5').value;
    const otp6 = document.getElementById('otp6').value;

    const combinedOTP = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    const otpHelperId=helperId.value
    axios.post(`/otp`,{combinedOTP:combinedOTP,otpHelperId:otpHelperId})
      .then(function (response){
          otpSection.style.display = 'none';
          otpVerified.value="true"
          verified.type="hidden"
          verified.value="true"
          submitBtn.style.display='unset'
          manageOtpLink.style.display= 'none'
          passwordInput.style.margin= '0 0 10px 0'
          console.log(response.data.message);
  
      })
      .catch(function(error){
          console.log(error);
      })
  });

///////////////////////////////////////////////////

const usernameRegex = /^[a-zA-Z0-9_-]{3,12}$/;
const emailRejex=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const userInput=document.getElementById('userName')
const emailInput=document.getElementById('email')
const password=document.getElementById('password')
const confirmPasswordInput=document.getElementById('confirmPassword')
// const verified=document.getElementById('verified')

userInput.onblur=()=>{
    if(!usernameRegex.test(userInput.value)){
        verified.type="text"
        verified.value='Invalid username'
    }
    else{
        verified.type="hidden"
        verified.value='true'
    }
}

emailInput.onblur=()=>{
    if(!emailRejex.test(emailInput.value)){
        verified.type="text"
        verified.value='Invalid email address'
    }
    else{
        verified.type="hidden"
        verified.value='true'
    }
}

password.onblur=()=>{
    if(!passwordRegex.test(password.value)){
        verified.type="text"
        verified.value='Invalid password'
    }
    else{
        verified.type="hidden"
        verified.value='true'
    }
}

confirmPasswordInput.onblur=()=>{
    if(password.value !== confirmPasswordInput.value){
        verified.type="text"
        verified.value='Confirm Password not matching'
    }
    else{
        verified.type="hidden"
        verified.value='true'
    }
}

///////////////////////////////////////////////////


submitBtn.addEventListener('click', function(event) {
    event.preventDefault();
//   console.log(verified.value,otpVerified.value);
  if(userInput.value==""||emailInput.value==""||mobileNumberInput.value==""||password.value==""||confirmPasswordInput.value==""){
    verified.type="text"
    verified.value='Please Provide All Details'
  }
  else{
    if(otpVerified.value !=="true"){
        verified.type="text"
        verified.value='Mobile Number Not Verified'
    }
    else if(verified.value !=="true"){
      verified.type="text"
      verified.value='Check provided Details'
    }
    else{
        const data={
            userName:userInput.value,
            email:emailInput.value,
            mobileNumber:mobileNumberInput.value,
            password:password.value
        }
        axios.post("/signUp",data)
        .then(function (response){
            Swal.fire({
                position: "center",
                icon: "success",
                title: "SignUp Completed",
                showConfirmButton: false,
                timer: 1500
              })
              .then(() => {
                signUpDiv.style.display = 'none';
                loginDiv.style.display = 'flex';
            });
        })
        .catch(function(error){
            console.log(error.message);
            if(error.response.status==422){
                verified.type="text"
                verified.value=error.response.data.message
            }
        })
    }
  }
});




///////////////////////////////////////////////////


const closeBtn = document.getElementById('otp-div-close');
const otpDiv = document.getElementById('otp-div-opened');

closeBtn.addEventListener('click', function(event) {
    event.preventDefault();
    otpDiv.style.display = 'none';
});

// const mobileNumberInput= document.getElementById('mobileNumber');
// const password= document.getElementById('password');

mobileNumberInput.onblur=()=>{
    if(otpVerified.value=="true"){
        manageOtpLink.style.display= 'none'
        password.style.margin= '0 0 10px 0'
    }
    else if(mobileNumberInput.value.length==10){
        manageOtpLink.style.display= 'unset'
        password.style.margin= '20px 0px 10px 0px'
    }
    else{
        manageOtpLink.style.display= 'none'
        password.style.margin= '0 0 10px 0'
    }
}


