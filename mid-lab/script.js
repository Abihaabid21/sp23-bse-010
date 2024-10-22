// JavaScript to handle the hover effect on the profile picture
document.addEventListener("DOMContentLoaded", function () {
    const profilePic = document.querySelector(".profile-pic");
    const introText = document.getElementById("intro-text");
  
    // Show the introduction when hovering over the profile picture
    profilePic.addEventListener("mouseenter", function () {
      introText.style.display = "block";
    });
  
    // Hide the introduction when mouse leaves the profile picture
    profilePic.addEventListener("mouseleave", function () {
      introText.style.display = "none";
    });
  });
  