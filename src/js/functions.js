function load_main(){
    output = document.querySelector('output');
    output.setAttribute('class', 'all');
    output.innerHTML = '';

    let length = Object.keys(items).length;
    for(let i = 0; i < length; i++){
        let e = encode62(i);
        output.appendChild(get_item(e));
    }
}

function load_item(id){
    let output = document.querySelector('output');
    output.removeAttribute('class');

    output.innerHTML = '';
    let item = items[id];
    let emoji = item[0];
    let name = item[1];
    let result = document.createElement('div');
    result.setAttribute('class', 'item');
    result.innerHTML = emoji + " " + name;
    output.appendChild(result);

    let listObj = document.createElement('div');
    listObj.setAttribute('class', 'list');
    let list = get_list(id);
    console.log(list);

    let plus = document.createElement('div');
    plus.setAttribute('class', 'text');
    plus.innerHTML = "+";

    let equals = document.createElement('div');
    equals.setAttribute('class', 'text');
    equals.innerHTML = "=";

    for (let i = 0; i < list.length; i++){
        let curCraft = document.createElement('div');
        curCraft.setAttribute('class', 'craft');

        curCraft.appendChild(get_item(list[i][0]));
        curCraft.appendChild(plus.cloneNode(true));

        curCraft.appendChild(get_item(list[i][1]));
        curCraft.appendChild(equals.cloneNode(true));

        curCraft.appendChild(get_item(list[i][2]));
        listObj.appendChild(curCraft);
    }    
    output.appendChild(listObj);
}



function encode62(num) {
    var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    if (num === 0) {
        return '0';
    }
    while (num > 0) {
        result = alphabet[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}

function decode62(str) {
    var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = 0;
    for (var i = 0; i < str.length; i++) {
        result = result * 62 + alphabet.indexOf(str[i]);
    }
    return result;
}

function get_data(){
    fetch('src/data/items/items.json')
    .then(response => response.json())
    .then(data => {
        items = data['items'];
        load_main();
    });
    fetch('src/data/recipes/recipes.json')
    .then(response => response.json())
    .then(data => {
        recipes = data['recipes'];
        update_text();
    });
    
    return true;
}

function get_item(id){
    let emoji = items[id][0];
    let name = items[id][1];

    let result = document.createElement('div');
    result.setAttribute('class', 'item');
    result.setAttribute('id', id);
    result.innerHTML = emoji + " " + name;
    result.onclick = function(){
        load_item(id);
    }
    return result;
}

function get_recipes(id){
    let spliced = recipes.split(";");
    let curRecipes = [];

    for (let i = 0; i < spliced.length; i++){
        let curItems = spliced[i].split("=");
        let item1 = curItems[0].split("+")[0];
        let item2 = curItems[0].split("+")[1];
        let result = curItems[1];
        if (result === id){
            curRecipes.push([item1, item2]);
        }
    }
    return curRecipes;
}

function get_tree(key){
    item = items[key];
    maxNum = item[2];

    let finalTree = [];

    let spliced = recipes.split(";");
    for (let i = 0; i < spliced.length; i++){
        let curItems = spliced[i].split("=");
        let item1 = curItems[0].split("+")[0];
        let item2 = curItems[0].split("+")[1];
        let result = curItems[1];
        if (result === key){
            if (items[item1][2]+items[item2][2] <= maxNum){
                console.log(item1, item2);
                if (default_items.includes(item1) && default_items.includes(item2)){
                    finalTree.push([item1, item2]);
                } else if (default_items.includes(item1)){
                    finalTree.push([item1, get_tree(item2)]);
                } else if (default_items.includes(item2)){
                    finalTree.push([get_tree(item1), item2]);
                } else {
                    finalTree.push([get_tree(item1), get_tree(item2)]);
                }
            }
        }
    }
    return finalTree;
}

function get_list(key, first=true){
    item = items[key];
    maxNum = item[2];
    if(first){curList = [];}
    

    let spliced = recipes.split(";");
    for (let i = 0; i < spliced.length; i++){
        let curItems = spliced[i].split("=");
        let item1 = curItems[0].split("+")[0];
        let item2 = curItems[0].split("+")[1];
        let result = curItems[1];
        if (result === key){
            if (items[item1][2]+items[item2][2] <= maxNum){
                curList.push([item1, item2, result]);
                if (default_items.includes(item1)){
                    get_list(item2, false);
                } else if (default_items.includes(item2, false)){
                    get_list(item1, false);
                } else {
                    get_list(item1, false); get_list(item2, false);
                }
            }
        }
    }
    let inverted = [];
    for (let i = curList.length-1; i >= 0; i--){
        inverted.push(curList[i]);
    }
    return inverted;
}

function search(query){
    output.setAttribute('class', 'all');
    output.innerHTML = '';
    let value = query.toLowerCase();
    let keys = Object.keys(items);
    for (let i = 0; i < keys.length; i++) {
        let json = items[encode62(i)];
        let name = json[1].toLowerCase();
        if (name.includes(value)){
            output.appendChild(get_item(encode62(i)));
        }
    }
}

function update_text(){
    let txt = document.querySelector('h2');
    let itemNum = Object.keys(items).length;
    let spliced = recipes.split(";");
    let recipeNum = spliced.length;

    txt.innerHTML = "Items: " + itemNum + " | Recipes: " + recipeNum;
}
