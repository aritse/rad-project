// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(function () {
  $(".updateCustomerForm").on("submit", function (event) {
    event.preventDefault();
    // build the userData object
    const userData = {
      firstName: $("#firstName").val().trim(),
      lastName: $("#lastName").val().trim(),
      streetAddress: $("#streetAddress").val().trim(),
      city: $("#city").val().trim(),
      state: $("#state").val().trim(),
      zipCode: $("#zipCode").val().trim(),
      phoneNumber: $("#phoneNumber").val().trim(),
      email: $("#email").val().trim()
    };

    const url = "/api/customers/" + $("#id").val().trim();

    //Send the POST request.
    $.ajax({
      url: url,
      type: "PUT",
      data: userData
    }).then(
      function (data) {
        // Reload the page to get the updated list
        location.href = "/customer-info";
      }
    );
  });
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
      zipCode: $("#zipcode").val().trim(),
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
   * On Handyman Register Submit, Register new handyman
   */
  $("#handyreg-submit-btn").on("click", function (event) {
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
      zipCode: $("#zipcode").val().trim(),
      phoneNumber: $("#phoneNumber").val().trim(),
      email: $("#email").val().trim(),
    };

    //Send the POST request.
    $.ajax({
      url: "/handyman-register",
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
      function (data) {
        console.log("object sent");
        console.log(data);
      }
    )
  })
  $("#timeSlotForm").on("click", "tbody", "tr", function (event) {
    $(this).addClass("highlight").siblings().removeClass("highlight");
  })

  $("#timeSubmit").on("click", function (event) {
    var rows = isLitRow();
    var timeSlot = rows.attr("id")
    $.ajax({
      url: "/api/request/confirm",
      type: "POST",
      data: timeSlot
    }).then(
      function (data) {
        console.log("data time slot sent");
      }
    )
  })

  var isLitRow = function () {
    return $("table > tbody > tr.highlight");
  }

  /**
   * User has entered user name and password 
   * into /login screen
   * on submit data will be posted to /login
   *  */

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


  $("#handyloginForm").on("submit", function (event) {
    event.preventDefault();

    const loginData = {
      username: $("#handyloginForm [name=username]").val().trim(),
      password: $("#handyloginForm [name=password]").val().trim()
    }

    $.ajax("/handyman-login", {
      method: "POST",
      data: loginData,
      success: function (data) {
        localStorage.setItem("access_token", JSON.stringify(data.access_token));
        location.href = "/service-menu";
      },
      error: function (err) {
        alert(err.responseJSON);
        $("#handyloginForm")[0].reset();
      }
    });
  });

  //for the service selection page Materialize will not show dropdowns by default
  $('select').formSelect();

});





