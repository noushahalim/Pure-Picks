
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
  

const submit=document.getElementById('submit')
const userNameInput=document.getElementById('userNameInput')
const passwordInput=document.getElementById('passwordInput')
const errorInput=document.getElementById("error")

submit.addEventListener('click',(event)=>{
  event.preventDefault();
  const data={
    userName:userNameInput.value,
    password:passwordInput.value
  }
  axios.post('/login',data)
  .then((response)=>{
    window.location.href="/"
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