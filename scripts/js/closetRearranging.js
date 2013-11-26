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
    },
    
    resetCommentCount: function(){
        // clear all products
        firebase.$.child("clositt/products").once('value', function(products){                        
            products.forEach(function(product){
                var sku = product.name();
                var item = product.val();                
                firebase.$.child("clositt/products").child(sku).child("rc").set(0, function(error){
                    if (error){
                        console.log("Product: " + sku + " FAILED RESETTING COUNT");
                    }else{
                        console.log("Product: " + sku + " RESET COUNT");
                    } 
                });                             
            });                                       
        });	
        
        // Set comment count for all products
        firebase.$.child("reviews").once('value', function(reviews){                        
            reviews.forEach(function(review){
                var sku = review.name();
                var count = review.numChildren();
                                
                firebase.$.child("clositt/products").child(sku).child("rc").set(count, function(error){
                    if (error){
                        console.log("Product: " + sku + " FAILED UPDATING COUNT");
                    }else{
                        console.log("Product: " + sku + " UPDATED COMMENT COUNT");
                    } 
                });                             
            });                                       
        });		
    },  
    
    renameFirebaseNode: function(path, oldNode, newNode){
        firebase.$.child(path).child(oldNode).once('value', function(snapshot){                                    
                firebase.$.child(path).child(newNode).update(snapshot.val(), function(error){
                    if (error){
                        console.log("Error updating node");
                    }else{
                        console.log("Successfully updated node");
                    }
                });
        });
    } 
}