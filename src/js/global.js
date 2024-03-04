document.addEventListener('DOMContentLoaded', function(){
    console.log('loaded');
    get_data();
    let head = document.querySelector('#head');
    head.addEventListener('click', function(){
        load_main();
    });
});