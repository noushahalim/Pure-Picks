const imageInput2 = document.getElementById("productImage2");
const submit2 = document.getElementById("submit2");

submit2.addEventListener("click", (event) => {
    if (imageInput2.files.length > 0 && imageInput2.files.length !== 5) {
        event.preventDefault();
        alert(`You have selected ${imageInput2.files.length} images. Please select exactly 5 images.`);
    }
});
