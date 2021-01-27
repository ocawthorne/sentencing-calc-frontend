class Defendants {
   constructor() {
      this.defendants = []
      this.adapter = new DefendantsAdapter()
      this.bindEventListeners()
      this.fetchAndLoadDefendants()
   }

   fetchAndLoadDefendants() {
      this.adapter.getDefendants().then(defendants => {
         
      })
   }

   bindEventListeners() {

   }
}
