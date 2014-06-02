var barleyBreak = {
    ITEMS_COUNT: 15,
    items: [],
    $reloadBtn: null,
    $container: null,
    emptyCellPosition: this.ITEMS_COUNT,
    init: function() {
        var self = this;
        this.fillItems();
        this.renderItems();
        
        //Reload
        this.$reloadBtn = document.getElementById('btn-reload');
        this.$reloadBtn.addEventListener('click', function (e) {
            e.preventDefault;
            self.renderItems();
        }, false);
        
        //Handle click on item
        this.$container.addEventListener('click', function (e) {
            var target = e.target;
            if (target.tagName.toLowerCase() === 'li') {
                
            }
        }, false);
    },
    fillItems: function() {
        for (var i = 0; i < this.ITEMS_COUNT; i++) {
            this.items.push(i + 1);
        }
        this.items.push(null);
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
        
        this.items = this.randomizeItems(this.items);
        console.log();
        this.$container = document.getElementById('barley-break');
        
        for (var i = 0; i < this.items.length; i++) {
            var $itemContainer = document.createElement('li');
            $itemContainer.setAttribute('id', this.items[i]);
            $itemContainer.innerHTML = this.items[i];
            $fragment.appendChild($itemContainer);
        }
        
        this.$container.innerHTML = '';
        this.$container.appendChild($fragment);
    }
};

