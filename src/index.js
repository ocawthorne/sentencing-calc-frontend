const app = new App()
let days = 0
let session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
document.getElementById('session-id').firstChild.nodeValue = session

function newDefendant() {
   let x = document.getElementById('new-defendant-form-container')
   if (x.style.display === "none") {
      x.style.display = "block"
   } else {
      x.style.display = "none"
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
document.getElementById('concurrent-check').addEventListener('click', gordonEvaluator)
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
   let EXCLUDED = []
   let WINNER
   let pairs = []
   days = 0
   let tableDimensions = document.querySelectorAll('.count').length

   // Before anything, check if the "all concurrent?" box has been checked. If so, only max is needed.
   if (document.getElementById('concurrent-check').checked) {
      arr = []
      for(let k=1; k<=tableDimensions; k++) {
         arr.push(parseInt(getDaysFromYMD(`count-${k}`)))
      }
      return days = Math.max(...arr)
   }

   // If not checked, then the process of searching for chained concurrences occurs.
   Array.from(document.querySelectorAll('.gordon')).forEach(pair => {
      if (pair.checked) pairs.push(Array.from(pair.classList).slice(1))
   })
   if (pairs.length > 1) {
      for(let i=0; i<pairs.length; i++) {
         for(let j=0; j<pairs.length; j++) {
            if (pairs[i][1] === pairs[j][0]) {
               let arr = [
                  getDaysFromYMD(pairs[i][0]),
                  getDaysFromYMD(pairs[i][1]),
                  getDaysFromYMD(pairs[j][1]),
               ]
               countArr = [pairs[i][0], pairs[i][1], pairs[j][1]]
               EXCLUDED.push(pairs[i][0], pairs[i][1], pairs[j][1])
               EXCLUDED = [...new Set(EXCLUDED)] // Removes duplicates
               WINNER = countArr[arr.indexOf(Math.max(...arr))]              
            }
         }
      }
   }

   // Firstly, add all days as if counts were consecutive:
   for(let k=1; k<=tableDimensions; k++) {
      days += getDaysFromYMD(`count-${k}`)
   }

   // Then, subtract each of the counts which are the "losers" in a concurrent scenario. The winner value stays.
   if (EXCLUDED.length > 0) {
      for(let k=0; k<EXCLUDED.length; k++) {
         debugger
         if (EXCLUDED[k] !== WINNER) days -= getDaysFromYMD(EXCLUDED[k])
      }
   }

   // Finally, subtract the lower value in pairs which are not in the EXCLUDED array.
   if (pairs.length > 0) {
      pairs.forEach(pair => {
         if (EXCLUDED.indexOf(pair[0]) === -1) { // If one of the pairs is not in EXCLUDED, the other will not be either.
            days -= Math.min(getDaysFromYMD(pair[0]),getDaysFromYMD(pair[1]))
         }
      })
   }
}

function getDaysFromYMD(param) { // Takes in a string in the format of "count-n" where n is a natural number with a maximum of the table's dimensions.
   return document.querySelector(`.gordon-num.years.${param}`).value * 360 + document.querySelector(`.gordon-num.months.${param}`).value * 30 + document.querySelector(`.gordon-num.days.${param}`).value * 1
}

function calculateSentence() {
   gordonEvaluator()
   document.getElementById('sentence-comp').innerText = convertToMD(days)
}

function convertToMD() { // Based on 30-day months, bfwd PRE-DISCOUNT
   let discount = parseInt(document.getElementById('discount').value)
   if (isNaN(discount)) discount = 0

   let newDays = Math.floor(days*(1-discount/100))
   let daysDisp = newDays % 30
   let monthsDisp = Math.floor(newDays / 30)

   return `${monthsDisp} months, ${daysDisp} days`
}

function save() {
   // TODO Write code which saves an instance of Defendant into JSON
}
