class Count {

   static all = []

   constructor() { //name, sentence_len) {
      // this.name = name
      // this.sentence_len = sentence_len
      // this.defendant_id = defendant_id
      this.adapter = new CountsAdapter()
   }

   createCount() {
      Array.from(document.getElementsByClassName('offence')).forEach(offence => {
         let countLength = getDaysFromYMD(offence.name)
         if (!!offence.value && countLength > 0) {
            let newCount = {
               name: offence.value,
               length: convertToMD(countLength, true)
            }
            Count.all.push(newCount)
            this.adapter.createCount(newCount)
         }
      })
   }
}
