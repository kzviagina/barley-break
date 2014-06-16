var barleyBreak = {
    ITEMS_COUNT: 15,
    items: [],
    initialItems: [],
    $reloadBtn: null,
    $startBtn: null,
    $container: null,
    $landingPage: null,
    $gamePage: null,
    $stepContainer: null,
    $statisticsContainer: null,
    emptyCellPosition: null,
    stepCounter: 0,
    tryNumber: 0,
    timer: {
        startDate: null,
        currentDate: null,
        time: null,
        difference: null,
        interval: null,
        $timerContainer: null,
        initTimer: function() { 
            var self = this,
                difference,
                startTime,
                currentTime;   
            self.startDate = new Date();
            startTime = self.startDate.getTime();
            self.startDate = self.startDate.getHours() + ':' + self.startDate.getMinutes() + ':' + self.startDate.getSeconds();
            
            self.$timerContainer = document.getElementById('timer');
            
            self.interval = setInterval(function () {
                self.currentDate = new Date();
                currentTime = self.currentDate.getTime();
                self.currentDate = self.currentDate.getHours() + ':' + self.currentDate.getMinutes() + ':' + self.currentDate.getSeconds();
                difference = Math.floor((currentTime - startTime) / 1000);
                var hours = Math.floor(difference / 3600);
                var minutes = Math.floor((difference - (hours * 3600)) / 60);
                var seconds = difference - (hours * 3600) - (minutes * 60);
                if (hours < 10) { hours = '0' + hours; }
                if (minutes < 10) { minutes = '0' + minutes; }
                if (seconds < 10) { seconds = '0' + seconds; }
                self.time = hours + ':' + minutes + ':' + seconds;
                self.$timerContainer.innerHTML = self.time;
            }, 1000);
        },
        stopTimer: function() {
            clearInterval(this.interval);
        }
    },
    statistics: {
        items: [],
        addItem: function (tryNumber, duration, steps, startTime, endTime) {
            var self = this,
                statItem = new this.StatisticItem(tryNumber, duration, steps, startTime, endTime);
            
            self.items.push(statItem);
        },
        StatisticItem: function(tryNumber, duration, steps, startTime, endTime) {
            this.tryNumber = tryNumber;
            this.duration = duration;
            this.steps = steps;
            this.startTime = startTime;
            this.endTime = endTime;
        }
    },
    init: function() {
        var self = this;
        
        this.$landingPage = document.getElementById('landing-page');
        this.$gamePage = document.getElementById('game-container');
        this.$container = document.getElementById('barley-break');
        this.$statisticsContainer = document.getElementById('statistics');
        
        //Start
        this.$startBtn = document.getElementById('btn-start');
        this.$startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            self.startGame();
        }, false);
        
        //Reload
        this.$reloadBtn = document.getElementById('btn-reload');
        this.$reloadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            self.fillItems();
            self.randomizeItems(self.items);
            self.renderItems();
            self.timer.stopTimer();
            self.timer.initTimer();
            self.stepCounter = 0;
            self.renderStep();
        }, false);
        
        //Handle click on item
        this.$container.addEventListener('click', function (e) {
            var target = e.target;
            if (target.tagName.toLowerCase() === 'li') {
                self.moveItems(target);
            }
        }, false);
    },
    startGame: function() {
        this.tryNumber++;
        this.fillItems();
        this.items = this.randomizeItems(this.items);
        this.renderItems();

        this.$landingPage.style.display = 'none';
        this.$gamePage.style.display = 'block';
        this.timer.initTimer();
    },
    fillItems: function() {
        this.stepCounter = 0;
        this.items = [];
        for (var i = 0; i < this.ITEMS_COUNT; i++) {
            this.items.push(i + 1);
        }
        this.items.push(null);
        this.emptyCellPosition = this.ITEMS_COUNT;
        this.initialItems = this.items.slice(0);
    },
    randomizeItems: function(items) {
        for (var j, x, i = items.length - 1; i;) {
            j = Math.floor(Math.random() * i);
            x = items[--i];
            items[i] = items[j];
            items[j] = x;
        }
        return items;
    },
    renderItems: function() {
        var $fragment = document.createDocumentFragment();
        
        for (var i = 0; i < this.items.length; i++) {
            var $itemContainer = document.createElement('li');
            $itemContainer.setAttribute('id', this.items[i]);
            $itemContainer.innerHTML = this.items[i];
            $fragment.appendChild($itemContainer);
        }
        
        this.$container.innerHTML = '';
        this.$container.appendChild($fragment);
    },
    getItem: function (item) {
        //get item in array
        var itemId;
        if (item.getAttribute('id') !== 'null') {
            itemId = parseInt(item.getAttribute('id'));
        } else {
            itemId = null;
        }
        itemIndex = this.items.indexOf(itemId);
        return itemIndex;
    },
    moveItems: function (item) {
        var itemIndex = this.getItem(item);
        //if item index can be moved
        if (itemIndex === (this.emptyCellPosition - 1) || itemIndex === (this.emptyCellPosition + 1) || itemIndex === (this.emptyCellPosition - 4) || itemIndex === (this.emptyCellPosition + 4)) {
            var tempItemValue = this.items[itemIndex];
            this.items[itemIndex] = this.items[this.emptyCellPosition];
            this.items[this.emptyCellPosition] = tempItemValue;
            this.emptyCellPosition = itemIndex;
            this.renderItems();
            this.stepCounter++;
            this.renderStep();
            this.finishGame();
            
        } else {
            alert('This item cant be moved!');
        }
    },
    finishGame: function () {
        if (this.items.toString() === this.initialItems.toString()) {
            this.timer.stopTimer();
            this.statistics.addItem(this.tryNumber, this.timer.time, this.stepCounter, this.timer.startDate, this.timer.currentDate);
            this.updateLandingPage();
            this.$landingPage.style.display = 'block';
            this.$gamePage.style.display = 'none';
        }
    },
    updateLandingPage: function () {
        var $fragment = document.createDocumentFragment();
        var stat = this.statistics.items;
        var $heading = document.createElement('h1');
        $heading.innerHTML = 'Congratulations! You passed this game!';
        $fragment.appendChild($heading);
        for (var i = 0; i < stat.length; i++) {
            var $itemContainer = document.createElement('p');
            $itemContainer.innerHTML = 'Number of try: ' + stat[i].tryNumber + 
                    ', duration: ' + stat[i].duration + 
                    ', you made ' + stat[i].steps + 
                    ' steps. Start time: ' + stat[i].startTime + 
                    '. End time: ' + stat[i].endTime;
            $fragment.appendChild($itemContainer);
        }
        
        this.$statisticsContainer.innerHTML = '';
        this.$statisticsContainer.appendChild($fragment);
    },
    renderStep: function () {
        this.$stepContainer = document.getElementById('step-counter');
        this.$stepContainer.innerHTML = 'Current step: ' + this.stepCounter;
    }
};

