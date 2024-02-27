
function closeCategoryForm() {
    document.querySelector('.add-category').style.display = 'none';
  }
  function openCategoryForm() {
      document.querySelector('.add-category').style.display = 'block';
  }
  function closeSubCategoryForm() {
    document.querySelector('.add-sub-category').style.display = 'none';
  }
  function openSubCategoryForm() {
      document.querySelector('.add-sub-category').style.display = 'block';
  }

////////////////////////////////////////////////////////////////////////////


  const addCategoryForm = document.getElementById('addCategoryForm');
  const inputCategory = document.getElementById('categoryName');
  const inputCategoryImage=document.getElementById('categoryImage')
  const categoriesList = document.getElementById('categoriesList');

  addCategoryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('categoryName', inputCategory.value);
    formData.append('categoryImage', inputCategoryImage.files[0]);
    addCategory(formData);
  });

  function addCategory(formData) {
    axios.post("/admin/addCategory", formData)
      .then((response) => {
        console.log('Category added successfully');
        appendCategoryToList(inputCategory.value);
        inputCategory.value = '';
      })
      .catch((error) => {
          if(error.response.status==403){
              alert(error.response.data.message)
          }
          else{
              console.error('Error adding category:', error);
          }
      });
  }


////////////////////////////////////////////////////////////////////////////



  function appendCategoryToList(categoryName) {
  const categoriesList = document.getElementById('categoriesList');

  const div = document.createElement('div');
  div.classList.add('categories-list');
  div.id = categoryName;

  const link = document.createElement('a');
  link.setAttribute('href', '');
  link.id="categoryClicked";
  link.setAttribute('data-category', categoryName);


  const li = document.createElement('li');
  li.textContent = categoryName;

  const deleteLink = document.createElement('a');
  deleteLink.setAttribute('href', `/admin/deleteCategory/${categoryName}`);

  deleteLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="red">
          <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
      </svg>
  `;

  deleteLink.addEventListener('click', function(event) {
      event.preventDefault();
      deleteCategory(categoryName);
  });

  link.appendChild(li);
  div.appendChild(link);
  div.appendChild(deleteLink);
  categoriesList.appendChild(div);

  const hr = document.createElement('hr');
  categoriesList.appendChild(hr);
  }


////////////////////////////////////////////////////////////////////////////


  function deleteCategory(categoryName) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/admin/deleteCategory/${categoryName}`)
        .then((response) => {
          const categoryElement = document.getElementById(categoryName);
          categoryElement.parentNode.removeChild(categoryElement);
          Swal.fire({
            title: "Deleted!",
            text: "Category has been deleted.",
            icon: "success"
          });
        })
        .catch((error) => {
            if(error.response.status==404){
                alert(error.response.data.message)
            }
            else{
                console.error('Error deleting category:', error);
            }
        });
      }
    });
  }

////////////////////////////////////////////////////////////////////////////




let categoryNamee
document.querySelectorAll('#categoryClicked').forEach(item => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    categoryNamee = item.dataset.category;
    const subCategoriesList=document.querySelector('#subCategoriesList')
    subCategoriesList.innerHTML=''
    
    
    axios.get(`/admin/subCategory/${categoryNamee}`)
    .then((response)=>{
      const subCategory=response.data.category.subCategory
      const category=response.data.category.categoryName
      
      const subCategoriesList=document.querySelector('#subCategoriesList')
      subCategoriesList.innerHTML=''


      for(i=0;i<subCategory.length;i++){
        const div = document.createElement('div');
        div.classList.add('categories-list');
        div.id = subCategory[i];

        const li = document.createElement('li');
        li.textContent = subCategory[i];

        

        const deleteLink = document.createElement('a');
        deleteLink.setAttribute('href', `/admin/deleteSubCategory/${subCategory[i]}`);

        deleteLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="blue">
              <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
            </svg>
          `;

          const data={
            category:categoryNamee,
            subCategory:subCategory[i]
          }

          deleteLink.addEventListener('click', function(event) {
            event.preventDefault();
            deleteSubCategory(data);
          });

          

          div.appendChild(li);
          div.appendChild(deleteLink);
          subCategoriesList.appendChild(div);

          const hr = document.createElement('hr');
          subCategoriesList.appendChild(hr);
          
      }
      
    })
    .catch((error)=>{
      console.log(error);
    })
  });
});


////////////////////////////////////////////////////////////////////////////








const addSubCategoryForm = document.getElementById('addSubCategoryForm');
const inputSubCategory = document.getElementById('subCategoryName');
const subCategoriesList = document.getElementById('subCategoriesList');

addSubCategoryForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const data={
    category:categoryNamee,
    subCategory:inputSubCategory.value
  }
  addSubCategory(data);
});

function addSubCategory(data) {
  axios.post("/admin/addSubCategory", data)
    .then((response) => {
      appendSubCategoryToList(data);
      console.log('Sub Category added successfully');
      
      inputSubCategory.value = '';
    })
    .catch((error) => {
        if(error.response?.status==403||error.response?.status==404){
            alert(error.response.data.message)
        }
        else{
            console.error('Error adding sub category:', error);
        }
    });
}

function appendSubCategoryToList(data) {
const subCategoriesList = document.getElementById('subCategoriesList');

const div = document.createElement('div');
div.classList.add('categories-list');
div.id = data.subCategory;

const li = document.createElement('li');
li.textContent = data.subCategory;

const deleteLink = document.createElement('a');
deleteLink.setAttribute('href', `/admin/deleteSubCategory/${data.subCategory}`);

deleteLink.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="blue">
        <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
    </svg>
`;

deleteLink.addEventListener('click', function(event) {
    event.preventDefault();
    deleteSubCategory(data);
});

div.appendChild(li);
div.appendChild(deleteLink);
subCategoriesList.appendChild(div);

const hr = document.createElement('hr');
subCategoriesList.appendChild(hr);
}



////////////////////////////////////////////////////////////////////////////
  



function deleteSubCategory(data) {
    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post("/admin/deleteSubCategory",data)
      .then((response) => {
        const subCategoryName = data.subCategory;
        const subCategoryElement = document.getElementById(subCategoryName);
        if(subCategoryElement){
          subCategoryElement.parentNode.removeChild(subCategoryElement);
        }else{
          console.error(`Subcategory element with ID ${subCategoryName} not found.`);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Sub category has been deleted.",
          icon: "success"
        });
      })
      .catch((error) => {
          if(error.response.status==404){
              alert(error.response.data.message)
          }
          else{
              console.error('Error deleting sub category:', error);
          }
      });
        }
  });
  
}