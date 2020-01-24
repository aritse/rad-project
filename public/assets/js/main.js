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
      firstName: $("#first_name").val().trim(),
      lastName: $("#last_name").val().trim(),
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
    $.ajax({
      url: "/api/request/availability",//get availability from db
      type: "GET",
      data: jobDate        //uncomment this section after timeslot selection screen is ready for input.
    }).then(
      function (data){
        console.log("object sent");  
      }
    )    
  })
  $("#timeSlotForm").on("click", "tbody", "tr", function(event){
    $(this).addClass("highlight").siblings().removeClass("highlight");
  })

  $("#timeSubmit").on("click", function(event){
    var rows = isLitRow();
    var timeSlot = rows.attr("id")
    $.ajax({
        url:"/api/request/confirm",
        type: "POST",
        data: timeSlot
      }).then(
        function(data){
          console.log("data time slot sent");  
        }
      )
  })

  var isLitRow = function(){
    return $("table > tbody > tr.highlight");
  }

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();

    const loginData = {
      username: $("#loginForm [name=username]").val().trim(),
      password: $("#loginForm [name=password]").val().trim()
    }

    $.ajax("/login", {
      method: "POST",
      data: loginData,
      success: function (data) {
        localStorage.setItem("access_token", JSON.stringify(data.access_token));
        location.href = "/service-menu";
      },
      error: function (err) {
        alert(err.responseJSON);
        $("#loginForm")[0].reset();
      }
    });
  });

    $('select').formSelect();
});


