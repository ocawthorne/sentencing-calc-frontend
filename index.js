// document.getElementById('new-defendant').addEventListener('click', function() {
//    let x = document.getElementById('new-defendant-form-container')
//    if (x.style.display === "none") {
//       x.style.display = "block"
//    } else {
//       x.style.display = "none"
//    }
// })

function newDefendant() {
   let x = document.getElementById('new-defendant-form-container')
   if (x.style.display === "none") {
      x.style.display = "block"
   } else {
      x.style.display = "none"
   }
}

document.getElementById('new-count').addEventListener('click', function(e) { // Inserting new counts in New Defendant
   e.preventDefault()

   let countNum = document.querySelectorAll('.count').length
   nodes = document.querySelectorAll('.count')
   el = document.createElement("div")
   el.innerHTML = `
   <label for="count" class="count">Count ${countNum+1}:</label>
   <input type="text" name="count_${countNum+1}" placeholder="offence" value required>
   <input type="number" name="years_${countNum+1}" placeholder="years" class="num-field years">
   <input type="number" name="months_${countNum+1}" placeholder="months" class="num-field months">
   <input type="number" name="days_${countNum+1}" placeholder="days" class="num-field days"><br><br> 
   ` // FIXME Needs updating to match index.html
   nodes[nodes.length-1].parentNode.insertBefore(el, nodes.nextSibling)
})

function calculateSentence() {
   let years = 0
   Object.entries(document.getElementsByClassName('years')).forEach(function(el) {
      years += parseInt(el[1].value)
   })
   sum
}

function save() {
   // TODO Write code which saves an instance of Defendant into JSON
}
