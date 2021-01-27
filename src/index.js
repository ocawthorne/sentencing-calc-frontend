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
   <input type="number" min="0" name="years_${countNum+1}" placeholder="years" class="gordon-num years count-${countNum+1}" onkeyup="calculateSentence()">
   <input type="number" min="0" name="months_${countNum+1}" placeholder="months" class="gordon-num months count-${countNum+1}" onkeyup="calculateSentence()">
   <input type="number" min="0" name="days_${countNum+1}" placeholder="days" class="gordon-num days count-${countNum+1}" onkeyup="calculateSentence()"><br><br> 
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
      prevRow.innerHTML += `<td><input type="checkbox" class="gordon count-${i} count-${nodes.length+1}" onclick="calculateSentence()"></td>`
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

function gordonEvaluator() {
   let pairs = []
   let dupeBool = false
   Array.from(document.querySelectorAll('.gordon')).forEach(pair => {
      if (pair.checked) pairs.push(Array.from(pair.classList).slice(1))
   })
   if (pairs.length > 1) {
      document.getElementById('chain-warning').style.display = "none"
      for(let i=0; i<pairs.length; i++) {
         for(let j=0; j<pairs.length; j++) {
            if (pairs[i][1] === pairs[j][0]) {
               dupeBool = true
            }
         }
      }
   }
   return {
      pairs: pairs,
      chaining: dupeBool
   }
}

function calculateSentence() {
   let days = 0
   if (gordonEvaluator().pairs.length > 0) {
      days = gordonEvaluator().days
   }
   document.querySelectorAll('.years,.months,.days').forEach(function(el) {
      let val = parseInt(el.value)
      switch(el.placeholder) {
         case "years":
            if (!isNaN(val)) days += val * 360
            break
         case "months":
            if (!isNaN(val)) days += val * 12
            break
         case "days":
            if (!isNaN(val)) days += val
      }
   })

   let warning = document.getElementById('chain-warning')

   if (gordonEvaluator().chaining) {
      warning.style.display = "block"
      days = 0
   } else {
      warning.style.display = "none"
   }
   
   document.getElementById('sentence-comp').innerText = convertToMD(days)
}

function convertToMD(days) { // Based on 30-day months, bfwd PRE-DISCOUNT
   let discount = parseInt(document.getElementById('discount'))
   if (isNaN(discount)) discount = 0

   let newDays = Math.floor(days*discount)
   let daysDisp = newDays % 30 //FIXME Inaccurate computation, needs concurrency computations first from gordonEvaluator()
   let monthsDisp = Math.floor(newDays / 30)

   return `${monthsDisp} months, ${daysDisp} days`
}

function save() {
   // TODO Write code which saves an instance of Defendant into JSON
}
