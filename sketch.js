/*
  Simulation to create near-circular orbits using inherited genes.
  Planet population is kept at a steady value and any time a planet is 
  removed, a new planet is added using two planets as parents.
  The chance of a planet being picked as a parent is dependent upon
  it's fitness value, which favours older planets with circular orbits.

  Planets don't interact with other planets in any way, only the sun and
  canvas edges.
*/

let sun;
let planets;
let maxPlanets;
let mutationChance;
let mutationRate;

function setup() {
  // create canvas the width and height of the window being drawn to
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(0);
 
  planets = [];
  maxPlanets = 100;
  mutationChance = 0.2;
  mutationRate = 0.1;

  // create center "sun" object
  sun = new Sun({
    position: createVector(width / 2 , height / 2),
    velocity: createVector(0, 0),
    mass: 100000,
    radius: 30
  });

  // create first group of planets
  createInitialPlanets(planets, sun, maxPlanets);
}

function draw() {
  // each frame redraw background
  background(0);

  sun.update();

  // reverse iterate through planets array
  // forward iteration though array while deleting items (splice for example)
  // can produce undesired result or even cause crashes
  for (let i = planets.length - 1; i >= 0; i--) {
    // calculate the force of gravity from sun and apply to planet
    planets[i].applyForce(planets[i].calcGravForce(sun));
    
    // update planet
    planets[i].update(sun);
  
    // determine if planet should be removed
    if (planets[i].leftCanvas() ||
      planets[i].collidingWith(sun) ||
      planets[i].age > 2000) {
      // remove planet
      planets.splice(i, 1);
    } else {
      planets[i].draw();
    }    
  }

  let maxFitness = 0;

  // if any planets have been removed, create offspring until maxPlanets reached
  while(planets.length < maxPlanets) {

    // only calculate maxFitness if it hasn't already been calculated this frame
    if (maxFitness === 0) {
      planets.forEach(planet => {
        if (planet.fitness > maxFitness) {
          // update maxFitness if better fitness is found
          maxFitness = planet.fitness;
        }
      })
    }

    // create random value between 0 and maxFitness
    const fitnessToBeat = random(maxFitness);

    // filter planets that have higher fitness than fitnessToBeat
    let suitableParents = planets.filter(planet => {
      return planet.fitness > fitnessToBeat;
    })

    // select two random parents from suitableParents
    const parentOne = random(suitableParents);
    const parentTwo = random(suitableParents);

    // crossover both parents genes
    const newGenes = DNA.crossOver(parentOne.DNA, parentTwo.DNA);
    
    // potentially mutate some of the newGenes
    newGenes.mutate(mutationChance, mutationRate);

    // create new plaent with newGenes
    planets.push(new Planet(newGenes, sun));
  }

  sun.draw();

  // display brief description for first 500 frames
  if (frameCount < 500) {
    let description = 'Simulation to create near-circular orbits using inherited genes.'
    textSize(24);
    fill(255);
    textAlign(CENTER)
    text(description, width / 2, 100)
  }
}

function createInitialPlanets(planets, sun, maxPlanets) {
  let numGenes = 8;

  // create number of planets equal to maxPlanets
  for (let i = 0; i < maxPlanets; i++) {
    const genes = [];

    // each planet has numGenes number of genes
    // genes have a random value between 0 and 1000
    for (let i = 0; i < numGenes; i++) {
      genes.push(random(1000));
    }

    // create new plaent with genes
    planets.push(new Planet(new DNA(genes), sun));
  }
}