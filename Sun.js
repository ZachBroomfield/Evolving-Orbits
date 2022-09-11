class Sun {
  constructor({position, velocity, mass, radius}) {
    // sun holds position, mass and radius
    // doesn't need to update these values as sun doesn't move
    this.pos = position;
    this.vel = velocity;
    this.mass = mass;
    this.radius = radius;

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

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // reset acceleration for next frame
    this.acc = createVector(0, 0);
  }

  draw() {
    fill('yellow');
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2)
  }
}