(function() {
    "use strict";
  
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
  
    const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all)
      if (selectEl) {
        if (all) {
          selectEl.forEach(e => e.addEventListener(type, listener))
        } else {
          selectEl.addEventListener(type, listener)
        }
      }
    }
  
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }
  
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)
  
    const scrollto = (el) => {
      let header = select('#header')
      let offset = header.offsetHeight
  
      if (!header.classList.contains('header-scrolled')) {
        offset -= 16
      }
  
      let elementPos = select(el).offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      })
    }
  

    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }
  

    on('click', '.mobile-nav-toggle', function(e) {
      select('#navbar').classList.toggle('navbar-mobile')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
    })
  
    on('click', '.navbar .dropdown > a', function(e) {
      if (select('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault()
        this.nextElementSibling.classList.toggle('dropdown-active')
      }
    }, true)
  
    on('click', '.scrollto', function(e) {
      if (select(this.hash)) {
        e.preventDefault()
  
        let navbar = select('#navbar')
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile')
          let navbarToggle = select('.mobile-nav-toggle')
          navbarToggle.classList.toggle('bi-list')
          navbarToggle.classList.toggle('bi-x')
        }
        scrollto(this.hash)
      }
    }, true)

    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash)
        }
      }
    });

    //back to top
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }
  

    new Swiper('.clients-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 40
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 60
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 80
        },
        992: {
          slidesPerView: 6,
          spaceBetween: 120
        }
      }
    });
  
    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer) {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows'
        });
  
        let portfolioFilters = select('#portfolio-flters li', true);
  
        on('click', '#portfolio-flters li', function(e) {
          e.preventDefault();
          portfolioFilters.forEach(function(el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');
  
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          portfolioIsotope.on('arrangeComplete', function() {
            AOS.refresh()
          });
        }, true);
      }
  
    });
  
    /**
     * Initiate portfolio lightbox 
     */
    const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
    });
  
    /**
     * Portfolio details slider
     */
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  
    /**
     * Testimonials slider
     */
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
  
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  
    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    });
    
    /*
      Validation
    */
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })

    /**
     * CK Editor
     */
     window.addEventListener('load', () => {
      let editor = document.querySelector( '#editor' )
       if(editor){
        ClassicEditor
        .create( document.querySelector( '#editor' ), {
          // toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        } )
        .then( editor => {
          window.editor = editor;
        } )
        .catch( err => {
          console.error( err.stack );
        } );
       }
    });

    window.addEventListener('load', () => {
      let inputValue = document.querySelector('#inputValidationEx2')
      if(inputValue) {
        $(function () {
          var $password = $("#inputValidationEx2");
          var $rePassword = $("#inputValidationEx3");
          var $passwordAlert = $(".password-alert");
          var $requirements = $(".requirements");
          var leng, bigLetter, num, specialChar, equal;
          var $leng = $(".leng");
          var $bigLetter = $(".big-letter");
          var $num = $(".num");
          var $specialChar = $(".special-char");
          var $equal = $(".equal")
          var specialChars = "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~";
          var numbers = "0123456789";
      
          $requirements.addClass("wrong");
          $password.on("focus", function(){$passwordAlert.show();});
          $rePassword.on("focus", function(){$passwordAlert.show();});

          $password.on("input blur", function (e) {
              var el = $(this);
              var val = el.val();
              $passwordAlert.show();
            
              if (val.length < 8) {
                  leng = false;
              }
              else if (val.length > 7) {
                  leng=true;
              }
              
      
              if(val.toLowerCase()==val){
                  bigLetter = false;
              }
              else{bigLetter=true;}
              
              num = false;
              for(var i=0; i<val.length;i++){
                  for(var j=0; j<numbers.length; j++){
                      if(val[i]==numbers[j]){
                          num = true;
                      }
                  }
              }
              
              specialChar=false;
              for(var i=0; i<val.length;i++){
                  for(var j=0; j<specialChars.length; j++){
                      if(val[i]==specialChars[j]){
                          specialChar = true;
                      }
                  }
              }

              equal=false;
              if($password.val() == $rePassword.val()) {equal = true};
      
              console.log(leng, bigLetter, num, specialChar);
              
              if(leng==true&&bigLetter==true&&num==true&&specialChar==true&&equal==true){
                  $(this).addClass("valid").removeClass("invalid");
                  $requirements.removeClass("wrong").addClass("good");
                  $passwordAlert.removeClass("alert-warning").addClass("alert-success");
              }
              else
              {
                  $(this).addClass("invalid").removeClass("valid");
                  $passwordAlert.removeClass("alert-success").addClass("alert-warning");
      
                  if(leng==false){$leng.addClass("wrong").removeClass("good");}
                  else{$leng.addClass("good").removeClass("wrong");}
      
                  if(bigLetter==false){$bigLetter.addClass("wrong").removeClass("good");}
                  else{$bigLetter.addClass("good").removeClass("wrong");}
      
                  if(num==false){$num.addClass("wrong").removeClass("good");}
                  else{$num.addClass("good").removeClass("wrong");}
      
                  if(specialChar==false){$specialChar.addClass("wrong").removeClass("good");}
                  else{$specialChar.addClass("good").removeClass("wrong");}

                  if(equal==false){$equal.addClass("wrong").removeClass("good");}
                  else{$equal.addClass("good").removeClass("wrong");}
              } 
              
              
              if(e.type == "blur"){
                      $passwordAlert.hide();
              }
          });

          $rePassword.on("input blur", function (e) {
            var el = $password;
            var val = el.val();
            $passwordAlert.show();
          
            if (val.length < 6) {
                leng = false;
            }
            else if (val.length > 7) {
                leng=true;
            }
            
    
            if(val.toLowerCase()==val){
                bigLetter = false;
            }
            else{bigLetter=true;}
            
            num = false;
            for(var i=0; i<val.length;i++){
                for(var j=0; j<numbers.length; j++){
                    if(val[i]==numbers[j]){
                        num = true;
                    }
                }
            }
            
            specialChar=false;
            for(var i=0; i<val.length;i++){
                for(var j=0; j<specialChars.length; j++){
                    if(val[i]==specialChars[j]){
                        specialChar = true;
                    }
                }
            }

            equal=false;
            if($password.val() == $rePassword.val()) {equal = true};
    
            console.log(leng, bigLetter, num, specialChar);
            
            if(leng==true&&bigLetter==true&&num==true&&specialChar==true&&equal==true){
                $(this).addClass("valid").removeClass("invalid");
                $requirements.removeClass("wrong").addClass("good");
                $passwordAlert.removeClass("alert-warning").addClass("alert-success");
            }
            else
            {
                $(this).addClass("invalid").removeClass("valid");
                $passwordAlert.removeClass("alert-success").addClass("alert-warning");
    
                if(leng==false){$leng.addClass("wrong").removeClass("good");}
                else{$leng.addClass("good").removeClass("wrong");}
    
                if(bigLetter==false){$bigLetter.addClass("wrong").removeClass("good");}
                else{$bigLetter.addClass("good").removeClass("wrong");}
    
                if(num==false){$num.addClass("wrong").removeClass("good");}
                else{$num.addClass("good").removeClass("wrong");}
    
                if(specialChar==false){$specialChar.addClass("wrong").removeClass("good");}
                else{$specialChar.addClass("good").removeClass("wrong");}

                if(equal==false){$equal.addClass("wrong").removeClass("good");}
                else{$equal.addClass("good").removeClass("wrong");}
            } 
            
            
            if(e.type == "blur"){
                    $passwordAlert.hide();
            }
        });
      });
      }
    })


})()

$(document).ready(function() {
  $('#example').DataTable();
} );
