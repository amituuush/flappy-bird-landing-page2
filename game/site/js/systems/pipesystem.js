var pipe = require('../entities/pipe');

var PipeSystem = function(entities) {
    this.entities = entities;
};

PipeSystem.prototype.run = function() {
    this.pipeFunction = window.setInterval(function newPipes() {
    this.entities.push(new pipe.Pipe(1, (Math.random() * 0.5) + 0.35), new pipe.Pipe(1.7, (Math.random() * -0.5) - 0));

    for (var i = 5; i < this.entities.length; i++) {
        if (this.entities[i].components.physics.position.x < -1) {
        this.entities.splice(i, 1);
        }
    }
    }.bind(this), 2000);
};

PipeSystem.prototype.stop = function() {
    if (this.pipeFunction !== null) {
        window.clearInterval(this.pipeFunction);
        this.pipeFunction = null;
    }

    for (var i = 5, c = this.entities.length; i < c; i++) {
    this.entities[i].components.physics.velocity.x = 0;
    }
    // this.entities[0].components.physics.velocity.y = 0; // not stopping bird from flying after collision
};


exports.PipeSystem = PipeSystem;
