(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CircleCollisionComponent = function(entity, radius) {
    this.entity = entity;
    this.radius = radius;
    this.type = 'circle';
};


CircleCollisionComponent.prototype.collidesWith = function(entity) {
    if (entity.components.collision.type == 'circle') {
        return this.collideCircle(entity);
    }
    else if (entity.components.collision.type == 'rect') {
        return this.collideRect(entity);
    }
    return false;
};

CircleCollisionComponent.prototype.collideCircle = function(entity) {
    var positionA = this.entity.components.physics.position;
    var positionB = entity.components.physics.position;

    var radiusA = this.radius;
    var radiusB = entity.components.collision.radius;

    var diff = {x: positionA.x - positionB.x,
                y: positionA.y - positionB.y};

    var distanceSquared = diff.x * diff.x + diff.y * diff.y;
    var radiusSum = radiusA + radiusB;

    return distanceSquared < radiusSum * radiusSum;
};

CircleCollisionComponent.prototype.collideRect = function(entity) {
    var clamp = function(value, low, high) {
        if (value < low) {
            return low;
        }
        if (value > high) {
            return high;
        }
        return value;
    };

    var positionA = this.entity.components.physics.position;
    var positionB = entity.components.physics.position;
    var sizeB = entity.components.collision.size;

    var closest = {
        x: clamp(positionA.x, positionB.x,
                 positionB.x + sizeB.x),
        y: clamp(positionA.y, positionB.y,
                 positionB.y + sizeB.y)
    };


    var radiusA = this.radius;

    var diff = {x: positionA.x - closest.x,
                y: positionA.y - closest.y};

    var distanceSquared = diff.x * diff.x + diff.y * diff.y; // calculates a^2 + b^2. distanceSquared now represents c^2, which is the distance between the center of the circle and the closest point of the pipe to the circle.
    return distanceSquared < radiusA * radiusA;
    //we compare c^2, the distance between the center of the circle and the closest point of the pipe, to the radius^2. If the radius^2 is greater than c^2, then the center of the circle is closer to the closest point of the pipe than the distance of the radius. This means there is a collision between circle and pipe.
};

exports.CircleCollisionComponent = CircleCollisionComponent;

},{}],2:[function(require,module,exports){
var CounterCollisionComponent = function(entity, size) {
    this.entity = entity;
    this.size = size;
    this.type = 'counter';
};

CounterCollisionComponent.prototype.collidesWith = function(entity) {
    // if (entity.components.collision.type == 'circle') {
    //     return this.collideCircle(entity);
    // }
    // else
    if (entity.components.collision.type == 'rect') {
        return this.collideCounter(entity);
    }
    return false;
};

CounterCollisionComponent.prototype.collideCircle = function(entity) {
    return entity.components.collision.collideCounter(this.entity);
};

CounterCollisionComponent.prototype.collideCounter = function(entity) {
    var positionA = this.entity.components.physics.position;
    var positionB = entity.components.physics.position;

    var sizeA = this.size;
    var sizeB = entity.components.collision.size;

    var leftA = positionA.x - sizeA.x / 2;
    var rightA = positionA.x + sizeA.x / 2;
    var bottomA = positionA.y - sizeA.y / 2;
    var topA = positionA.y + sizeA.y / 2;

    var leftB = positionB.x - sizeB.x / 2;
    var rightB = positionB.x + sizeB.x / 2;
    var bottomB = positionB.y - sizeB.y / 2;
    var topB = positionB.y + sizeB.y / 2;

    return !(leftA > rightB || leftB > rightA ||
             bottomA > topB || bottomB > topA);
};

exports.CounterCollisionComponent = CounterCollisionComponent;

},{}],3:[function(require,module,exports){
var RectCollisionComponent = function(entity, size) {
    this.entity = entity;
    this.size = size;
    this.type = 'rect';
};

RectCollisionComponent.prototype.collidesWith = function(entity) {
    if (entity.components.collision.type == 'circle') {
        return this.collideCircle(entity);
    }
    else if (entity.components.collision.type == 'counter') {
        return false;
    }
    return false;
};

RectCollisionComponent.prototype.collideCircle = function(entity) {
    return entity.components.collision.collideRect(this.entity);
};

// RectCollisionComponent.prototype.collideRect = function(entity) {
//     var positionA = this.entity.components.physics.position;
//     var positionB = entity.components.physics.position;
//
//     var sizeA = this.size;
//     var sizeB = entity.components.collision.size;
//
//     var leftA = positionA.x - sizeA.x / 2;
//     var rightA = positionA.x + sizeA.x / 2;
//     var bottomA = positionA.y - sizeA.y / 2;
//     var topA = positionA.y + sizeA.y / 2;
//
//     var leftB = positionB.x - sizeB.x / 2;
//     var rightB = positionB.x + sizeB.x / 2;
//     var bottomB = positionB.y - sizeB.y / 2;
//     var topB = positionB.y + sizeB.y / 2;
//
//     return !(leftA > rightB || leftB > rightA ||
//              bottomA > topB || bottomB > topA);
// };

exports.RectCollisionComponent = RectCollisionComponent;

},{}],4:[function(require,module,exports){
var BirdGraphicsComponent = function(entity) {
    this.entity = entity;
};


BirdGraphicsComponent.prototype.draw = function(context) {
    var position = this.entity.components.physics.position;
    
    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.arc(0, 0, 0.02, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    context.restore();
};

exports.BirdGraphicsComponent = BirdGraphicsComponent;

},{}],5:[function(require,module,exports){
var CeilingGraphicsComponent = function(entity) {
    this.entity = entity;
    this.size = {x: 0.5, y: 0.05};
};

CeilingGraphicsComponent.prototype.draw = function(context) {
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.fillStyle = "blue";
    context.fillRect(0, 0, this.size.x, this.size.y);
    context.closePath();
    context.restore();

};

exports.CeilingGraphicsComponent = CeilingGraphicsComponent;

},{}],6:[function(require,module,exports){
var CounterGraphicsComponent = function(entity) {
    this.entity = entity;
    this.size = {x: 0.01, y: 1};
};

CounterGraphicsComponent.prototype.draw = function(context) {
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.fillStyle = "transparent";
    context.fillRect(0, 0, this.size.x, this.size.y);
    context.closePath();
    context.restore();
};

exports.CounterGraphicsComponent = CounterGraphicsComponent;

},{}],7:[function(require,module,exports){
var FloorGraphicsComponent = function(entity) {
    this.entity = entity;
    this.size = {x: 0.5, y: 0.05};
};

FloorGraphicsComponent.prototype.draw = function(context) {
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.fillStyle = "blue";
    context.fillRect(0, 0, this.size.x, this.size.y);
    context.closePath();
    context.restore();

};

exports.FloorGraphicsComponent = FloorGraphicsComponent;

},{}],8:[function(require,module,exports){
var LeftWallGraphicsComponent = function(entity) {
    this.entity = entity;
    this.size = {x: 0.1, y: 1};
};

LeftWallGraphicsComponent.prototype.draw = function(context) {
    var position = this.entity.components.physics.position;

    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.fillStyle = "white";
    context.fillRect(0, 0, this.size.x, this.size.y);
    context.closePath();
    context.restore();
};

exports.LeftWallGraphicsComponent = LeftWallGraphicsComponent;

},{}],9:[function(require,module,exports){
var PipeGraphicsComponent = function(entity) {
    this.entity = entity;
    this.size = {x: 0.1, y: 0.65};
};

PipeGraphicsComponent.prototype.draw = function(context) {
    var position = this.entity.components.physics.position;
    
    context.save();
    context.translate(position.x, position.y);
    context.beginPath();
    context.fillStyle = "green";
    context.fillRect(0, 0, this.size.x, this.size.y);
    context.closePath();
    context.restore();


};

exports.PipeGraphicsComponent = PipeGraphicsComponent;


},{}],10:[function(require,module,exports){
var PhysicsComponent = function(entity) {
    this.entity = entity;

    this.position = {
        x: 0,
        y: 0
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.acceleration = {
        x: 0,
        y: 0
    };
};

PhysicsComponent.prototype.update = function(delta) {
    this.velocity.x += this.acceleration.x * delta;
    this.velocity.y += this.acceleration.y * delta;

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
};

exports.PhysicsComponent = PhysicsComponent;
},{}],11:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/bird");
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/circle");
var flappyBird = require("../flappy_bird");
// var settings = require("../settings");

var Bird = function() {
    var physics = new physicsComponent.PhysicsComponent(this);
    physics.position.y = 0.5;
    physics.acceleration.y = -2;

    var graphics = new graphicsComponent.BirdGraphicsComponent(this);
    var collision = new collisionComponent.CircleCollisionComponent(this, 0.02);
    collision.onCollision = this.onCollision.bind(this); // ??

    this.components = {
        physics: physics,
        graphics: graphics,
        collision: collision
    };
};

Bird.prototype.onCollision = function(entity) {
    this.components.physics.acceleration.y = 0;
    this.components.physics.velocity.y = 0;
};

exports.Bird = Bird;

},{"../components/collision/circle":1,"../components/graphics/bird":4,"../components/physics/physics":10,"../flappy_bird":17}],12:[function(require,module,exports){
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
var graphicsComponent = require("../components/graphics/ceiling");
var flappyBird = require("../flappy_bird");

var Ceiling = function() {
    var physics = new physicsComponent.PhysicsComponent(this);
    physics.position.x = -0.25;
    physics.position.y = 1;

    var graphics = new graphicsComponent.CeilingGraphicsComponent(this);

    var collision = new collisionComponent.RectCollisionComponent(this, graphics.size);
    collision.onCollision = this.onCollision.bind(this);



    this.components = {
        physics: physics,
        collision: collision,
        graphics: graphics
    };
};

Ceiling.prototype.onCollision = function() {
    window.app.stop();

    document.getElementById('game-over').innerHTML = "Ouch! Watch your head! Try again.";
    document.getElementById('pipes-cleared').innerHTML = window.app.scores.realScore;
    
};

exports.Ceiling = Ceiling;

},{"../components/collision/rect":3,"../components/graphics/ceiling":5,"../components/physics/physics":10,"../flappy_bird":17}],13:[function(require,module,exports){
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/counter");
var graphicsComponent = require("../components/graphics/counter");
var flappyBird = require("../flappy_bird");

var Counter = function() {
    var physics = new physicsComponent.PhysicsComponent(this);
    physics.position.x = -0.125;
    physics.position.y = 0;

    var graphics = new graphicsComponent.CounterGraphicsComponent(this);

    var collision = new collisionComponent.CounterCollisionComponent(this, graphics.size);
    collision.onCollision = function() {
        window.app.updateScore();
    };

    this.components = {
        physics: physics,
        collision: collision,
        graphics: graphics,
    };
};

// Counter.prototype.onCollision = function() {
//     this.components.counter.count();
// };

exports.Counter = Counter;

},{"../components/collision/counter":2,"../components/graphics/counter":6,"../components/physics/physics":10,"../flappy_bird":17}],14:[function(require,module,exports){
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
var graphicsComponent = require("../components/graphics/floor");
var flappyBird = require("../flappy_bird");

var Floor = function() {
    var physics = new physicsComponent.PhysicsComponent(this);
    physics.position.x = -0.25;
    physics.position.y = -0.05;

    var graphics = new graphicsComponent.FloorGraphicsComponent(this);

    var collision = new collisionComponent.RectCollisionComponent(this, graphics.size);
    collision.onCollision = this.onCollision.bind(this);



    this.components = {
        physics: physics,
        collision: collision,
        graphics: graphics
    };
};

Floor.prototype.onCollision = function() {
    window.app.stop();

    document.getElementById('game-over').innerHTML = "Crash landing. Try again!";
    document.getElementById('pipes-cleared').innerHTML = window.app.scores.realScore;
    
};

exports.Floor = Floor;

},{"../components/collision/rect":3,"../components/graphics/floor":7,"../components/physics/physics":10,"../flappy_bird":17}],15:[function(require,module,exports){
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
var graphicsComponent = require("../components/graphics/left-wall");
var flappyBird = require("../flappy_bird");

var LeftWall = function() {
    var physics = new physicsComponent.PhysicsComponent(this);
    physics.position.x = -0.7;
    physics.position.y = 0;

    var graphics = new graphicsComponent.LeftWallGraphicsComponent(this);

    var collision = new collisionComponent.RectCollisionComponent(this, graphics.size);
    collision.onCollision = this.onCollision.bind(this);

    this.components = {
        physics: physics,
        collision: collision,
        graphics: graphics
    };
};

LeftWall.prototype.onCollision = function() {
    window.app.deletePipes();

};

exports.LeftWall = LeftWall;

},{"../components/collision/rect":3,"../components/graphics/left-wall":8,"../components/physics/physics":10,"../flappy_bird":17}],16:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/pipe");
var physicsComponent = require("../components/physics/physics");
var collisionComponent = require("../components/collision/rect");
var pipeSystem = require("../systems/pipesystem");
var flappyBird = require("../flappy_bird");

var Pipe = function(positionX, positionY) {
	var physics = new physicsComponent.PhysicsComponent(this);
	physics.position.x = positionX;
    physics.position.y = positionY;
    physics.velocity.x = -0.75;

    var graphics = new graphicsComponent.PipeGraphicsComponent(this);

    var collision = new collisionComponent.RectCollisionComponent(this, graphics.size);

    collision.onCollision = this.onCollision.bind(this);

    this.components = {
    	physics: physics,
        graphics: graphics,
        collision: collision
    };
};

Pipe.prototype.onCollision = function(entity) {
	if (entity.components.collision.type === "circle") {
		window.app.stop();
		window.app.inputOff();
		document.getElementById('game-over').innerHTML = "Pipes don't like birds. Remember that. Try again!";
		document.getElementById('pipes-cleared').innerHTML = window.app.scores.realScore;

		$('#game-over-modal').css('display', 'block');
	}
	else if (entity.components.collision.type === "counter") {

	}

};

exports.Pipe = Pipe;

},{"../components/collision/rect":3,"../components/graphics/pipe":9,"../components/physics/physics":10,"../flappy_bird":17,"../systems/pipesystem":23}],17:[function(require,module,exports){
var graphicsSystem = require('./systems/graphics');
var physicsSystem = require('./systems/physics');
var inputSystem = require('./systems/input');
var pipeSystem = require('./systems/pipesystem');
var scoreSystem = require('./systems/scoresystem');
var bird = require('./entities/bird');
var pipe = require('./entities/pipe');
var ceiling = require('./entities/ceiling');
var floor = require('./entities/floor');
var leftWall = require('./entities/left-wall');
var counter = require('./entities/counter');

var FlappyBird = function() {
    this.entities = [new bird.Bird(), new ceiling.Ceiling(), new floor.Floor(), new leftWall.LeftWall(), new counter.Counter()];
    this.graphics = new graphicsSystem.GraphicsSystem(this.entities);
    this.physics = new physicsSystem.PhysicsSystem(this.entities);
    this.input = new inputSystem.InputSystem(this.entities);
    this.pipes = new pipeSystem.PipeSystem(this.entities);
    this.scores = new scoreSystem.ScoreSystem(this.entities, 0);
};


FlappyBird.prototype.run = function() {
    this.graphics.run();
    this.physics.run();
    this.input.run();
    this.pipes.run();
};

FlappyBird.prototype.stop = function() {
    this.pipes.stop();
};

FlappyBird.prototype.inputOff = function() {
    this.input.stop();
};

FlappyBird.prototype.updateScore = function() {
    this.scores.update();
};

exports.FlappyBird = FlappyBird;

},{"./entities/bird":11,"./entities/ceiling":12,"./entities/counter":13,"./entities/floor":14,"./entities/left-wall":15,"./entities/pipe":16,"./systems/graphics":20,"./systems/input":21,"./systems/physics":22,"./systems/pipesystem":23,"./systems/scoresystem":24}],18:[function(require,module,exports){
var flappyBird = require('./flappy_bird');

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-button').addEventListener('click', function() {
        app = new flappyBird.FlappyBird();
        app.run();
        document.getElementById('start-button').style.display = "none";
    });


    document.getElementById('new-game').addEventListener("click", function() {
        var newGame = new flappyBird.FlappyBird();
        newGame.run();
        $('#game-over-modal').css('background', 'red');

    });
    // Assigning the app to the global `window` object so we can
    // can access it within other modules more easily
});

},{"./flappy_bird":17}],19:[function(require,module,exports){
var CollisionSystem = function(entities) {
    this.entities = entities;
};

CollisionSystem.prototype.tick = function() {
    for (var i=0; i<this.entities.length; i++) {
        var entityA = this.entities[i];
        if (!entityA.components.collision) {
            continue;
        }

        for (var j=i+1; j<this.entities.length; j++) {
            var entityB = this.entities[j];
            if (!entityB.components.collision) {
                continue;
            }

            if (!entityA.components.collision.collidesWith(entityB)) {
                continue;
            }

            if (entityA.components.collision.onCollision) {
                entityA.components.collision.onCollision(entityB);
            }

            if (entityB.components.collision.onCollision) {
                entityB.components.collision.onCollision(entityA);
            } // this code seems like a waste of cpu since we only need to compare the first entity in the array to all the other entities. We don't need to compare pipes to pipes.
        }
    }
};

exports.CollisionSystem = CollisionSystem;
},{}],20:[function(require,module,exports){
var GraphicsSystem = function(entities) {
    this.entities = entities;
    // Canvas is where we draw
    this.canvas = document.getElementById('main-canvas');
    // Context is what we draw to
    this.context = this.canvas.getContext('2d');
};

GraphicsSystem.prototype.run = function() {
    // Run the render loop
    window.requestAnimationFrame(this.tick.bind(this));
};

GraphicsSystem.prototype.tick = function() {
    // Set the canvas to the correct size if the window is resized
    if (this.canvas.width != this.canvas.offsetWidth ||
        this.canvas.height != this.canvas.offsetHeight) {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height);
    this.context.scale(this.canvas.height, -this.canvas.height);

    for (var i=0; i<this.entities.length; i++) {
        var entity = this.entities[i];
        if (!entity.components.graphics) {
            continue;
        }

        entity.components.graphics.draw(this.context);
    }

    this.context.restore();

    window.requestAnimationFrame(this.tick.bind(this));
};

exports.GraphicsSystem = GraphicsSystem;

},{}],21:[function(require,module,exports){
var InputSystem = function(entities) {
    this.entities = entities;

    // Canvas is where we get input from
    this.canvas = document.getElementById('main-canvas');
};

InputSystem.prototype.run = function() {
    this.canvas.addEventListener('click', this.onClick.bind(this));
};

InputSystem.prototype.onClick = function() {
    var bird = this.entities[0];
    bird.components.physics.velocity.y = 0.7;
};

InputSystem.prototype.stop = function() {
    var bird = this.entities[0];
    bird.components.physics.velocity.y = 0;
 // create method on flappy bird constructor
};

exports.InputSystem = InputSystem;

},{}],22:[function(require,module,exports){
var collisionSystem = require("./collision");

var PhysicsSystem = function(entities) {
    this.entities = entities;
    this.collisionSystem = new collisionSystem.CollisionSystem(entities);

};

PhysicsSystem.prototype.run = function() {
    // Run the update loop
    window.setInterval(this.tick.bind(this), 1000 /60);
};

PhysicsSystem.prototype.tick = function() {
    for (var i=0; i<this.entities.length; i++) {
        var entity = this.entities[i];
        if (!entity.components.physics) {
            continue;
        }

        entity.components.physics.update(1/60);
        
    }


    this.collisionSystem.tick();
};

exports.PhysicsSystem = PhysicsSystem;
},{"./collision":19}],23:[function(require,module,exports){
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

},{"../entities/pipe":16}],24:[function(require,module,exports){
var counter = require('../entities/counter');

var ScoreSystem = function(entities, score) {
    this.entities = entities;
    this.score = score;
    this.realScore = 0;
};

ScoreSystem.prototype.update = function() {
    this.score++;
    this.realScore = Math.floor(this.score / 9);
    document.getElementById("counter").innerHTML = this.realScore;

};

exports.ScoreSystem = ScoreSystem;

},{"../entities/counter":13}]},{},[18,17,4,9,10,1,3,11,16,12,14,15,13,20,21,22,19,23,24]);
