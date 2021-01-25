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
   counts = document.getElementById('counts')
   
   counts.innerHTML += `
   <label for="count" class="count">Count ${countNum+1}:</label>
   <input type="text" name="count_${countNum+1}" placeholder="offence" value required>
   <input type="number" name="years_${countNum+1}" placeholder="years" class="num-field">
   <input type="number" name="months_${countNum+1}" placeholder="months" class="num-field">
   <input type="number" name="days_${countNum+1}" placeholder="days" class="num-field"><br><br>
   `
})
