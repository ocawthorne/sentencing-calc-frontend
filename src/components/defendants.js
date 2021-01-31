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

      resetFields()
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
