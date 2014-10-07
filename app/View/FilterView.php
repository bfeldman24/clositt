<?php

class FilterView {	
    
    public static function getNavigationSection($filters){
        if (!isset($filters) || !is_array($filters) || 
            !isset($filters['customer']) || !isset($filters['category']) || !isset($filters['company']) || 
            !isset($filters['price']) || !isset($filters['color'])){      	
	       return "whoops";
	    }	
        
        ob_start();
        ?>                            
        
        <section id="nav">
            <div class="container" id="filters">
                <h4 class="text-center">Narrow by:</h4>
                <div class="col-sm-offset-1 col-md-offset-3">
                    <div class="nav">
                        <ul>
                            <li>
                                <div class="btn-group ">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Item Type <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu brand-box search-results filter-drop filter-options" role="menu" filterType="category">
                                        <?php FilterView::getCategoryFilters($filters['category']); ?>
                                    </ul>
                                </div>
                            </li>
                            <?php /*
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Size <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu filter-options" role="menu" filterType="size">
                                        <li><a >&nbsp;</a></li>
                                        <li><a >&nbsp;</a></li>
                                        <li><a >&nbsp;</a></li>
                                        <li><a >&nbsp;</a></li>
                                    </ul>
                                </div>
                            </li>
                            */ ?>
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Color <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu color-box filter-options" role="menu" filterType="color">
                                        <?php FilterView::getColorFilter($filters['color']); ?>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Price <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu brand-box filter-drop filter-options" role="menu" filterType="price">
                                        <?php FilterView::getPriceFilter($filters['price']); ?>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <div class="btn-group ">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle" data-toggle="dropdown">Brand/Store <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu scrollTo brand-box" role="menu">
                                        <li class="alphabets">
                                            <a rel="#0">#</a> 
                                            <a rel="#a">A</a> 
                                            <a rel="#b">B</a> 
                                            <a rel="#c">C</a> 
                                            <a rel="#d">D</a> 
                                            <a rel="#e">E</a> 
                                            <a rel="#f">F</a> 
                                            <a rel="#g">G</a> 
                                            <a rel="#h">H</a> 
                                            <a rel="#i">I</a> 
                                            <a rel="#j">J</a> 
                                            <a rel="#k">K</a> 
                                            <a rel="#l">L</a> 
                                            <a rel="#m">M</a> 
                                            <a rel="#n">N</a> 
                                            <a rel="#o">O</a> 
                                            <a rel="#p">P</a> 
                                            <a rel="#q">Q</a> 
                                            <a rel="#r">R</a> 
                                            <a rel="#s">S</a> 
                                            <a rel="#t">T</a> 
                                            <a rel="#u">U</a> 
                                            <a rel="#v">V</a> 
                                            <a rel="#w">W</a> 
                                            <a rel="#x">X</a> 
                                            <a rel="#y">Y</a> 
                                            <a rel="#z">Z</a> 
                                        </li>
                                        <li>
                                            <input type="text" class="form-control drop-search input-search" placeholder="Search">
                                        </li>
                                        <li>
                                            <ul class="search-results filter-options" filterType="company">
                                            	<?php FilterView::getStoreFilter($filters['company']); ?>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="tag selectedFilters"></div>
                </div>
            </div>
        </section>
            
    <?php   
        
        $html = ob_get_clean();
        return preg_replace('/^\s+|\n|\r|\s+$/m', '', $html);
    }
    
    public static function getCategoryFilters($categories){
        
        foreach ($categories as $category => $subcategories){
            echo '<li><a>'.$category.'</a>';
            
            echo '<ul>';
            foreach ($subcategories as $subcategory){
                echo '<li><a class="select_filter" value="'.$subcategory[0].'">'.$subcategory[0].'</a></li>';    
            }           
            echo '</ul>';
            
            echo '</li>';
        }                 
    }
    
    public static function getColorFilter($colors){
        foreach ($colors as $name => $hex){
            echo '<li><a class="select_filter" style="background-color:'.$hex.'" title="'.$name.'" value="'.$name.'">&nbsp;</a></li>';
        }        
    }
    
    public static function getPriceFilter($prices){
        
        for ($i=0; $i < count($prices) - 1; $i++){                                  
            echo '<li><a class="select_filter" value="'.$prices[$i].' - '.$prices[$i + 1].'" min="'.$prices[$i].'" max="'.$prices[$i + 1].'">'.$prices[$i].' - '.$prices[$i + 1].'</a></li>';               
        }         
    }
    
    public static function getStoreFilter($stores){        
        $firstLetters = array();
        
        foreach ($stores as $store){
            if (!empty($store)){
                $firstLetter = strtolower(substr($store[0], 0, 1));
                
                if (isset($firstLetter) && $firstLetter != ""){
                                    
                    if (!in_array($firstLetter, $firstLetters)){
                        $firstLetters[] = $firstLetter;
                        
                        if (is_numeric($firstLetter)){
                            $firstLetter = "0"; 
                        }
                        
                        echo '<li id="'.$firstLetter.'"></li>';
                    }
                    
                    echo '<li><a class="select_filter" value="'.$store[0].'" >'.$store[0].'</a></li>';               
                }
            }
        }                
    }

}
?>