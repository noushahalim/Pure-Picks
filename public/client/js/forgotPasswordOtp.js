

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

const otpSubmit= document.getElementById('otpSubmit')
const submitBtn= document.getElementById('submitBtn')


otpSubmit.addEventListener('click', function(event) {
    event.preventDefault();
  
    const otp1 = document.getElementById('otp1').value;
    const otp2 = document.getElementById('otp2').value;
    const otp3 = document.getElementById('otp3').value;
    const otp4 = document.getElementById('otp4').value;
    const otp5 = document.getElementById('otp5').value;
    const otp6 = document.getElementById('otp6').value;
    const mailHelperId=document.getElementById('mailHelperId').value
    const userId=document.getElementById('userId').value

    const combinedOTP = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    axios.post("/forgotPasswordOtp",{combinedOTP:combinedOTP,mailHelperId:mailHelperId,userId:userId})
      .then(function (response){
          location.href=`/changePassword?userId=${response.data.userId}`
      })
      .catch(function(error){
        if(error.status==400){
            alert(error.response.data.message)
        }
      })
  });