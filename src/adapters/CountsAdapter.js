class CountsAdapter {
   constructor() {
      this.baseUrl = 'http://localhost:3000/api/v1/counts'
   }

   async createCount(count) {
      const res = await fetch(this.baseUrl, {
         headers: {
            'Accepts': 'application/json',
            'Content-Type': 'application/json'
         },
         method: "POST",
         body: JSON.stringify(count)
      })
      return await res.json()
   }

   async getCounts(e) {
      let defendantCounts = []
      let selectedDefendant
      let id = e.dataset.defendant // This is the ID of the entry.
      await (fetch(this.baseUrl)
         .then(resp => resp.json())
         .then(objArr => {
            defendantCounts.push(objArr.filter(obj => obj.defendant_id === parseInt(id)))
            selectedDefendant = defendantCounts.find(def => def.defendant_id === parseInt(e.dataset.defendant))
         })
      )

      let countContainer = document.getElementById('display-counts')
      countContainer.innerHTML = ''
      
      for (let i = 0; i < defendantCounts[0].length; i++) {
         let newLi = document.createElement('li')
         newLi.innerHTML = `<b>Count ${i+1}:</b> ${defendantCounts[0][i].name} (${defendantCounts[0][i].sentence_len})`
         countContainer.appendChild(newLi)
      }
   }
   
}
