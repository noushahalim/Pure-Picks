
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
    location.href=`/products?search=${searchValue}`
})