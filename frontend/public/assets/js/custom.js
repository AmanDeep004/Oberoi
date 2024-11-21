let menuBtn = document.querySelector(".menu-btn");
let menu = document.querySelector(".header__nav");
let menuItem = document.querySelectorAll(".header__nav");

menuBtn.addEventListener("click", function () {
  menuBtn.classList.toggle("active");
  menu.classList.toggle("active");
});

menuItem.forEach(function (menuItem) {
  menuItem.addEventListener("click", function () {
    menuBtn.classList.toggle("active");
    menu.classList.toggle("active");
  });
});

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

$(function () {
  $("#FromDate, #EndDate").datepicker({
    defaultDate: "11/22/2023",
  });
});
$(document).ready(function () {
  // Show the corresponding div based on the initially checked radio button
  showHideDivs();

  // Attach a change event listener to the radio buttons
  $('input[name="event-type"]').change(function () {
    // Show the corresponding div when a radio button is checked
    showHideDivs();
  });
});

function showHideDivs() {
  // Hide all divs
  $('[id^="divOption"]').hide();

  // Check which radio button is checked
  if ($("#radioOption1").is(":checked")) {
    // If Option 1 is checked, show divOption1
    $("#divOption1").show();
  } else if ($("#radioOption2").is(":checked")) {
    // If Option 2 is checked, show divOption2
    $("#divOption2").show();
  }
}
$(".custom-select-dropdown").customSelect({
  hover: false,
  search: false,
  checkboxes: false,
  closeAfterSelect: true,
});

const languages = $("#languages").filterMultiSelect();
