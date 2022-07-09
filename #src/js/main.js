// VARS
const INIT_SPLIDE_ACTIVE = true;
const INIT_BUTTER = true;

// ON LOAD DOAM
document.addEventListener("DOMContentLoaded", () => {
    formLabel();
    formValidateInit();
    popUpInit();
    
    if (INIT_SPLIDE_ACTIVE) initSplide();
    if (INIT_BUTTER) initButter();
})

// FUNCTIONS
function initButter() {
    butter.init({
        cancelOnTouch: false,
        wrapperDamper: 0.09,
        wrapperId: 'butter',
    });
}

function initSplide() {
    let options = {
        "bg__slider": {
            type: "loop",
            arrows: false,
            pagination: false,
            speed: 1000,
            autoplay: true,
            interval: 6000,
            loop: true,
            drag: false,
            pauseOnHover: false,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
        "blog__slider": {
            type: "slide",
            rewindByDrag: true,
            gap: "30px",
            autoWidth: true,
            arrows: false,
            pagination: false,
            drag: "free",
            speed: 50,
        },
        "review__slider": {
            type: "slide",
            rewindByDrag: true,
            gap: "30px",
            autoWidth: true,
            autoHeight: true,
            arrows: false,
            pagination: true,
            speed: 500,
            perMove: 1,
            interval: 3000,
            loop: true,
        },
    };
    let splides = document.querySelectorAll(".splide");
    for (let i = 0; i < splides.length; i++) {
        let style = splides[i].classList[0];
        let op = options[style];  
        new Splide(splides[i], op).mount();
    }
}

window.addEventListener("scroll", () => {
    let nav = document.querySelector("header");
    let offsetTop = nav.offsetTop + window.scrollY;

    if (offsetTop > 0) {
        nav.classList.add("fixed");
    }
    else {
        nav.classList.remove("fixed");
    }
})

window.addEventListener("scroll", () => {
    let back = document.querySelector("#go-back");
    let btn = back.querySelector(".ico_wrap");

    let start = document.querySelector("#review");

    let offsetTop_back = back.offsetTop + window.scrollY;
    let offsetTop_start = start.offsetTop;
    
    if (offsetTop_back > offsetTop_start) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }
})
    


function formLabel() {
    let input_label = document.querySelector(".form_gor").querySelector(".input-wrap").querySelector("label");
    let btn_label   = document.querySelectorAll(".form_gor_label");
    let il_style = window.getComputedStyle(input_label);

    let il_height = input_label.clientHeight;
    let il_margin = il_style.marginBottom;
    let bl_height = parseInt(il_height) + parseInt(il_margin);

    btn_label.forEach(el => {
        el.style.height = `${bl_height}px`;
    })
}

function intlTelInit() {
    let phoneInputField = document.querySelectorAll('._tel');

    let phoneInit = phoneInputField.forEach(el => {
        window.intlTelInput(el, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
            dropdownContainer: el.parentNode,
            initialCountry: "ua",
            preferenceCountries: ["ua", "us", "uk"],
            excludeCountries: ["ru"],
            formatOnDisplay: true,
            nationalMode: true,
        });
    })

    let reset = function() {
        phoneInputField.forEach(el => {el.classList.remove("error")});
    };

    // on blur: validate
    function addEvent(el) {
        reset();

        if (el.value.trim()) {
            if (phoneInit.isValidNumber()) {
            // validMsg.classList.remove("hide");
            } else {
                el.classList.add("error");
                let errorCode = phoneInit.getValidationError();
                // errorMsg.innerHTML = errorMap[errorCode];
                // errorMsg.classList.remove("hide");
            }
        }
    }
    phoneInputField.forEach(el => { addEvent(el); });

    // on keyup / change flag: reset
    phoneInputField.forEach(el => { el.addEventListener('change', reset); });
    phoneInputField.forEach(el => { el.addEventListener('keyup', reset); });
}

function formValidateInit() {
    // tel
    intlTelInit(); 

    const form = document.querySelectorAll('.feedback__form');
    form.forEach(el => { el.addEventListener("submit", formSend); });

    async function formSend(e) {
        e.preventDefault();

        let err = formValidate(form);
    }

    function formValidate() {
        let error = 0;
        let formReq = document.querySelectorAll('._req');
    
        formReq.forEach(input => {
            formRemoveError(input);

            if (input.getAttribute('type') == 'email') {
                if (!emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('type') == 'tel') {
                if(!telTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('name') == 'name') {
                if(!nameTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else {
                if (input.value == '') {
                    formAddError(input);
                    error++;
                }
            }
        })
    }
    function formAddError(input) {
        input.parentNode.classList.add("_error");
        input.classList.add("_error");
    }
    function formRemoveError(input) {
        input.parentNode.classList.remove("_error");
        input.classList.remove("_error");
    }
    function emailTest(input) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(input.value);
    }
    function telTest(input) {
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(input.value);
    }
    function nameTest(input) {
        return /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/g.test(input.value);
    }
}

function popExpand(popUp_id) {
    let popUp = document.querySelector(popUp_id);
    let overlay = popUp.querySelector('.overlay');

    popUp.style.height = window.getComputedStyle.height;
    overlay.style.height = window.getComputedStyle.height;

    popUp.classList.add("show");
    document.querySelector("body").classList.add("hide_sb");
}

function popClose(popUp_id) {
    let popUp = document.querySelector(popUp_id);

    popUp.classList.remove("show");
    document.querySelector("body").classList.remove("hide_sb");  
}

function popUpInit() {
    let popUp_id = "#popupBox";
    let popUp = document.querySelector(popUp_id);

    let form = popUp.querySelector('form');
    let btn = document.querySelectorAll(".pop-up_form");
    let overlay = popUp.querySelector('.overlay');
    let close = popUp.querySelector(".close");
    
    btn.forEach(el => {
        el.addEventListener("click", () => {
            popExpand(popUp_id);
        })
    }) 

    overlay.addEventListener("click", () => {
        popClose(popUp_id);
    })
    
    close.addEventListener("click", () => {
        popClose(popUp_id);
    })
    form.addEventListener("submit", () => {
        popClose(popUp_id);
    })
}