class DNA {
  constructor(genes) {
    // this.genes is handed an array of genes
    // each gene is a value between 0 to 1000
    this.genes = genes;
  }

  static crossOver(first, second) {
    // calculate how many genes
    const numGenes = first.getGenes().length

    // pick random number between 0 and numGenes + 1
    const crossOver = Math.floor(random(numGenes + 1))

    // take genes from start to crossOver from first parent then
    // concatinate with genes from crossover to end of second parent
    // return new DNA object using the crossed over genes
    return new DNA(first.genes.slice(0, crossOver).concat(second.genes.slice(crossOver)));
  }

  mutate(mutationChance, mutationRate) {
    // iterate through all genes
    for (let i = 0; i < this.genes.length; i++) {
      // only mutate gene if random number is less than mutationChance
      if (random(1) < mutationChance) {
        // mutate the gene using linear interpolation between it's current value
        // and a random value between 0 and 1000, weighted based upon mutationRate
        this.genes[i] = lerp(this.genes[i], random(1000), mutationRate);
      }
    }
  }

  getGene(index) {
    return this.genes[index];
  }

  getGenes() {
    return this.genes;
  }
}