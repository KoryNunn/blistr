function watchElement(parent, settings){

    settings.margin = settings.margin || 500;
    settings.interval = settings.interval || 200;

    function checkInView(element){
        if(!element){
            return;
        }
        var position = element.getBoundingClientRect();

        if(position.bottom > -settings.margin && position.top < window.innerHeight + settings.margin && position.right > -settings.margin && position.left < window.innerWidth + settings.margin){
            return element;
        }
    }

    var lastAnchor,
        tracked = new WeakSet(),
        inView = new Set(),
        toEnter = new Set(),
        toExit = new Set(),
        lastInView = new Set();


    function update(){
        if(!parent.children.length){
            return;
        }

        // Add all children to the toExit set initially.
        Array.prototype.forEach.call(parent.children, function(item){
            if(!tracked.has(item)){
                tracked.add(item);
                toExit.add(item);
            }
        });

        var length = parent.children.length,
            firstInView;

        var anchorIndex = Math.max(Array.prototype.indexOf.call(parent.children, lastAnchor), 0),
            left = anchorIndex,
            right = length - anchorIndex,
            max = Math.max(left, right),
            newAnchor;

        for (var i = 0; !newAnchor && i < max; i++) {
            newAnchor =
                checkInView(parent.children[anchorIndex - i]) ||
                checkInView(parent.children[anchorIndex + i + 1]);
        }

        if(!newAnchor){
            return;
        }

        var newInView = new Set();

        function addItem(item){
            newInView.add(item);

            if(!inView.has(item)){
                inView.add(item);
                toEnter.add(item);
            }

            toExit.delete(item);
        }

        addItem(newAnchor);

        var item = newAnchor;
        while(item = checkInView(item.previousSibling)){
            addItem(item);
        }

        var item = newAnchor;
        while(item = checkInView(item.nextSibling)){
            addItem(item);
        }

        lastInView.forEach(function(item){
            if(!newInView.has(item)){
                inView.delete(item);
                toEnter.delete(item);
                toExit.add(item);
            }
        });

        lastInView = new Set(newInView);

        function updateEnters(){
            var now = Date.now();
            while(Date.now() - now < 8 && (toExit.size || toEnter.size)){
                if(toExit.size){
                    var previouslyInView = toExit.values().next().value;

                    settings.exit(previouslyInView);
                    toExit.delete(previouslyInView);
                }

                if(toEnter.size){
                    var newlyInView = toEnter.values().next().value;

                    settings.enter(newlyInView);
                    toEnter.delete(newlyInView);
                }
            }

            if(toExit.size || toEnter.size){
                requestAnimationFrame(updateEnters);
            }
        }

        requestAnimationFrame(updateEnters);

        lastAnchor = newAnchor;
    }

    setInterval(update, settings.interval);

};

module.exports = watchElement;