
const addWishlistButtons = document.querySelectorAll(".wishlistAdd");

addWishlistButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = button.getAttribute("href");
        axios.post("/wishlistAdd",{productId})
        .then((response)=>{        
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Added To Wishlist",
                showConfirmButton: false,
                timer: 1500
              });
        })
        .catch((error)=>{
            if(error.response.status==403){
                alert(error.response.data.message)
            }
            else{
                console.log(error.response.data.message);
            }
        })
    });
});



const addCartButtons = document.querySelectorAll(".cartAdd");

addCartButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = button.getAttribute("href");
        axios.post("/cartAdd",{productId})
        .then((response)=>{        
            console.log(response.data.message);
        })
        .catch((error)=>{
            if(error.response.status==403){
                alert(error.response.data.message)
            }
            else{
                console.log(error.response.data.message);
            }
        })
    });
});

const searchsubmit=document.getElementById("main-search-button")

searchsubmit.addEventListener("click",(event)=>{
    event.preventDefault()
    const searchValue=document.getElementById("main-search").value
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("search", searchValue);
    urlParams.delete("page");
    location.href=`/products?${urlParams.toString()}`;
})


const selectBox = document.querySelector(".select-box");

selectBox.addEventListener("change", (event) => {
    event.preventDefault();
    const sortValue = selectBox.value;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("sort", sortValue);
    location.href = `/products?${urlParams.toString()}`;
});

const filterLinks = document.querySelectorAll(".shop-w__category-list a");

filterLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const categoryValue = link.getAttribute("href").split("=")[1];
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("category", categoryValue);
        urlParams.delete("page");
        location.href = `/products?${urlParams.toString()}`;
    });
});