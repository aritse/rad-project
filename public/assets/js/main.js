// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(function () {

  // init New Service Form as hidden
  $("#addServiceForm").hide();
  let addingService = false;

  /**
   * Toggle show/hide the New Service Form
   */
  $("#addServiceBtn").on("click", function (event) {
    event.preventDefault();

    addingService = !addingService;

    if (addingService) {
      $("#addServiceForm").show();
    } else {
      $("#addServiceForm").hide();
    }
  });

  /**
   * On Register Submit, Register new user/customer
   */
  $("#reg-submit-btn").on("click", function (event) {
    event.preventDefault();

    // build the userData object
    const userData = {
      username: $("#username").val().trim(),
      password: $("#password").val().trim(),
      first_name: $("#first_name").val().trim(),
      last_name: $("#last_name").val().trim(),
      address: $("#address").val().trim(),
      city: $("#city").val().trim(),
      state: $("#state").val().trim(),
      zipcode: $("#zipcode").val().trim(),
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
        // store user in local storage
        localStorage.setItem("user", JSON.stringify(data));
        // Reload the page to get the updated list
        location.href = "/service-menu";
      }
    );
  });

  /**
   * User has chosen a date and a service,
   * move on to Create Service Request,
   * we'll need to request all of the available
   * handymen and sort them based on ? 
   * TODO: confirm how this works.
   */
  $("#calendarSubmit").on("click", function (event) {
    event.preventDefault();
    const jobDate = { date: $("#serviceCalendar").val(), serviceId: $("#servicesDropdown").val() };
    // $.ajax({
    //   url: "",//goes to timeslot selection screen
    //   type: POST,
    //   post: jobDate        //uncomment this section after timeslot selection screen is ready for input.
    // }).then(
    //   function (data){
    //     console.log("object sent");  
    //   }
    // )    
  });

});


