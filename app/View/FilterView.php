<?php

class FilterView {	
    
    public static function getNavigationSection($filters){
        if (!isset($filters) || !is_array($filters) || 
            !isset($filters['customer']) || !isset($filters['category']) || !isset($filters['company']) || 
            !isset($filters['price']) || !isset($filters['color'])){      	
	       return null;
	    }	
        
        ?>                            
        <section id="nav">
            <div class="container">
                <h4 class="text-center">Narrow by:</h4>
                <div class="col-sm-offset-1 col-md-offset-2">
                    <div class="nav">
                        <ul>
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Item Type <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu brand-box search-results filter-drop" role="menu">
                                        <?php FilterView::getCategoryFilters($filters['category']); ?>
                                    </ul>
                                </div>
                            </li>
                            <?php /*
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Size <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu" role="menu">
                                        <li><a href="javascript:void();">&nbsp;</a></li>
                                        <li><a href="javascript:void();">&nbsp;</a></li>
                                        <li><a href="javascript:void();">&nbsp;</a></li>
                                        <li><a href="javascript:void();">&nbsp;</a></li>
                                    </ul>
                                </div>
                            </li>
                            */ ?>
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Color <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu color-box" role="menu">
                                        <?php FilterView::getColorFilter($filters['color']); ?>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Price <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu" role="menu">
                                        <?php FilterView::getPriceFilter($filters['price']); ?>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <div class="btn-group ">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Brand/Store <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu scrollTo brand-box" role="menu">
                                        <li class="alphabets">                                        
                                            <a rel="#0" href="javascript:void();">#</a>
                                            <a rel="#a" href="javascript:void();">A</a> 
                                            <a rel="#b" href="javascript:void();">B</a> 
                                            <a rel="#c" href="javascript:void();">C</a> 
                                            <a rel="#d" href="javascript:void();">D</a> 
                                            <a rel="#e" href="javascript:void();">E</a> 
                                            <a rel="#f" href="javascript:void();">F</a> 
                                            <a rel="#g" href="javascript:void();">G</a> 
                                            <a rel="#h" href="javascript:void();">H</a> 
                                            <a rel="#i" href="javascript:void();">I</a> 
                                            <a rel="#j" href="javascript:void();">J</a> 
                                            <a rel="#k" href="javascript:void();">K</a> 
                                            <a rel="#l" href="javascript:void();">L</a> 
                                            <a rel="#m" href="javascript:void();">M</a> 
                                            <a rel="#n" href="javascript:void();">N</a> 
                                            <a rel="#o" href="javascript:void();">O</a> 
                                            <a rel="#p" href="javascript:void();">P</a> 
                                            <a rel="#q" href="javascript:void();">Q</a> 
                                            <a rel="#r" href="javascript:void();">R</a> 
                                            <a rel="#s" href="javascript:void();">S</a> 
                                            <a rel="#t" href="javascript:void();">T</a> 
                                            <a rel="#u" href="javascript:void();">U</a> 
                                            <a rel="#v" href="javascript:void();">V</a> 
                                            <a rel="#w" href="javascript:void();">W</a> 
                                            <a rel="#x" href="javascript:void();">X</a> 
                                            <a rel="#y" href="javascript:void();">Y</a> 
                                            <a rel="#z" href="javascript:void();">Z</a> 
                                        </li>
                                        <li>
                                            <input type="text" class="form-control drop-search input-search" placeholder="Search">
                                        </li>
                                        <li>
                                            <ul class="search-results">
                                                <?php FilterView::getStoreFilter($filters['company']); ?>                                            	
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="tag"><span>T-Shirt <a href="javascript:void();" class="icon-svg4"></a></span></div>
                </div>
            </div>
        </section>
        <?php   
    }
    
    public static function getCategoryFilters($categories){
        
        foreach ($categories as $category => $subcategories){
            echo '<li><a class="select_filter" href="javascript:void();">'.$category.'</a>';
            
            echo '<ul>';
            foreach ($subcategories as $subcategory){
                echo '<li><a class="select_filter" href="javascript:void();">'.$subcategory[0].'</a></li>';    
            }           
            echo '</ul>';
            
            echo '</li>';
        }                 
    }
    
    public static function getColorFilter($colors){
        foreach ($colors as $name => $hex){
            echo '<li><a style="background-color:'.$hex.'" title="'.$name.'" href="javascript:void();">&nbsp;</a></li>';
        }        
    }
    
    public static function getPriceFilter($prices){
        
        for ($i=0; $i < count($prices) - 1; $i++){                                  
            echo '<li><a href="javascript:void();">'.$prices[$i].' - '.$prices[$i + 1].'</a></li>';               
        }         
    }
    
    public static function getStoreFilter($stores){        
        $firstLetters = array();
        
        foreach ($stores as $store){
            $firstLetter = strtolower(substr($store[0], 0, 1));
            
            if (!in_array($firstLetter, $firstLetters)){
                $firstLetters[] = $firstLetter;
                
                if (is_numeric($firstLetter)){
                    $firstLetter = "#"; 
                }
                
                echo '<li id="'.$firstLetter.'"></li>';
            }
            
            echo '<li><a href="javascript:void();">'.$store[0].'</a></li>';               
        }                
    }

}
?>