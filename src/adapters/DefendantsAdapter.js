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
      
   }

   getDefendants() {
      return fetch(this.baseUrl).then(res => res.json())
   }

   getDefendant(e) {
      
   }
}
