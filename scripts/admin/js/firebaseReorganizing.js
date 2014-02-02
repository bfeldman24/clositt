// Rearranging the closet if changing the closet structure. Should not be called anywhere, only manually
//firebaseReorganizing.addStaticCloset()
var firebaseReorganizing = {
 
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
    
    
    addImagesToClosets: function(){
        firebase.$.child("clositt").child(firebase.productsPath).once('value', function(store){
                console.log("Got Products");
                firebaseReorganizing.addImagesToClosetStepTwo(store.val());                
        });  
    },
    
    addImagesToClosetStepTwo: function(clothingStore){
        console.log("Updating clositts");
        
        firebase.$.child(firebase.userPath).once('value', function(users){                                                          
            console.log("Looping over users");
            
            users.forEach(function(user){
                var userid = user.name();
                
                user.child("closets").forEach(function(closet){                        
                    closet.child("items").forEach(function(item){
                        var sku = item.val();                        
                        var product = clothingStore[sku];
                                
                        if (product != null){
                    
                            var closetItem = {};
                            firebase.$.child(firebase.userPath)
                                        .child(userid)
                                        .child("closets")
                                        .child(closet.name())
                                        .child("items")
                                        .child(sku).set(product.i, function(error){
                                if (error){
                                    console.log("User: " + userid + ", Item: " + sku + " FAILED");
                                }else{
                                    console.log("User: " + userid + ",, Item: " + sku + " UPDATED");
                                } 
                            }); 
                            
                            firebase.$.child(firebase.userPath)
                                        .child(userid)
                                        .child("closets")
                                        .child(closet.name())
                                        .child("items")
                                        .child(item.name())
                                        .remove();
                        }else{
                            console.log("Product is null");   
                        }
                    });                                                        
                });                
            });                  
        });		
    },
    
    removeIncorrectItemsFromClositts: function(){
        console.log("Updating clositts");
        
        firebase.$.child(firebase.userPath).once('value', function(users){                                                          
            console.log("Looping over users");
            
            users.forEach(function(user){
                var userid = user.name();
                
                user.child("closets").forEach(function(closet){                        
                    closet.child("items").forEach(function(item){
                        var sku = item.val();                        
                        
                        if (sku.indexOf(".") <= 0 && sku.indexOf("/") <= 0){
                            
                            firebase.$.child(firebase.userPath)
                                        .child(userid)
                                        .child("closets")
                                        .child(closet.name())
                                        .child("items")
                                        .child(item.name())
                                        .remove();
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
        if (path != null){
               oldNode = path + "/" + oldNode;
               newNode = path + "/" + newNode;
        }
        
        firebase.$.child(oldNode).once('value', function(snapshot){                                    
                firebase.$.child(newNode).update(snapshot.val(), function(error){
                    if (error){
                        console.log("Error updating node");
                    }else{
                        console.log("Successfully updated node");
                    }
                });
        });
    },
    
    setAllProductPriorities: function(){
        firebase.$.child("clositt/" + firebase.productsPath).once('value', function(snapshot){
            var total = snapshot.numChildren();
            console.log("total: " + total);
            
            if (total > 0){
                snapshot.forEach(function(product){   
                    var item = product.val();
                    var priority = item.u.charAt(0) + (Math.floor(Math.random() * total));
                                                                        
                    firebase.$.child("clositt/" + firebase.productsPath).child(product.name()).setPriority(priority);
                    console.log(priority);
                }); 
            }
        });
    },
    
    limitStore: function(limit){        
        var store = "tempStore";
        var totalCount = 0;
        
        firebase.$.child(store).child("products").once('value', function(products){  
                                              
            products.forEach(function(company){                    
                company.forEach(function(customer){                                                
                    customer.forEach(function(category){                            
                        var productPath = company.name() + "/" + customer.name() + "/" + category.name();
                        var productCount = 0;
                        
                        category.forEach(function(product){
                                productCount++;
                                totalCount++;
                                                                    
                                if (productCount > limit){
                                    firebase.$.child(store).child("products").child(productPath)
                                                .child(product.name()).remove(function(error){      
                                        if (error)
                                            console.log("FAILED TO REMOVE: " + totalCount + ") " + productPath + "/" + product.name() + " -> " + productCount);
                                        else
                                            console.log("REMOVED: " + totalCount + ") " + productPath + "/" + product.name() + " -> " + productCount);
                                    });   
                                }
                        });            
                    });                            
                });    
            });                
        });
    },
    
    duplicateCompanyCustomerCategoryPropertiesToStoreObjects: function(){        
        var store = "store";        
        
        firebase.$.child(store).child("products").once('value', function(products){  
                                              
            products.forEach(function(company){                    
                company.forEach(function(customer){                                                
                    customer.forEach(function(category){                                                    
                        category.forEach(function(product){
                                firebase.$.child(store)
                                          .child("products")
                                          .child(company.name())
                                          .child(customer.name())
                                          .child(category.name())
                                          .child(product.name())
                                          .update({o:company.name(),u:customer.name(),a:category.name()});
                        });
                    });                            
                });    
            });                        
        });
    },
    
    fixStorePrices: function(){        
        var store = "store";        
        
        firebase.$.child(store).child("products").once('value', function(products){  
                                              
            products.forEach(function(company){                    
                company.forEach(function(customer){                                                
                    customer.forEach(function(category){                                                    
                        category.forEach(function(product){
                                var p = product.val();                                
                                var priceArray = (p.price + "").trim().split(/[\s-]+/);
                        		var finalPrice = priceArray[priceArray.length - 1].replace(/[^0-9\.]+/g,""); 
                            
                                firebase.$.child(store)
                                          .child("products")
                                          .child(company.name())
                                          .child(customer.name())
                                          .child(category.name())
                                          .child(product.name())
                                          .update({price:finalPrice});
                        });
                    });                            
                });    
            }); 
            
            console.log("FINISHED UPDATING PRODUCTS!");                                                               
        });
    },
    
    getCategoryCount: function(cat){        
        var store = "store";
        var totalCount = 0;
        
        firebase.$.child(store).child("products").once('value', function(products){  
                                              
            products.forEach(function(company){                    
                company.forEach(function(customer){                                                
                    customer.forEach(function(category){   
                        
                        if (cat == null || category.name() == cat){                                                 
                            totalCount += category.numChildren();
                        }
                    });                            
                });    
            });
            
            console.log("TOTAL PRODUCTS:" + totalCount);                
        });
    },
    
    getProductCount: function(products){        
        products = products == null ? "products" : products;
        var totalCount = 0;
        
        firebase.$.child("clositt").child(products).once('value', function(products){                                                            
            
            console.log("TOTAL PRODUCTS:" + products.numChildren());                
        });
    },
    
    reorganizeTags: function(){       
        var store = "store";
         
        firebase.$.child(store).child("tags").once('value', function(tags){
            
            tags.forEach(function(tag){
                tag.child("items").forEach(function(item){
                    firebase.$.child(store).child("tags").child(tag.name()).child("items").child(item.val()).set(1);
                    firebase.$.child(store).child("tags").child(tag.name()).child("items").child(item.name()).remove();            
                });
            });
            
            console.log("Finished Reorganizing Tags");
        });
    },  
    
     popuateStore: function(){
        firebase.$.child("clositt/products").once('value', function(products){
            
            products.forEach(function(product){
                var item = product.val();
                                
                firebase.$.child("store/products").child(item.o).child(item.u).child(item.a).set(item, function(error){
                   if (error){
                            console.log(item.s + " FAILED");
                        }else{
                            console.log(item.s + " UPDATED");
                        } 
                });                
            });              
        });		
    },     
}