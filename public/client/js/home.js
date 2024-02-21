
const addWishlistButtons = document.querySelectorAll(".wishlistAdd");

addWishlistButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = button.getAttribute("href");
        axios.post("/wishlistAdd",{productId})
        .then((response)=>{
            
            console.log(response.data.message)
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
