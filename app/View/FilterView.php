<?php

class FilterView {	
    
    public static function getNavigationSection($filters){
        if (!isset($filters) || !is_array($filters) || 
            !isset($filters['customer']) || !isset($filters['category']) || !isset($filters['company']) || !isset($filters['color'])){	
	       return "No Filters";
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
                                    <ul class="dropdown-menu brand-box search-results filter-options category-dropdown" role="menu" filterType="tags">
                                        <?php FilterView::getCategoryFilters($filters['category']); ?>
                                    </ul>
                                </div>
                            </li>                           
                            <li>
                                <div class="btn-group ">
                                    <button type="button" id="company-search-dropdown" class="btn btn-default nav-filter dropdown-toggle alphabet-search-dropdown" data-toggle="dropdown">Brand/Store <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu scrollTo brand-box" role="menu">
                                        <?php echo FilterView::getAlphabetList($filters['company'], "c"); ?>                                        
                                        <li>
                                            <input type="text" class="form-control drop-search input-search" placeholder="Search">
                                        </li>
                                        <li>
                                            <ul class="search-results filter-options" filterType="company">
                                            	<?php FilterView::getAlphabetSearchFilter($filters['company'], "c"); ?>
                                            </ul>
                                        </li>
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
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle pricefilter" data-toggle="dropdown">Price <span class="icon-svg19"></span></button>
                                    <div class="dropdown-menu" role="menu" filterType="price">
                                        <div id="price-range-min-value" class="price-range-value" value="0">$0</div>
                                        <div id="price-range" max="<?php echo $filters['maxprice']; ?>"></div>
                                        <div id="price-range-max-value" class="price-range-value" value="<?php echo number_format($filters['maxprice'] / 2); ?>">$<?php echo number_format($filters['maxprice'] / 2); ?></div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle alphabet-search-dropdown" data-toggle="dropdown">Attribute <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu scrollTo brand-box right-align" role="menu">
                                        <?php echo FilterView::getAlphabetList($filters['attribute'], "a"); ?>                                        
                                        <li>
                                            <input type="text" class="form-control drop-search input-search" placeholder="Search">
                                        </li>
                                        <li>
                                            <ul class="search-results filter-options" filterType="tags">
                                            	<?php FilterView::getAlphabetSearchFilter($filters['attribute'], "a"); ?>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default nav-filter dropdown-toggle alphabet-search-dropdown" data-toggle="dropdown">Material <span class="icon-svg19"></span></button>
                                    <ul class="dropdown-menu scrollTo brand-box right-align" role="menu">
                                        <?php echo FilterView::getAlphabetList($filters['material'], "m"); ?>                                        
                                        <li>
                                            <input type="text" class="form-control drop-search input-search" placeholder="Search">
                                        </li>
                                        <li>
                                            <ul class="search-results filter-options" filterType="tags">
                                            	<?php FilterView::getAlphabetSearchFilter($filters['material'], "m"); ?>
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
                echo '<li class="categoryItem" ><a>'.$category.'</a><span class="icon-caret-right submenu-caret"></span>';
                
                echo '<ul class="subcategory" parent="'.$category.'">';
                foreach ($subcategories as $subcategory){
                    if (is_array($subcategory)){
                        $item = $subcategory['subvalue'];
                        $customer = $subcategory['customer'];    
                        $synonym = empty($subcategory['synonym']) ? $item : $item . ',' . $subcategory['synonym'];
                    }else{
                        $item = $subcategory;
                        $customer = 'both';
                        $synonym = $item;
                    }                    
                    
                    echo '<li class="subcategoryItem filterItem '.$customer.'"><a class="select_filter" value="'.$synonym.'">'.$item.'</a></li>';    
                }           
                echo '</ul>';
                
                echo '</li>';
            }
        } 
        
        if (isset($categories['Other'])){
            echo '<li class="categoryItem" ><a>Other</a><span class="icon-caret-right submenu-caret"></span>';
                
            echo '<ul class="subcategory" parent="Other">';
            foreach ($categories['Other'] as $subcategory){
                if (is_array($subcategory)){
                    $item = $subcategory['subvalue'];
                    $customer = $subcategory['customer'];    
                    $synonym = empty($subcategory['synonym']) ? $item : $item . ',' . $subcategory['synonym'];
                }else{
                    $item = $subcategory;
                    $customer = 'both';
                    $synonym = $item;
                } 
                    
                echo '<li class="subcategoryItem filterItem '.$customer.'"><a class="select_filter" value="'.$synonym.'">'.$item.'</a></li>';
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
        
    public static function getFilterList($items){        
        for ($i=0; $i < count($items); $i++){
            $item = is_array($items[$i]) && !empty($items[$i]['value']) ? $items[$i]['value'] : $items[$i];
            $customer = is_array($items[$i]) && !empty($items[$i]['customer']) ? $items[$i]['customer'] : 'both';
            
            echo '<li class="filterItem '.$customer.'"><a class="select_filter" value="'.$item.'">'.$item.'</a></li>';
        }         
    }
    
    public static function getAlphabetSearchFilter($items, $id){        
        $firstLetters = array();        
        
        foreach ($items as $item){
            if (!empty($item)){
                $name = is_array($item) ? $item['value'] : $item;                
                
                $firstLetter = strtoupper(substr($name, 0, 1));
                $customer = is_array($item) && !empty($item['customer']) ? $item['customer'] : 'both';
                
                if (isset($firstLetter) && $firstLetter != ""){
                                    
                    if (!in_array($firstLetter, $firstLetters)){
                        $firstLetters[] = $firstLetter;
                        
                        if (is_numeric($firstLetter)){
                            $firstLetter = "123"; 
                        }
                        
                        echo '<li id="'.$firstLetter.$id.'" class="brand-letter">'.$firstLetter.'</li>';
                    }
                    
                    echo '<li class="filterItem '.$customer.'"><a class="select_filter" value="'.$name.'">'.$name.'</a></li>';               
                }
            }
        }                
    }
    
    public static function getAlphabetList($items, $id){
        $list = '<li class="alphabets">';                
        $firstLetters = array(); 
        $lastLetter = "@"; // ascii character before 'A' 
        
        foreach ($items as $item){
            if (!empty($item)){
                $name = is_array($item) ? $item['value'] : $item;                                
                $firstLetter = strtoupper(substr($name, 0, 1));
                
                if (isset($firstLetter) && $firstLetter != ""){
                                    
                    if (!in_array($firstLetter, $firstLetters)){
                        $firstLetters[] = $firstLetter;
                        
                        if (is_numeric($firstLetter)){
                            $list .= '<a rel="#123'.$id.'">#</a>';
                        }else{
                            
                            $c=0;
                            for($abc = ord($lastLetter) + 1; $abc < ord($firstLetter); $abc++){
                              	$missingLetter = chr($abc);
                              	$list .= '<a rel="#'.$missingLetter.$id.'" class="disabled">'.$missingLetter.'</a>';
                              
                              	$c++;
                              	if ($c > 25){
                              		break;
                              	}
                            }                            
                            
                            $list .= '<a rel="#'.$firstLetter.$id.'">'.$firstLetter.'</a>';    
                            $lastLetter = $firstLetter;
                        }
                    }                    
                }
            }
        } 
        
        if (ord($lastLetter) < ord("Z")){
            $c=0;
            for($abc= ord($lastLetter) + 1; $abc <= ord("Z"); $abc++){
                	$missingLetter = chr($abc);
                	$list .= '<a rel="#'.$missingLetter.$id.'" class="disabled">'.$missingLetter.'</a>';
                
                	$c++;
                	if ($c > 25){
                		break;
                	}
            }    
        }
                
        $list .= '</li>';
        return $list;        
    }

}
?>
