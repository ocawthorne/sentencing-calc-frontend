class Defendants {
   constructor() {
      this.defendants = []
      this.adapter = new DefendantsAdapter()
      this.bindEventListeners()
      this.fetchAndLoadDefendants()
   }

   bindEventListeners() {
      this.defendantForm = document.getElementById('add-defendant-form')
      this.defendantForm.addEventListener('submit', this.createDefendant.bind(this))

      this.defendantView = document.getElementById('defendant-list')
      this.defendantView.addEventListener('click', this.getAndDisplayDefendant.bind(this))
   }

   createDefendant(e) {
      e.preventDefault()

      let defendant = {
         name: document.getElementById('defendant-name').value,
         discount: document.getElementById('discount').value*1,
         counts: [],
         sentence_len: document.getElementById('sentence-comp').innerText,
         sentence_len_raw: Math.floor(days*(1-discount.value/100)),
         concurrency: gordonEvaluator().pairs,
         session_id: session
      }
   
      Array.from(document.getElementsByClassName('offence')).forEach(offence => {
         let countLength = getDaysFromYMD(offence.name)
         if (!!offence.value && countLength > 0) {
            defendant.counts.push({
               name: offence.value,
               length: convertToMD(countLength, true)
            })
         }
      })

      if (!!defendant.name) this.adapter.createDefendant(defendant).then(def => this.defendants.push(def)).then(d => this.render())
      document.forms[0].reset() // Clear form fields

      // Reset all other values and fields

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

   getAndDisplayDefendant(e) {
      // let id = e.target.dataset.defendant
      this.adapter.getDefendant(e)
      newForm.style.display = "none"
      defendantDisplay.style.display = "block"
   }

   fetchAndLoadDefendants() {
      this.session = document.getElementById('session-id').firstChild.nodeValue
      this.adapter.getDefendants().then(defendants => {
         defendants.forEach(def => {
            if (def.session_id === this.session) this.defendants.push(def)
         })
      })
      .then(() => {
         this.render()
      })
   }

   render() {
      const defendantsContainer = document.getElementById('defendant-list')
      defendantsContainer.innerHTML = ''

      this.defendants.forEach(def => {
         let defLink = document.createElement('a')
         defLink.setAttribute('href', 'javascript:void(0)')
         defLink.setAttribute('class', 'sidebar-defendant')
         defLink.setAttribute('data-defendant', `${def.id}`)
         defLink.innerText = ` ${def.name}`
         defendantsContainer.appendChild(defLink)
         if (document.getElementsByClassName('sidebar-defendant').length > 0) {
            document.getElementById('defendant-list-title').style.display = "block"
         }
      })
   }
}
