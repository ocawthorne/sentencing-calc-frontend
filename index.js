document.getElementById('new-defendant').addEventListener('click', function() {
   let x = document.getElementById('new-defendant-form-container')
   if (x.style.display === "none") {
      x.style.display = "block"
   } else {
      x.style.display = "none"
   }
})

document.getElementById('new-count').addEventListener('click', function() { // Inserting new counts in New Defendant
   let countNum = document.querySelectorAll('.count').length

})
