// $("#second-form").hide();
// const uni = document.getElementById("uni");
// uni.setCustomValidity(false);
$("#uni").focus().val("")[0].setCustomValidity(false);

$("#faculty").typeahead({
  source: (query, process) => {
    return $.post(`/prof-search/${query}`, d => {
      return process(JSON.parse(d).profs);
    });
  }
});

$("#uni").change(function(){
  $(this).removeClass("is-valid").removeClass("is-invalid");
  $.post(`/uni-search/${$(this).val()}`, d => {
    $("#second-form").show();
    const data = JSON.parse(d);
    if (data.title !== null && data.dept !== null) {
      $("#title").val(data.title);
      $("#dept").val(data.dept[0])
      $(this).addClass("is-valid")[0].setCustomValidity("");
      $("#uniHelp").removeClass("invalid-feedback").addClass("valid-feedback").text("Valid UNI");
    } else {
      $(this).addClass("is-invalid");
      $("#uniHelp").removeClass("text-muted").addClass("invalid-feedback").text("Invalid UNI");
    }
  });
});

$("#signin-form").submit(function(e){
  e.preventDefault();
  if ($("form")[0].checkValidity() === true) {
    // const data = $("#signin-form :input").map(
    console.log($("#signin-form").serialize());
    $.post("/", $(this).serialize(), d => {
      const data = JSON.parse(d);
      if (data.message === "success") {
        $("#alert-box").html("<div class='alert alert-success' role='alert'>Thanks for signing in.</div>");
      } else {
        $("#alert-box").html("<div class='alert alert-error' role='alert'>There was some kind of error. Please try agin.</div>");
      }
      $(":input").val("");
      setTimeout(() => {
        location.reload();
      }, 5000);
    });
  } else {
    $(":invalid").removeClass("is-valid").addClass("is-invalid");
  }
});

$("[required='true']").change(function(){
  if ($(this).val().length > 1) {
    $(this).addClass("is-valid")
  }
});

