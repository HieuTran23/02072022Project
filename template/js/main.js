function testimonialSlider(){
    const carouselOne = document.getElementById('carouselOne');
    if(carouselOne){
        carouselOne.addEventListener('slide.bs.carousel', function () {
            const activeItem =this.querySelector(".active");
            console.log(activeItem); 
            document.querySelector(".js-tesimonial-img").src =  activeItem.getAttibute("data-js-testimonial-img");
        })
    }
}
testimonialSlider();
