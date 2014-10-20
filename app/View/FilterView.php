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
                <div class="col-sm-offset-1 col-md-offset-2">
                    <div class="nav">
                        <ul>                        
                             <li>
                                <div class="btn-group">
                                    <div class="btn btn-default nav-filter customer" type="customer" value="men" style="width:60px;">Men</div>
                                    <div class="btn btn-default nav-filter customer" type="customer" value="women" style="width:80px;">Women</div>
                                </div>
                            </li>
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
                                            <a rel="#123">#</a> 
                                            <a rel="#A">A</a> 
                                            <a rel="#B">B</a> 
                                            <a rel="#C">C</a> 
                                            <a rel="#D">D</a> 
                                            <a rel="#E">E</a> 
                                            <a rel="#F">F</a> 
                                            <a rel="#G">G</a> 
                                            <a rel="#H">H</a> 
                                            <a rel="#I">I</a> 
                                            <a rel="#J">J</a> 
                                            <a rel="#K">K</a> 
                                            <a rel="#L">L</a> 
                                            <a rel="#M">M</a> 
                                            <a rel="#N">N</a> 
                                            <a rel="#O">O</a> 
                                            <a rel="#P">P</a> 
                                            <a rel="#Q">Q</a> 
                                            <a rel="#R">R</a> 
                                            <a rel="#S">S</a> 
                                            <a rel="#T">T</a> 
                                            <a rel="#U">U</a> 
                                            <a rel="#V">V</a> 
                                            <a rel="#W">W</a> 
                                            <a rel="#X">X</a> 
                                            <a rel="#Y">Y</a> 
                                            <a rel="#Z">Z</a> 
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
            if ($category != "Other"){
                echo '<li class="categoryItem" ><a>'.$category.'</a>';
                
                echo '<ul class="subcategory" parent="'.$category.'" style="display:none;">';
                foreach ($subcategories as $subcategory){
                    echo '<li class="subcategoryItem"><a class="select_filter" value="'.$subcategory[0].'"><span class="icon-svg19"></span> '.$subcategory[0].'</a></li>';    
                }           
                echo '</ul>';
                
                echo '</li>';
            }
        } 
        
        if (isset($categories['Other'])){
            echo '<li class="categoryItem" ><a>Other</a>';
                
            echo '<ul class="subcategory" parent="Other" style="display:none;">';
            foreach ($categories['Other'] as $subcategory){
                echo '<li class="subcategoryItem"><a class="select_filter" value="'.$subcategory[0].'"><span class="icon-svg19"></span> '.$subcategory[0].'</a></li>';    
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
            echo '<li><a class="select_filter" value="$'.$prices[$i].' - $'.$prices[$i + 1].'" min="'.$prices[$i].'" max="'.$prices[$i + 1].'">$'.$prices[$i].' - $'.$prices[$i + 1].'</a></li>';               
        }         
    }
    
    public static function getStoreFilter($stores){        
        $firstLetters = array();
        
        foreach ($stores as $store){
            if (!empty($store)){
                $firstLetter = strtoupper(substr($store[0], 0, 1));
                
                if (isset($firstLetter) && $firstLetter != ""){
                                    
                    if (!in_array($firstLetter, $firstLetters)){
                        $firstLetters[] = $firstLetter;
                        
                        if (is_numeric($firstLetter)){
                            $firstLetter = "123"; 
                        }
                        
                        echo '<li id="'.$firstLetter.'" class="brand-letter">'.$firstLetter.'</li>';
                    }
                    
                    echo '<li><a class="select_filter" value="'.$store[0].'" >'.$store[0].'</a></li>';               
                }
            }
        }                
    }

}
?>