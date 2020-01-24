
console.log("main.js");
//import { parseWithoutProcessing } from "handlebars";
// Make sure we wait to attach our handlers until the DOM is fully loaded.
 $(document).ready(function () {
  // console.log("this is main.js");

  $("#reg-submit-btn").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    // console.log("reg submit");
    const userData = {
      username: $("#username").val().trim(),
      password: $("#password").val().trim(),
      first_name: $("#first_name").val().trim(),
      last_name: $("#last_name").val().trim(),
      address: $("#address").val().trim(),
      city: $("#city").val().trim(),
      state: $("#state").val().trim(),
      zipcode: $("#zipcode").val().trim(),
      state: $("#state").val().trim(),
      phoneNumber: $("#phoneNumber").val().trim(),
      email: $("#email").val().trim(),
    };
    //Send the POST request.
    $.ajax({
      url: "/register",
      type: "POST",
      data: userData
    }).then(
      function (data) {
         console.log(data);
        // Reload the page to get the updated list
        location.href="/service-menu";
      }
    );
  });
 });


