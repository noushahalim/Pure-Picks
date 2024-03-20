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

const addressForm = document.getElementById('addressForm');

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

    const nameRegex = /^[A-Za-z]+$/;
    const numberRegex = /^\d{10}$/;
    const streetAddressRegex = /^(?=.*[a-zA-Z])[\w\s,'()-]+$/;

    if (!nameRegex.test(formData.fName) || !nameRegex.test(formData.lName)) {
        alert("First name and last name should only contain letters.");
        return;
    }

    if (!numberRegex.test(formData.number)) {
        alert("Mobile number must have 10 digits.");
        return;
    }

    if (!streetAddressRegex.test(formData.streetAddress)) {
        alert("Street address must include letters.");
        return;
    }

    if (!streetAddressRegex.test(formData.city)) {
        alert("City must include letters.");
        return;
    }

    event.target.submit();
});