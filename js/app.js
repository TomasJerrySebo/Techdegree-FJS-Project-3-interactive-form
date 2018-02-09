window.FSFORM = {
        // defining global vars
        other_title: document.getElementById('other-title'),
        t_shirt_color: document.getElementById('colors-js-puns'),
        t_shirt_color_select: document.getElementById('color'),
        activity_checkboxes: document.querySelectorAll('.activities input[type="checkbox"]'),
        payment_select: document.getElementById("payment"),
        payment_method: document.querySelectorAll(".payment-method"),
        init: function () {
            // hiding other title
            FSFORM.other_title.style.display = "none";
            // tshirt color
            FSFORM.t_shirt_color.style.display = "none";
            // payment_select
            FSFORM.payment_select.value="credit card";
            // focusing the first field
            document.getElementById('name').focus();

            // appending keypres events to validate each input fields
            document.getElementById('name').addEventListener("keypress",function (ev) { setTimeout(function () {
                FSFORM.validateNameFormat(document.forms[0]["user_name"]);
            },200); });
            document.getElementById('mail').addEventListener("keypress",function (ev) { setTimeout(function () {
                FSFORM.validateEmailFormat(document.forms[0]["user_email"]);
            },200); });
            document.getElementById('cc-num').addEventListener("keypress",function (ev) { setTimeout(function () {
                FSFORM.validateCCNFormat(document.forms[0]["user_cc-num"]);
            },200); });
            document.getElementById('zip').addEventListener("keypress",function (ev) { setTimeout(function () {
                FSFORM.validateZIPFormat(document.forms[0]["user_zip"]);
            },200); });
            document.getElementById('cvv').addEventListener("keypress",function (ev) { setTimeout(function () {
                FSFORM.validateCVVFormat(document.forms[0]["user_cvv"]);
            },200); });

            // payment select change event
            FSFORM.payment_select.addEventListener('change',function (ev) {
                for(var i = 0; i < FSFORM.payment_method.length; i++){
                    // hiding all divs
                    FSFORM.payment_method[i].style.display = "none";
                }
                var value = this.value.replace(/\s+/g,'-');
                // showing the selected div based on the payment method, if nothing is selected we don't show any div
                if(value !== 'select_method') document.getElementById(value).style.display = "block";
            });
            // triggering initial payment select change event
            FSFORM.payment_select.dispatchEvent(new Event('change'));

            // title select change event
            document.getElementById('title').addEventListener('change',function (ev) {
                // show hide the other input field based on the selection of the select
                if(this.value == 'other') FSFORM.other_title.style.display = "block";
                else { FSFORM.other_title.style.display = "none";}
            });

            // tshirt design change event
            document.getElementById('design').addEventListener('change',function (ev) {
                var designVal = this.value;
                // logic to show hide the colors for the selected design theme using the innerHtml value, formating it and then using the indexOf to check wich colors to show
                if(designVal !== 'Select Theme') {
                    var designHtml = this.options[this.selectedIndex].text.split("-")[1].replace(/\s+/g,'');
                    for(var i = 0; i < FSFORM.t_shirt_color_select.children.length; i++) {
                        FSFORM.t_shirt_color_select.children[i].style.display = "none";
                        if(FSFORM.t_shirt_color_select.children[i].text.toLocaleLowerCase().replace(/\s+/g,'').indexOf(designHtml.toLowerCase()) >= 0){ FSFORM.t_shirt_color_select.children[i].style.display = "block"; FSFORM.t_shirt_color_select.children[i].selected = true; }
                        FSFORM.t_shirt_color.style.display = "block";
                    }
                }
                else { FSFORM.t_shirt_color.style.display = "none"; }

                if(this.value == 'other') FSFORM.other_title.style.display = "block"
                else { FSFORM.other_title.style.display = "none";}
            });


            for(var i = 0; i < FSFORM.activity_checkboxes.length; i++) {
                if(FSFORM.activity_checkboxes[i].className != 'appended'){
                    // appending the change events to each activity checkbox if it doesn't contain the class 'appended'
                    FSFORM.activitiesChange(FSFORM.activity_checkboxes[i]);
                }
            }

            // form submit
            document.getElementsByTagName('form')[0].addEventListener('submit',function (ev) { FSFORM.validateForm(ev,ev.target);
            });

        },
        activitiesChange: function(element){
            element.classList.add('appended');
            // appending the event
            element.addEventListener("change",function (e) {
                var price = 0;
                var time = '';
                // checking if it's checked
                if(e.target.checked == true) {
                    // calculating the price which will be added to the total
                     price += parseInt(e.target.nextSibling.textContent.split("$")[1]);
                     if(e.target.name !== 'all') {
                         // parsing out the time and trimming it to compare with the rest of the siblings;
                         time = e.target.nextSibling.textContent.split("—")[1].split(",")[0].replace(/\s+/g,'');
                         // comparing the time with the rest of the siblings
                         for(var i = 0; i < FSFORM.activity_checkboxes.length; i++) {
                             if(FSFORM.activity_checkboxes[i].nextSibling.textContent.replace(/\s+/g,'').indexOf(time) >= 0 && FSFORM.activity_checkboxes[i].name != e.target.name){
                                 FSFORM.activity_checkboxes[i].disabled = true;
                                 FSFORM.activity_checkboxes[i].parentElement.classList.add('disabled');
                             }

                         }
                     }

                }
                else {
                    // if it's not checked then just reverting to the previous state
                    price -= parseInt(e.target.nextSibling.textContent.split("$")[1]);
                    for(var i = 0; i < FSFORM.activity_checkboxes.length; i++) { FSFORM.activity_checkboxes[i].parentElement.classList.remove('disabled'); FSFORM.activity_checkboxes[i].disabled = false; }
                }
                // appending the price
                document.querySelector("#total span").innerHTML = parseInt(document.querySelector("#total span").innerHTML) + price;

            })
        },
        // name validation only if it's not empty
        validateNameFormat: function (name) {

            if(name.value.length <= 0) { name.classList.add("error"); name.placeholder = "Name field can't be empty."; name.focus(); return false; }
            else {name.classList.remove("error"); name.placeholder = ""; return true;}
        },
    // email format validation
        validateEmailFormat: function (email) {
        var reg = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        if(!reg.test(email.value)) { email.classList.add("error"); email.placeholder = "Please enter a valid email address."; email.focus(); return false; }
        else {email.classList.remove("error"); email.placeholder = ""; return true;}
        },
    // CNN format validation
    validateCCNFormat: function (ccn) {
            var reg = /^[0-9]{13,16}$/;
            if(!reg.test(parseInt(ccn.value.replace(/\s+/g,'')))) { ccn.classList.add("error"); ccn.placeholder = "CCN must be between 13 and 16 digits."; ccn.focus(); return false; }
            else {ccn.classList.remove("error"); ccn.placeholder = ""; return true;}
        },
    // ZIP validation
        validateZIPFormat: function (zip) {
            var reg = /^[0-9]{5}$/;
            if(!reg.test(parseInt(zip.value.replace(/\s+/g,'')))) { zip.classList.add("error"); zip.placeholder = "ZIP must be a 5 digit number."; zip.focus(); return false; }
            else {zip.classList.remove("error"); zip.placeholder = ""; return true;}
        },
    // CVV validation
        validateCVVFormat: function (cvv) {
            var reg = /^[0-9]{3}$/;
            if(!reg.test(parseInt(cvv.value.replace(/\s+/g,'')))) { cvv.classList.add("error"); cvv.placeholder = "CCV must be a 3 digit number."; cvv.focus(); return false; }
            else {cvv.classList.remove("error"); cvv.placeholder = ""; return true;}
        },

        // main form validation on submit
        validateForm: function(event, forms){
            // creating a object of the form data for validation purpouses
            var form = {};
            form.name = forms["user_name"];
            form.email = forms["user_email"];
            form.title = forms["user_title"];
            form.other_title = forms["other-title"];
            form.activities = 0;
            form.payment = forms["payment"];
            form.ccn = forms["user_cc-num"];
            form.zip = forms["user_zip"];
            form.cvv = forms["user_cvv"];
            form.exp_date = forms["user_exp-month"];
            form.exp_year = forms["user_exp-year"];
            for(var i = 0; i < FSFORM.activity_checkboxes.length; i++) {
            if(FSFORM.activity_checkboxes[i].checked == true){ form.activities++;}
            }

            // validation for every field
            if(!FSFORM.validateNameFormat(form.name)) { event.preventDefault(); return false; }

            // validate email
            if(!FSFORM.validateEmailFormat(form.email)) { event.preventDefault(); return false; }

            // validate activities
            if(form.activities <= 0) { document.getElementById('activities').insertAdjacentHTML('afterBegin', '<p class="error">Please select at least one activity.</p>'); FSFORM.activity_checkboxes[0].focus(); event.preventDefault(); return false;   }
            else { if(document.querySelector('#activities .error') !== null) document.querySelector('#activities .error').remove(); }

            // if payment method is credit card run the rest of the validation
            if(form.payment.value == 'credit card') {
                //validate credit card number
                if (!FSFORM.validateCCNFormat(form.ccn)) {
                    event.preventDefault();
                    return false;
                }

                // validate zip code
                if (!FSFORM.validateZIPFormat(form.zip)) {
                    event.preventDefault();
                    return false;
                }

                //validate cvv
                if (!FSFORM.validateCVVFormat(form.cvv)) {
                    event.preventDefault();
                    return false;
                }
            }
            return true;


        }

}

FSFORM.init();
