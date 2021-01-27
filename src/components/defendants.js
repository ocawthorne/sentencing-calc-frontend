class Defendants {
   constructor() {
      this.defendants = []
      this.adapter = new DefendantsAdapter()
      // this.bindEventListeners()
      this.fetchAndLoadDefendants()
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
