<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../../static/meta.php');   
?>

<style type="text/css">
.main-content{
    margin:60px
}

.user{
    color: #006400;   
}

#userList{
     list-style-type: hebrew;   
}

</style>
</head>
<body>
<?php include(dirname(__FILE__) . '/../../../static/header.php');   ?>

<div class="main-content">
    <h2>ONLINE USERS:</h2>
    <ol id="userList"></ol>
</div>


<?php include(dirname(__FILE__) . '/../../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
$(document).ready(function(){
    firebase.$.child("userdata").once('value', function(users){
                
        users.forEach(function(user){
                                                                            
            firebase.$.child("userdata").child(user.name()).child("connections").on('value', function(data){
                
                if (data.val()){
                    console.log(user.name() + " is ONLINE");
                    
                    if ($("#user-" + user.name()).length <= 0){
                        
                        firebase.$.child("userdata").child(user.name()).once('value', function(userdata){
                            var name = userdata.child("name").val();
                            var email = userdata.child("email").val();
                            
                            $("#userList").append( 
                                $("<li>").addClass("user").attr("id","user-" + user.name())
                                .text(name + " (" + email + ")")
                            );    
                        });
                    }
                }else{
                    console.log(user.name() + " is OFFLINE");
                    $("#user-" + user.name()).remove();
                } 
            });          
        });              
    });
});
</script>
</body>
</html>
