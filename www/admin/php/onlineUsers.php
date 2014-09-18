<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
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
<?php include(dirname(__FILE__) . '/../../static/header.php');   ?>

<div class="main-content">
    <h2>ONLINE USERS:</h2>
    <ol id="userList"></ol>
    
    <br /><br />
    <h2>ONLINE GUESTS:</h2>
    <ol id="guestList"></ol>
    
</div>


<?php include(dirname(__FILE__) . '/../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script type="text/javascript">

function loggedOut(){
    onlineUsers.init();
}

function loggedIn(){
    onlineUsers.init();
}

var onlineUsers = {
    
    init: function(){
        //firebase.$.child("userdata").once('value', onlineUsers.trackUsers); 
        //firebase.$.child("onlineGuests").on('child_added', onlineUsers.trackNewGuests); 
        //firebase.$.child("onlineGuests").on('child_removed', onlineUsers.trackSignedOffGuests);
    },
        
    trackUsers: function(users){
                
        users.forEach(function(user){
                                                                            
//            firebase.$.child("userdata").child(user.name()).child(firebase.connections).on('value', function(data){
//                
//                if (data.val()){
//                    console.log(user.name() + " is ONLINE");
//                    
//                    if ($("#user-" + user.name()).length <= 0){
//                        
//                        firebase.$.child("userdata").child(user.name()).once('value', function(userdata){
//                            var name = userdata.child("name").val();
//                            var email = userdata.child("email").val();                            
//                            
//                            $("#userList").append( 
//                                $("<li>").addClass("user").attr("id","user-" + user.name())
//                                .text(name + " (" + email + ")")
//                            );
//                        });
//                    }
//                }else{
//                    console.log(user.name() + " is OFFLINE");
//                    $("#user-" + user.name()).remove();
//                } 
//            });          
        });              
    },
    
    trackNewGuests: function(child, prevChildName){
                
        if (child.val()){
            var loginTime = onlineUsers.formatDate(child.val());
            var id = onlineUsers.formatId(child.val());            
            
            console.log("Guest went ONLINE at " + loginTime);                                                      
                    
            $("#guestList").append( 
                $("<li>").addClass("user").attr("id","guest-" + id).text("Guest went ONLINE at " + loginTime)
            );    
        }                   
    },
    
    trackSignedOffGuests: function(child){
                
        if (child.val()){
            var loginTime = onlineUsers.formatDate(child.val());
            var id = onlineUsers.formatId(child.val());
            
            console.log("Guest went OFFLINE at " + loginTime);                               
                        
            if ($("#guest-" + id).length > 0){        
                $("#guest-" + id).remove();    
            }
        }                   
    },
    
    formatDate: function(d){
        var dateTime = new Date(d);
        return dateTime.toLocaleDateString() + "  " + dateTime.toLocaleTimeString();   
    },
    
    formatId: function(d){
        var dateTime = new Date(d);
        
        var c = new RegExp(':', 'g');
                
        var id = dateTime.toJSON();                
        id = id.replace(c, '');
        id = id.replace('.', '');
        
        return id;
    }

};
</script>
</body>
</html>
