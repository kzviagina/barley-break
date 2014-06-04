var barleyBreak = {
    ITEMS_COUNT: 15,
    items: [],
    initialItems: [],
    $reloadBtn: null,
    $container: null,
    emptyCellPosition: null,
    init: function() {
        var self = this;
        this.fillItems();
        this.items = this.randomizeItems(this.items);
        this.renderItems();
        
        //Reload
        this.$reloadBtn = document.getElementById('btn-reload');
        this.$reloadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            self.fillItems();
            self.randomizeItems(self.items);
            self.renderItems();
        }, false);
        
        //Handle click on item
        this.$container.addEventListener('click', function (e) {
            var target = e.target;
            if (target.tagName.toLowerCase() === 'li') {
                self.moveItems(target);
            }
        }, false);
    },
    fillItems: function() {
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
        
        this.$container = document.getElementById('barley-break');
        
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
        var itemId = parseInt(item.getAttribute('id'));
        itemIndex = this.items.indexOf(itemId);
        return itemIndex;
    },
    moveItems: function (item) {
        var itemIndex = this.getItem(item);
        //if item index can be moved
        console.log('emptyCellPosition ' + this.emptyCellPosition + ' itemIndex ' + itemIndex);
        if (itemIndex === (this.emptyCellPosition - 1) || itemIndex === (this.emptyCellPosition + 1) || itemIndex === (this.emptyCellPosition - 4) || itemIndex === (this.emptyCellPosition + 4)) {
            var tempItemValue = this.items[itemIndex];
            this.items[itemIndex] = this.items[this.emptyCellPosition];
            this.items[this.emptyCellPosition] = tempItemValue;
            this.emptyCellPosition = itemIndex;
            this.renderItems();
            this.finishGame();
            
        } else {
            alert('This item cant be moved!');
        }
    },
    finishGame: function () {
        if (this.items.toString() === this.initialItems.toString()) {
            alert('Congratulations! You successfully passed this game!');
            this.randomizeItems(self.items);
            this.renderItems();
        }
    }
};

