let header = document.querySelector("header")
let headerAchor = document.querySelectorAll("header nav ul li a")


window.addEventListener("scroll", () => {
    if (window.pageYOffset !=0){
        header.style.backgroundColor = "rgba(0,0,0,0.5)"
        header.style.color ="white"
        headerAchor.forEach(a =>{
            a.style.color = "white"
        })
    }
    else{
        header.style = ""
        headerAchor.forEach(a =>{
            a.style.color = "#09777d"
        })
    }
    }
)
