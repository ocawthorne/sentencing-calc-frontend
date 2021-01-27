const app = new App()

function newDefendant() {
   let x = document.getElementById('new-defendant-form-container')
   if (x.style.display === "none") {
      x.style.display = "block"
      return true
   } else {
      x.style.display = "none"
      return false
   }
}

document.getElementsByClassName('new-count')[0].addEventListener('click', function(e) { // Inserting new counts in New Defendant
   // Adding offence, Y/M/D fields
   e.preventDefault()
   let countNum = document.querySelectorAll('.count').length
   let nodes = document.querySelectorAll('.count')
   let el = document.createElement("div")

   el.innerHTML = `
   <label for="count" class="count">Count ${countNum+1}:</label>
   <input type="text" name="count_${countNum+1}" placeholder="offence" value required>
   <input type="number" min="0" name="years_${countNum+1}" placeholder="years" class="num-field years" onkeyup="calculateSentence()">
   <input type="number" min="0" name="months_${countNum+1}" placeholder="months" class="num-field months" onkeyup="calculateSentence()">
   <input type="number" min="0" name="days_${countNum+1}" placeholder="days" class="num-field days" onkeyup="calculateSentence()"><br><br> 
   `
   //TODO needs a delete button for superfluous counts
   nodes[nodes.length-1].parentNode.insertBefore(el, nodes.nextSibling)

   // Adding rows and columns to Concurrency Table
   let table = document.querySelector('#con-tab').getElementsByTagName('tbody')[0]
   // Add new row
   row = document.createElement('tr')
   row.id = `row${countNum+1}`
   row.innerHTML = `<th>${countNum+1}</th>`+`<td>-</td>`.repeat(countNum+1)
   for (let i=1; i<countNum+1; i++) {
      prevRow = document.getElementById(`row${i}`)
      prevRow.innerHTML += `<td><input type="checkbox" class="row-${i} col-${i+1}" onclick="calculateSentence()"></td>`
   }
   table.appendChild(row)

   // Add new column
   header = document.createElement('th')
   let text = `<th>${countNum+1}</th>`
   header.innerHTML = text
   table.firstElementChild.appendChild(header)

   document.getElementById('concurrent-question').style.display = "block"

})

document.getElementById('concurrent-check').addEventListener('click', displayConcurrencyTable)
document.querySelector('.new-count').addEventListener('click', displayConcurrencyTable)

function displayConcurrencyTable() {
   let x = document.getElementById('concurrency-table')
   if (document.getElementById('concurrent-check').checked || document.querySelectorAll('.count').length < 3) {
      x.style.display = "none"
   } else {
      x.style.display = "block"
   }
}

function calculateSentence() {
   let years = months = days = 0
   // Object.entries(document.getElementsByClassName('years')).forEach(function(el) {
   document.querySelectorAll('.years,.months,.days').forEach(function(el) {
      let val = parseInt(el.value)
      switch(el.placeholder) {
         case "years":
            if (!isNaN(val)) years += val
            break
         case "months":
            if (!isNaN(val)) months += val
            break
         case "days":
            if (!isNaN(val)) days += val
      }
   })
   document.getElementById('sentence-comp').innerText = convertToMD(years, months, days)
}

function convertToMD(years, months, days) { // Based on 30-day months
   daysDisp = days % 30
   monthR = Math.floor(days / 30)
   monthsDisp = (months + monthR + years*12)

   return `${monthsDisp} months, ${daysDisp} days`
}

function save() {
   // TODO Write code which saves an instance of Defendant into JSON
}
