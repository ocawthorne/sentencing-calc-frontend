class DefendantsAdapter {
   constructor() {
      this.baseUrl = 'http://localhost:3000/api/v1/defendants/'
   }

   async createDefendant(defendant) {
      const res = await fetch(this.baseUrl, {
         headers: {
            'Accepts': 'application/json',
            'Content-Type': 'application/json'
         },
         method: "POST",
         body: JSON.stringify(defendant)
      })
      return await res.json()
   }

   async getDefendants() {
      const res = await fetch(this.baseUrl)
      return await res.json()
   }

   async getDefendant(e) {
      let id = e.srcElement.dataset.defendant // This is the ID of the entry.
      let res = await (fetch(`${this.baseUrl}${id}`))
      let defendant = await res.json()

      // Name
      document.getElementById('display-name').innerText = defendant.name

      // Discount
      document.getElementById('display-discount').innerText = defendant.discount

      // FIXME Concurrency

      // Total Sentence
      document.getElementById('display-sentence').innerText = defendant.sentence_len
   }

}
