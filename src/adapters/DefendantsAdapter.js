class DefendantsAdapter {
   constructor() {
      this.baseUrl = 'http://localhost:3000/api/v1/defendants'
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
      
      //Counts
      let countContainer = document.getElementById('display-counts')
      if (countContainer.childElementCount !== defendant.counts.length) {
         for(let k=0; k<defendant.counts.length; k++) {
            let newLi = document.createElement('li')
            newLi.innerText = `Count ${k+1}: ${defendant.counts[k].name}` //FIXME Include concurrencies by modifying Rails models
            countContainer.appendChild(newLi)
         }
      }
      // Discount
      document.getElementById('display-discount').innerText = defendant.discount

      // FIXME Concurrency

      // Total Sentence
      document.getElementById('display-sentence').innerText = defendant.sentence_len
   }
}
