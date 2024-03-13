const applyCoupon=document.getElementById("applyCoupon")
const coupon=document.getElementById("coupon")
const totalAmoundHidden=document.getElementById("totalAmoundHidden")
const totalAmound=document.getElementById("totalAmound")
const coupenId=document.getElementById("coupenId")
const couponDiscount=document.getElementById("couponDiscount")
const couponSection=document.getElementById("checkout-msg-group")


applyCoupon.addEventListener("click",(event)=>{
    event.preventDefault()
    axios.post("/couponApply",{coupenCode:coupon.value,totalAmound:totalAmoundHidden.value})
    .then((response)=>{
        coupon.value=''
        couponSection.style.display="none"
        coupenId.value=response.data.couponId
        couponDiscount.innerHTML=`₹ ${response.data.couponAmount}`
        const discountedAmount=totalAmoundHidden.value-response.data.couponAmount
        totalAmound.innerHTML=`₹ ${discountedAmount}`
    })
    .catch((err)=>{
        console.log(err.response.data.message);
    })
})

// ------------------------------------------------------------------------------------


const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Lakshadweep", "Puducherry"
];

const stateSelect = document.getElementById("stateSelect");

states.forEach(state => {
const option = document.createElement("option");
option.value = state.toLowerCase().replace(/\s+/g, "-");
option.text = state;
stateSelect.appendChild(option);
});

// ------------------------------------------------------------------------------------


const addressForm = document.getElementById('addressForm');
const displayAddressForm = document.getElementById('displayAddressForm');
const addressDisplay = document.getElementById('addressDisplay');
const addressId= document.getElementById('addressId')
const cancelFormButton = addressForm.querySelector('[data-dismiss="modal"]');


addressForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = {
        fName: document.getElementById('address-fname').value,
        lName: document.getElementById('address-lname').value,
        number: document.getElementById('address-phone').value,
        streetAddress: document.getElementById('address-street').value,
        country: document.getElementById('address-country').value,
        state: document.getElementById('stateSelect').value,
        city: document.getElementById('address-city').value,
        pin: document.getElementById('address-postal').value
    };
    try {
        const response = await axios.post('/addressAdd', formData);
        const { streetAddress, country, number , state, city, pin ,_id } = response.data.data;
        addressDisplay.innerHTML=''
        const newAddressHTML = `
        <p class="ship-b__p">${streetAddress} ${city} ${state} ${pin} ${country} ${number}</p>
        
            <br>
        `;
        addressDisplay.insertAdjacentHTML('beforeend', newAddressHTML);
        addressId.value=_id
        cancelFormButton.click();
    } catch (error) {
        alert(error.response.data.message);
    }
});

// ------------------------------------------------------------------------------------

const cancelButton = displayAddressForm.querySelector('[data-dismiss="modal"]');

displayAddressForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedAddressId = document.querySelector('input[name="address"]:checked').value;
    const selectedRow = document.querySelector('input[name="address"]:checked').closest('tr');

    const address = selectedRow.cells[2].textContent.trim();
    const region = selectedRow.cells[3].textContent.trim();
    const phoneNumber = selectedRow.cells[4].textContent.trim();
    addressDisplay.innerHTML=''
    const newestAddressHTML = `
        <p class="ship-b__p">${address} ${region} ${phoneNumber}</p>
        
            <br>
        `;
        addressDisplay.insertAdjacentHTML('beforeend', newestAddressHTML);
    addressId.value=selectedAddressId
    cancelButton.click();
});


// ------------------------------------------------------------------------------------

const placeOrder=document.getElementById("placeOrder")

placeOrder.addEventListener("click",(event)=>{
    event.preventDefault()
    if(addressId.value.length<1){
        alert('Add A Shipping Address')
    }
    else{
        event.target.form.submit();
    }
})