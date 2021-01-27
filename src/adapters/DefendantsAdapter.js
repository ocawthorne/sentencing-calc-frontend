class DefendantsAdapter {
   constructor() {
      this.baseUrl = 'http://localhost:3000/api/v1/defendants'
   }

   getDefendants() {
      return fetch(this.baseUrl).then(res => res.json())
   }
}
