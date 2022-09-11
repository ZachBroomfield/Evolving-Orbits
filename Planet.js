class Planet {
  constructor(DNA, sun) {
    this.DNA = DNA;

    // every gene is a random value between 0 and 1000 and needs to first be
    // mapped to a usable value for each variable the gene is encoding

    // this.pos based on gene 0 and 1
    const xPos = map(this.DNA.getGene(0), 0, 1000, 0, width);
    const yPos = map(this.DNA.getGene(1), 0, 1000, 0, height);
    this.pos = createVector(xPos, yPos);

    // this.vel based on gene 2 and 3
    const xVel = map(this.DNA.getGene(2), 0, 1000, -50, 50);
    const yVel = map(this.DNA.getGene(3), 0, 1000, -50, 50);
    this.vel = createVector(xVel, yVel);

    this.acc = createVector(0, 0);

    // this.mass based on gene 4
    this.mass = Math.floor(map(this.DNA.getGene(4), 0, 1000, 1, 1000));

    // this.colour based on genes 5, 6 and 7
    let r = Math.floor(map(this.DNA.getGene(5), 0, 1000, 50, 255));
    let g = Math.floor(map(this.DNA.getGene(6), 0, 1000, 50, 255));
    let b = Math.floor(map(this.DNA.getGene(7), 0, 1000, 50, 255));

    // if all colours are very low, ensure a base minimum of green for visability
    if (Math.min(r, g, b) < 100) {
      g = 100;
    }

    this.colour = color(r, g, b, 170);

    // calculate radius based on planets mass
    this.radius = Planet.#calcRadius(this.mass);

    // create history array with first value of distance squared from sun
    this.history = [Math.floor(this.#calcDistSqr(sun))];

    // initilise fitness and age at 0
    this.fitness = 0;
    this.age = 0;
  }

  update(sun) {
    this.age++;

    // add acceleration to velocity and velocity to position
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // each update, add current distance squared from sun to history
    this.history.push(Math.floor(this.#calcDistSqr(sun)));

    // limit history to 1000 frames
    if (this.history.length > 1000) {
      this.history.shift();
    }

    // each frame calculate current fitness
    this.fitness = this.calcFitness();

    // reset acceleration for next frame
    this.acc = createVector(0, 0);
  }

  calcGravForce(sun) {
    const G = 0.1;

    // calculate vector pointing from sun position to this position
    let vec = p5.Vector.sub(sun.pos, this.pos);

    // get the distance squared between sun and this
    // get distance squared rather than distance as square 
    // root is a computationally expensive calculation
    let distSqr = vec.x ** 2 + vec.y ** 2;
    
    // set mag to the force due to gravity
    vec.setMag((G * this.mass * sun.mass) / (distSqr));
    return vec;
  }

  applyForce(force) {
    // add force divided by mass to acceleration 
    this.acc.add(force.div(this.mass));
  }

  leftCanvas() {
    // return true if planet has left canvas
    return this.pos.x > width + this.radius ||
      this.pos.x < this.radius ||
      this.pos.y > height + this.radius ||
      this.pos.y < this.radius
  }

  collidingWith(sun) {
    // get distance squared rather than distance as square 
    // root is a computationally expensive calculation
    let distSqr = this.#calcDistSqr(sun);

    // return true if distance squared is less than or
    // equal to (sun radius + this radius) ^ 2
    return distSqr <= (sun.radius + this.radius) ** 2;
  }

  draw() {
    fill(this.colour);
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2)
  }

  #calcDistSqr(sun) {
    let vec = p5.Vector.sub(sun.pos, this.pos);
    return vec.x ** 2 + vec.y ** 2;
  }

  calcFitness() {
    /*
    Fitness is calculated to give greater fitness to older, more circular orbits.
    This is achieved by taking the min and max distance squared in this.history array,
    and returning min divided by max which will be closer to 1 the less difference
    between min and max. Additionally, if the age is less than 1000, this fitness value
    is scaled down.
    */

    // find max and min distance squared in history array
    const max = Math.max(...this.history);
    const min = Math.min(...this.history);

    // divide by 1 unless age is less than 1000
    let denominator = 1;
    if (this.age < 1000) {
      // if age is less than 1000, new denominator is 1000 minus age
      denominator = 1000 - this.age;
    }
    return (min / max) / denominator;
  }

  static #calcRadius(mass) {
    // map mass to radius values
    return map(mass, 1, 1000, 2, 15);
  }
}