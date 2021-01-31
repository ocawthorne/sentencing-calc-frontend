let session
newSession() // A session is defined before the DOM loads so that the user has a session ID before viewing the page
const app = new App()
let days = 0

// This function is called without argument when randomly generated. When called with an non-undefined value, a session ID of choice is generated.
function newSession(manual) {
   if (manual) {
      session = document.getElementById('previous-session-field').value
   } else {
      session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
   }
   document.getElementById('session-id').firstChild.nodeValue = session
   document.getElementById('defendant-list').innerHTML = ''
   document.getElementById('defendant-list-title').style.display = "none"
   new Defendants
}

// Provides warning about refreshing page. Doing this would erase the session ID.
window.onbeforeunload = func => "Data will be lost if you leave the page, are you sure?";

// Provides a listener for a manual session ID.
document.getElementById('previous-session-button').addEventListener('click', function() {
   if (!!document.getElementById('previous-session-field').value) newSession(true)
   document.getElementById('previous-session-field').value = ''
})

document.getElementById('new-session').addEventListener('click', function() {
   let confirmation = confirm(`Are you sure you want to reset the session?\n\nIf you retrieve a new session ID, all your defendant data will be lost. However, if you keep your session ID safe, you will be able to access this information for 7 days until the data is automatically destroyed.`)
   if (confirmation) newSession()
   newDefendant()
})

const newForm = document.getElementById('new-defendant-form-container')
const defendantDisplay = document.getElementById('defendant-display') 

function newDefendant() {
   newForm.style.display = "block"
   defendantDisplay.style.display = "none"
}

document.getElementsByClassName('new-count')[0].addEventListener('click', function(e) { // Inserting new counts in New Defendant
   // Adding offence, Y/M/D fields
   e.preventDefault()
   let countNum = document.querySelectorAll('.count').length
   let nodes = document.querySelectorAll('.count')
   let el = document.createElement("div")

   el.innerHTML = `
   <label for="count" class="count">Count ${countNum+1}:</label>
   <input type="text" name="count-${countNum+1}" class="offence" placeholder="offence">
   <input type="number" min="0" name="years_${countNum+1}" placeholder="years" class="gordon-num years count-${countNum+1}" onkeyup="calculateSentence()">
   <input type="number" min="0" name="months_${countNum+1}" placeholder="months" class="gordon-num months count-${countNum+1}" onkeyup="calculateSentence()">
   <input type="number" min="0" name="weeks_${countNum+1}" placeholder="weeks" class="gordon-num weeks count-${countNum+1}" onkeyup="calculateSentence()">
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
      // In the primary for loop, the second element of each pair is selected for comparison.
      for(let i=0; i<pairs.length; i++) {
         // In the secondary for loop, the first element of each pair is selected for comparison.
         for(let j=0; j<pairs.length; j++) {
            /* Each pair is in the format [count-a, count-b], [count-c, count-d], etc.
            Assume that count-a = A, count-b = B, etc. Any two pairs = [A,X][Y,C]
            If X=Y then it follows that the pairs are equivalent to [A,X][X,C].
            This means that A and C, through X, are connected. Thus, [A,X][X,C] is identical to [A,X][A,C].
            The three elements A, X, and C are separated into an array, EXCLUDED, from which a WINNER is determined.
            In cases where this is not true (i.e. X != Y) then there is no link between A, X, and C. */
            if (pairs[i][1] === pairs[j][0]) { 
               let arr = [
                  getDaysFromYMD(pairs[i][0]),
                  getDaysFromYMD(pairs[i][1]),
                  getDaysFromYMD(pairs[j][1]),
               ]
               countArr = [pairs[i][0], pairs[i][1], pairs[j][1]] //TODO Check whether this line is necessary. Could be replaced by EXCLUDED.
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

   return {pairs: pairs}
}

function getDaysFromYMD(param) { // Takes in a string in the format of "count-n" where n is a natural number with a maximum of the table's dimensions.
   return document.querySelector(`.gordon-num.years.${param}`).value * 360 + document.querySelector(`.gordon-num.months.${param}`).value * 30 + document.querySelector(`.gordon-num.weeks.${param}`).value * 7 + document.querySelector(`.gordon-num.days.${param}`).value * 1
}

function calculateSentence() {
   gordonEvaluator()
   document.getElementById('sentence-comp').innerText = convertToMD(days)
}

function convertToMD(days, noDiscount=false) { // Based on 30-day months, bfwd PRE-DISCOUNT
   let discount = parseInt(document.getElementById('discount').value)
   if (noDiscount) {
      discount = 0
   } else {
      if (isNaN(discount)) discount = 0
   }

   let newDays = Math.floor(days*(1-discount/100))
   let daysDisp = newDays % 30
   let monthsDisp = Math.floor(newDays / 30)

   return `${monthsDisp} months, ${daysDisp} days`
}

function copy() {
   window.prompt("Copy to clipboard: Ctrl+C, Enter", session)
}

document.getElementById('clear-form').addEventListener('click', resetFields)

// Reset all other values and fields
function resetFields() {
   document.forms[0].reset() // Clear form fields

   document.getElementById('con-tab').innerHTML = `
   <tr class="table-headers">
      <th class="space">&nbsp;</th>
      <th id="col1">1</th>
   </tr>
   <tr id="row1">
      <th>1</th>
      <td>-</td>
   </tr>
   `

   document.getElementById('concurrency-table').style.display = "none"

   document.getElementById('counts').innerHTML = `
   <label for="count" class="count">Count 1:</label>
   <input type="text" name="count-1" class="offence" placeholder="offence" value required>
   <input type="number" min="0" name="years_1" placeholder="years" class="gordon-num years count-1" onkeyup="calculateSentence()">
   <input type="number" min="0" name="months_1" placeholder="months" class="gordon-num months count-1" onkeyup="calculateSentence()">
   <input type="number" min="0" name="weeks_1" placeholder="weeks" class="gordon-num weeks count-1" onkeyup="calculateSentence()">
   <input type="number" min="0" name="days_1" placeholder="days" class="gordon-num days count-1" onkeyup="calculateSentence()"><br><br>
   `

   document.getElementById('sentence-comp').innerText = "0 months, 0 days"
}
