class DefendantsAdapter {
   constructor() {
      this.baseUrl = 'http://localhost:3000/api/v1/defendants'
   }

   createDefendant(defendant) {
      return fetch(this.baseUrl, {
         headers: {
            'Accepts': 'application/json',
            'Content-Type': 'application/json'
         },
         method: "POST",
         body: JSON.stringify(defendant)
      }).then(res => res.json())
      debugger
   }

   getDefendants() {
      return fetch(this.baseUrl).then(res => res.json())
   }

   async getDefendant(e) {
      let defendant
      let id = e.srcElement.dataset.defendant // This is the ID of the entry.
      await (fetch(this.baseUrl)
         .then(resp => resp.json())
         .then(objArr => {
            defendant = objArr.find(obj => obj.id === parseInt(id))
         })
      )
      
      // Name
      document.getElementById('display-name').innerText = defendant.name

      //FIXME Counts (backend needs to recognise has_many counts properly.)
      // defendant.counts
      // document.getElementById('display-counts')

      // Discount
      document.getElementById('display-discount').innerText = defendant.discount

      // FIXME Concurrency

      // Total Sentence
      document.getElementById('display-sentence').innerText = defendant.sentence_len
   }
}
