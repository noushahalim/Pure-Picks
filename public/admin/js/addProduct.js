const imageInput=document.getElementById("productImage")
const submit=document.getElementById("submit")

submit.addEventListener(("click"),(event)=>{
    if(imageInput.files.length !== 5){
        event.preventDefault()
        alert(`you are selected ${imageInput.files.length} images, please select 5 images`)
    }
})




// const categorySelect = document.getElementById('category');
// const subCategorySelect = document.getElementById('subCategory');

// categorySelect.addEventListener('change', function(event) {
//     alert("hi")
//     const selectedCategory = event.target.value;
//     const selectedCategoryObj = categories.find(category => category.categoryName === selectedCategory);
//     if (selectedCategoryObj) {
//         subCategorySelect.innerHTML = '<option value="">Select Sub Category</option>';
//         selectedCategoryObj.subCategory.forEach(subCategory => {
//             const option = document.createElement('option');
//             option.value = subCategory;
//             option.textContent = subCategory;
//             subCategorySelect.appendChild(option);
//         });
//     } else {
//         alert('here')
//         subCategorySelect.innerHTML = '<option value="">Select Sub Categorys</option>';
//     }
// });
