var vars = "";
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars = 'welcome, '+value;
    });
 

function logout(){
    var c=confirm("Are you sure you want exit ?")
    if(c){
        window.location = "login.html"
    }
}
function testpg(){window.location = "test.html"}


