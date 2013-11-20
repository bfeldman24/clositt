// Rearranging the closet if changing the closet structure. Should not be called anywhere, only manually
//closetRearranging.addStaticCloset()
var closetRearranging = {
 
    updateAllClosets: function(){
        firebase.$.child(firebase.userPath).once('value', function(users){
            var closetid = new Date().getTime();
            
            users.forEach(function(user){
                var userid = user.name();
                var i=0;
                user.child("closets").forEach(function(closet){                        
                    closetid += i++;
                    var newCloset = {};
                    newCloset["name"] = closet.name();
                    newCloset["items"] = closet.val();
                    
                    firebase.$.child(firebase.userPath).child(userid).child("closets/"+closetid).set(newCloset, function(error){
                        if (error){
                            console.log("User: " + userid + ", Closet: " + closetid + " FAILED");
                        }else{
                            console.log("User: " + userid + ", Closet: " + closetid + " UPDATED");
                        } 
                    });             
                });
                
            });              
        });		
    },
    
    addStaticCloset: function(){
        firebase.$.child(firebase.userPath).once('value', function(users){
            var closetid = closetPresenter.wishListClosetId;
            
            users.forEach(function(user){
                var userid = user.name();
                
                //BACKOUT SCRIPT
//                if(user.hasChild("closets/1384922474558")){
//                   firebase.$.child(firebase.userPath).child(userid).child("closets/1384922474558").remove(function(error){
//                        if (error){
//                            console.log("User: " + userid + ", Closet: " + closetid + " FAILED");
//                        }else{
//                            console.log("User: " + userid + ", Closet: " + closetid + " UPDATED");
//                        } 
//                    });                 
//                }
                
                var newCloset = {};
                newCloset["name"] = "Wish List";
                
                firebase.$.child(firebase.userPath).child(userid).child("closets/"+closetid).set(newCloset, function(error){
                    if (error){
                        console.log("User: " + userid + ", Closet: " + closetid + " FAILED");
                    }else{
                        console.log("User: " + userid + ", Closet: " + closetid + " UPDATED");
                    } 
                });
            });              
        });		
    }   
}