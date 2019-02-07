document.getElementById('btn3').addEventListener('click', function named2 () {
    document.getElementById('out')
        .innerText += 'b';
});


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
    }
};
xhttp.open("GET", "ajax_info.txt", true);
xhttp.send();

