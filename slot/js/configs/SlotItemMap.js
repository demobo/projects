define(function(require, exports, module){

    function slotItemMap(){
        var slotItemMap = [
            {item: 0, weight: 1, value: 1, fruit: 'kiwi'},
            {item: 1, weight: 2, value: 2, fruit: 'strawberry'},
            {item: 2, weight: 3, value: 3, fruit: 'pineapple'},
            {item: 3, weight: 4, value: 4, fruit: 'lime'},
            {item: 4, weight: 1, value: 5, fruit: 'avocado'},
            {item: 5, weight: 1, value: 1, fruit: 'orange'},
            {item: 6, weight: 1, value: 1, fruit: 'blueberry'},
            {item: 7, weight: 1, value: 1, fruit: 'pomegranate'},
            {item: 8, weight: 1, value: 1, fruit: 'mango'},
            {item: 9, weight: 1, value: 1, fruit: 'cantaloupe'},
            {item: 10, weight: 1, value: 1, fruit: 'cherries'},
            {item: 11, weight: 1, value: 1, fruit: 'fruit punch'}
        ]
        return slotItemMap;
    }

    module.exports = slotItemMap;

});