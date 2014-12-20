define(function(require, exports, module){

    function slotItemMap(){
        var slotItemMap = [
            {item: 0, weight: 100, value: 1, fruit: 'kiwi'},
            {item: 1, weight: 100, value: 1, fruit: 'strawberry'},
            {item: 2, weight: 100, value: 1, fruit: 'pineapple'},
            {item: 3, weight: 50, value: 2, fruit: 'lime'},
            {item: 4, weight: 50, value: 2, fruit: 'avocado'},
            {item: 5, weight: 25, value: 4, fruit: 'orange'},
            {item: 6, weight: 20, value: 4, fruit: 'blueberry'},
            {item: 7, weight: 15, value: 8, fruit: 'pomegranate'},
            {item: 8, weight: 10, value: 10, fruit: 'mango'},
            {item: 9, weight: 5, value: 15, fruit: 'cantaloupe'},
            {item: 10, weight: 3, value: 25, fruit: 'cherries'},
            {item: 11, weight: 1, value: 100, fruit: 'fruit punch'}
        ]
        return slotItemMap;
    }

    module.exports = slotItemMap;

});