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
      let id = e.dataset.defendant // This is the ID of the entry.
      await (fetch(this.baseUrl)
         .then(resp => resp.json())
         .then(objArr => {
            defendantCounts.push(objArr.filter(obj => obj.defendant_id === parseInt(id)-1))
         })
      )

      let countContainer = document.getElementById('display-counts')
      countContainer.innerHTML = ''

      if (e.innerText.slice(1) === defendantCounts[0][0].name) {
         countContainer.innerHTML = ''
         let counter = 0
         defendantCounts[0].forEach(el => {
            counter += 1
            let newLi = document.createElement('li')
            newLi.innerHTML = `<b>Count ${counter}:</b> ${el.name} (${el.sentence_len})`
            countContainer.appendChild(newLi)
         })
      }
   }
   
}
