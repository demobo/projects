define(function(require, exports, module) {
    var Wall = require("famous/physics/constraints/Wall");

    function Walls(size, restitution, onContact){

        // size is based on the window size
        // plus number for bigger
        // minus for smaller

        function setWall(normal, distance){
            return new Wall({
                normal: normal,
                distance: distance,
                restitution: restitution,
                drift:0,
                onContact: onContact
            })
        }
        this.wallBottom = setWall([0,-1,0], window.innerHeight + size);
        this.wallBottom = new Wall({
            normal: [0,-1,0],
            distance: window.innerHeight + size,
            restitution: 1,
            drift:0,
            onContact: Wall.ON_CONTACT.SILENT
        });
        this.wallTop = setWall([0,1,0], 0 + size);
        this.wallLeft = setWall([-1,0,0], window.innerWidth + size);
        this.wallRight = setWall([1,0,0], 0 + size);

        this.walls = [this.wallBottom,this.wallTop,this.wallLeft,this.wallRight];

    }

    module.exports = Walls;

});