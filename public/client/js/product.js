
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


const reviewForm=document.getElementById("review")

reviewForm.addEventListener("submit",(event)=>{
    event.preventDefault()

    const star5 = document.getElementById("star0")
    const star4 = document.getElementById("star1")
    const star3 = document.getElementById("star2")
    const star2 = document.getElementById("star3")
    const star1 = document.getElementById("star4")

    let rating
    if(star1.checked){
        rating=1
    }
    if(star2.checked){
        rating=2
    }
    if(star3.checked){
        rating=3
    }
    if(star4.checked){
        rating=4
    }
    if(star5.checked){
        rating=5
    }


    const productId=document.getElementById("productId").value
    const reviewDescription=document.getElementById("reviewDescription").value

    axios.post("/review",{
        rating:rating,
        productId:productId,
        reviewDescription:reviewDescription
    })
    .then((response)=>{
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Review Added",
            showConfirmButton: false,
            timer: 1500
          });
          reviewDescription.value=''
    })
    .catch((error)=>{
        
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
            footer: '<a href="/checkout">Yes, Do it Now !</a>'
          });
    })
})