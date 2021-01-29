class Defendants {
   constructor() {
      this.defendants = []
      this.adapter = new DefendantsAdapter()
      this.bindEventListeners()
      this.fetchAndLoadDefendants()
   }

   bindEventListeners() {
      this.defendantForm = document.getElementById('add-defendant-form')
      this.defendantForm.addEventListener('submit', this.createDefendant)
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
               length: countLength
            })
         }
      })

      console.log(defendant)


      document.forms[0].reset() // Clear
   }

   fetchAndLoadDefendants() {
      this.adapter.getDefendants().then(defendants => {
         defendants.forEach(defendant => this.defendants.push(defendant))
      })
      .then(() => {
         this.render()
      })
   }

   render() {
      const defendantsContainer = document.getElementById('defendant-display')
      
   }
}
