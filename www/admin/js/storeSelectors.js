var skuHelper = {
    stripNonNumericChars: function(sku){
       return sku.replace(/\D/g, ''); // strip all non numeric chars;
    }
};

var Companies = {        
    'Betsey Johnson': {
    	"url": "http://www.betseyjohnson.com/CategoryItem.aspx?id=991&nav=1000&np=991_1000",
    	"date": "Wed Jun 11 20:56:00 2014",
    	"id": "bj",
    	"image": ".ItemContainerBody>.itemImageContainer>img.ItemContainerImageFirst",
    	"imageAttr": "src",
    	"link": ".ItemContainer1>.ItemContainerTitle>a.ItemContainerLink",
    	"linkAttr": "href",
    	"name": ".ItemContainer1>.ItemContainerTitle>a.ItemContainerLink",
    	"nameAttr": "text",
    	"price": ".ItemContainer1>.ItemContainerPrice",
    	"priceAttr": "text",
    	"sku": ".ItemContainer1>.ItemContainerTitle>a.ItemContainerLink",
    	"skuAttr": "href",
    	"nextPage": ".area-shadow>.pagination>a.pagination-item",
    	"nextPageAttr": "href",
    	"listing": ".ItemListWrapper2 .ItemContainer",
    	"getSku": function(sku){
    	   return sku.substring(sku.indexOf("id=") + 3, sku.indexOf("&", sku.indexOf("id="))); 
    	}
    },
    'Saks Fifth Avenue': {
    	"url": "http://www.saksfifthavenue.com/The-Men-s-Store/Apparel/Dress-Shirts/shop/_/N-52fo0f/Ne-6lvnb5",
    	"id": "sfa",
    	"date": "Fri Jun 13 08:10:25 2014",
    	"image": ".image-container-large>a>img.pa-product-large",
    	"imageAttr": "src",
    	"link": ".image-container-large>a",
    	"linkAttr": "href",
    	"name": ".product-text>.mainBlackText>p.product-description",
    	"nameAttr": "text",
    	"price": ".product-text>.mainBlackText>span.product-price",
    	"priceAttr": "text",
    	"designer": ".mainBlackText>.blackBold11>span.product-designer-name",
    	"designerAttr": "text",
    	"sku": "div[class^=pa-product-large]",
    	"skuAttr": "id",
    	"nextPage": "li>.next",
    	"nextPageAttr": "href",
    	"listing": "#product-container div[class^=pa-product-large]",
    	"getSku": skuHelper.stripNonNumericChars
    },
    'Lands End': {
    	"url": "http://www.landsend.com/shop/mens-dress-shirts/-/N-fzl",
    	"id": "le",
    	"date": "Sun Jun 15 12:43:52 2014",
    	"image": ".block-content-img>.product-image-link>img.product-image",
    	"imageAttr": "src",
    	"link": ".block-content>.block-content-img>a.product-image-link",
    	"linkAttr": "href",
    	"name": ".block-content-description>.product-name>a.product-name-link",
    	"nameAttr": "text",
    	"price": ".block-content-bd>.block-content-description>div.product-price",
    	"priceAttr": "text",
    	"sku": ".product",
    	"skuAttr": "data-product-number",
    	"nextPage": ".product-results-utilities-pagination>.desktop-pagination>.page.is-selected + a:first",
    	"nextPageAttr": "href",
    	"listing": ".l-line>.product-results-list-container>div.block"
    },
    'Calvin Klein': {
    	"url": "http://www.calvinklein.com/shop/en/ck/search/mens-dress-shirts",
    	"id": "ck",
    	"date": "Sun Jun 15 12:51:40 2014",
    	"image": ".productThumbnail>img",
    	"imageAttr": "src",
    	"imageLazyAttr": "data-src",
    	"link": ".productInfo>.title>a",
    	"linkAttr": "href",
    	"name": ".productInfo>.title>a",
    	"nameAttr": "text",
    	"price": ".productInfo>.priceInfo>span.salePrice",
    	"priceAttr": "text",
    	"sku": ".product_image",
    	"skuAttr": "data-catentryid",
    	"listing": ".product_cell",
    	"usePhantomjs": true
    },
    'Vineyard Vines': {
    	"url": "http://www.vineyardvines.com/womens-dresses-skirts/Womens-Dresses-Skirts,default,sc.html",
    	"id": "vv",
    	"date": "Sun Jun 15 13:01:18 2014",
    	"image": ".productimage>a>img.alternateimage",
    	"imageAttr": "src",
    	"link": ".name>a",
    	"linkAttr": "href",
    	"name": ".name>a",
    	"nameAttr": "text",
    	"price": ".pricing>.price>div.salesprice",
    	"priceAttr": "text",
    	"sku": ".product>.name>a",
    	"skuAttr": "href",
    	"listing": ".productlisting div.product",
    	"usePhantomjs": true,
    	"sampleSku": "http://www.vineyardvines.com/womens-dresses/whale-tail-jacquard-shift-dress/2Q0365,default,pd.html?dwvar_2Q0365_color=406&start=1&cgid=Womens-Dresses-Skirts",
    	"getSku": function(sku){
    	   return sku.substring(sku.lastIndexOf("/")+1,sku.indexOf(",",sku.lastIndexOf("/")));
    	}
    },
    'Rag Bone': {
    	"url": "http://www.rag-bone.com/store/productslist.aspx?categoryid=734&PageNo=0",
    	"id": "rb",
    	"date": "Sun Jun 15 13:09:28 2014",
    	"image": ".thumb_img>img",
    	"imageAttr": "src",
    	"link": "a.thumb_img",
    	"linkAttr": "href",
    	"name": "span.prod-title",
    	"nameAttr": "text",
    	"price": "span.prod-price",
    	"priceAttr": "text",
    	"sku": ".thumb_img>img",
    	"skuAttr": "id",
    	"listing": ".prod-list>span>span.product"
    },
    'Marc Jacobs': {
    	"url": "http://www.marcjacobs.com/marc-jacobs/mens/ready-to-wear/",
    	"id": "mj",
    	"date": "Sun Jun 15 13:18:55 2014",
    	"image": ".product-image>.product-link>img.product-image-img",
    	"imageAttr": "src",
    	"link": ".product-image>a.product-link",
    	"linkAttr": "href",
    	"name": ".product-info>.product-link>span.product-title",
    	"nameAttr": "text",
    	"price": ".product-info>.product-details>span.price",
    	"priceAttr": "text",
    	"sku": ".product",
    	"skuAttr": "id",
    	"listing": ".partial-product_listpage>.product-set>li.product"
    },
    'Canada Goose': {
    	"url": "http://www.canada-goose.com/collections/womens-arctic/",
    	"id": "cg",
    	"date": "Sun Jun 15 13:36:30 2014",
    	"image": ".collection-gallery-item-idle>img.product_image",
    	"imageAttr": "src",
    	"link": ".collection-gallery-section>.collection-gallery-item>a",
    	"linkAttr": "href",
    	"name": ".collection-gallery-item-idle>img.product_image",
    	"nameAttr": "title",
    	"noPrice": true,
    	"sku": ".collection-gallery-item-idle>img.product_image",
    	"skuAttr": "id",
    	"listing": ".collection-gallery-section>.collection-gallery-item>a",
    	"getSku": skuHelper.stripNonNumericChars
    },
    'Balenciaga': {
    	"url": "http://www.balenciaga.com/us/women/jackets",
    	"id": "bal",
    	"date": "Sun Jun 15 13:43:23 2014",
    	"image": ".image>.primaryImage>img",
    	"imageAttr": "data-original",
    	"imageLazyAttr": "data-retinasrc",
    	"link": "a:first",
    	"linkAttr": "href",
    	"name": ".description>a>div.title",
    	"nameAttr": "text",
    	"price": ".productPrice>.newprice>span.priceValue",
    	"priceAttr": "text",
    	"sku": ".product",
    	"skuAttr": "data-code8",
    	"listing": "div>.productsContainer>li.product"
    },
    'Armani': {
    	"url": "http://www.armani.com/us/armanicollezioni/women/tops",
    	"id": "arm",
    	"date": "Sun Jun 15 13:51:31 2014",
    	"image": ".url>.hproductPhotoCont>img.photo",
    	"imageAttr": "src",
    	"imageLazyAttr": "data-original",
    	"link": ".itemDesc>a.category",
    	"linkAttr": "href",
    	"name": ".itemDesc>.category>h3",
    	"nameAttr": "text",
    	"price": "a>.itemPrice>span.prezzoProdottoSaldo",
    	"priceAttr": "text",
    	"sku": ".item",
    	"skuAttr": "data-item-code10",
    	"listing": ".clearfix>.innerPageContent>div.item"
    },
    '7 For All Mankind': {
    	"url": "http://www.7forallmankind.com/Womens_Slim_Illusion/pl/p/1/c/4900.html",
    	"id": "fam",
    	"date": "Sun Jun 15 14:07:16 2014",
    	"image": "a>img[id]",
    	"imageAttr": "src",
    	"link": "a:has(img[id])",
    	"linkAttr": "href",
    	"name": "span.name",
    	"nameAttr": "text",
    	"price": ".name>span.item-price",
    	"priceAttr": "text",
    	"sku": ">a>img[id]",
    	"skuAttr": "id",
    	"nextPage": "span>.next:first",
    	"nextPageAttr": "href",
    	"listing": ".products-loader>.products>li"    	
    },
    'Van Heusen': {
    	"url": "http://vanheusen.com/product-categories/casual-shirts/",
    	"id": "vh",
    	"date": "Sun Jun 15 16:23:05 2014",
    	"image": ".productItemHover>img.productItemImage",
    	"imageAttr": "src",
    	"link": "a.productLink",
    	"linkAttr": "href",
    	"name": "div.title",
    	"nameAttr": "text",
    	"noPrice": true,
    	"sku": ".productItemImage",
    	"skuAttr": "src",
    	"listing": "#productItemList > div.productItem",
    	"sampleSku": "http://pvhvanheusen.files.wordpress.com/2014/02/vh_5024281_3342.jpg?w=220",
    	"getSku": function(sku){
    	   return skuHelper.stripNonNumericChars(sku.substring(sku.lastIndexOf("/")+1,sku.indexOf("?",sku.lastIndexOf("/"))));
    	}    	
    },
    'Under Armour': {
    	"url": "http://www.underarmour.com/shop/us/en/mens/apparel/tops/shortsleeve?sec=1#2",
    	"id": "ua",
    	"date": "Sun Jun 15 16:33:33 2014",
    	"image": ".image-detail-link>img.tile-image",
    	"imageAttr": "src",
    	"link": "a.image-detail-link",
    	"linkAttr": "href",
    	"name": ".info>.name-container>a.tile-title",
    	"nameAttr": "text",
    	"price": ".info>.price>span.money",
    	"priceAttr": "text",
    	"sku": "li.item",
    	"skuAttr": "id",
    	"styleNumber": "li.item",
    	"styleNumberAttr": "data-current-material",
    	"listing": ".grid-views .grid> li.item"
    },
    'Ugg Australia': {
    	"url": "http://www.uggaustralia.com/women-apparel/",
    	"id": "ugg",
    	"date": "Sun Jun 15 16:37:50 2014",
    	"image": ".product-image>.thumb-link>img",
    	"imageAttr": "src",
    	"link": ".product-name>h2>a.name-link",
    	"linkAttr": "href",
    	"name": ".product-name>h2>a.name-link",
    	"nameAttr": "text",
    	"price": ".product-pricing>span.product-sales-price",
    	"priceAttr": "text",
    	"sku": ".product-tile",
    	"skuAttr": "data-itemid",
    	"listing": ".search-result-items>.grid-tile>div.product-tile"
    },
    'True Religion': {
    	"url": "http://www.truereligion.com/Mens-activewear-jackets-sweatpants-shirts/pl/c/5600.html",
    	"id": "tr",
    	"date": "Sun Jun 15 16:41:43 2014",
    	"image": ".product-link>img.product-thumbnail",
    	"imageAttr": "src",
    	"link": ".product-text>.product-name>a",
    	"linkAttr": "href",
    	"name": ".product-text>.product-name>a",
    	"nameAttr": "text",
    	"price": ".product-price",
    	"priceAttr": "text",
    	"sku": ".plp-product>.product-link>img.product-thumbnail",
    	"skuAttr": "id",
    	"listing": ".page>.plp-product-list>div.plp-product"
    },
    'Tommy Hilfiger': {
    	"url": "http://usa.tommy.com/shop/en/thb2cus/search/SWEATERS-WOMEN",
    	"id": "th",
    	"date": "Sun Jun 15 16:48:47 2014",
    	"image": ".productImageWrapper img",
    	"imageAttr": "data-src",
    	"link": ".product_data>.product_title>a",
    	"linkAttr": "href",
    	"name": ".product_data>.product_title>a",
    	"nameAttr": "text",
    	"price": ".product_data>.price>.price",
    	"priceAttr": "text",
    	"sku": ".product_image[data-catentryid]",
    	"skuAttr": "data-catentryid",
    	"nextPage": "ul>.nextprevious>a.rightarrow",
    	"nextPageAttr": "href",
    	"listing": ".product_cell"
    },
    'The North Face': {
    	"url": "http://www.thenorthface.com/catalog/sc-gear/mens-shirts-sweaters-filter-category-full-zip",
    	"id": "tnf",
    	"date": "Sun Jun 15 16:55:11 2014",
    	"image": ">a>img",
    	"imageAttr": "src",
    	"link": ">a:has(>img)",
    	"linkAttr": "href",
    	"name": ">a:has(>img)",
    	"nameAttr": "title",
    	"price": ".productInfo>div.productPrice",
    	"priceAttr": "text",
    	"sku": ".productBlock>.productInfo",
    	"skuAttr": "id",
    	"listing": ".col-06>.content-box>div.productBlock"
    },
    'REI': {
    	"url": "http://www.rei.com/c/mens-casual-jackets",
    	"id": "rei",
    	"date": "Sun Jun 15 17:05:11 2014",
    	"image": ".result-image-primary",
    	"imageAttr": "src",
    	"link": ".result-product-page-link",
    	"linkAttr": "href",
    	"name": ".result-title",
    	"nameAttr": "text",
    	"price": ".result-price",
    	"priceAttr": "text",
    	"sku": ".product-result",
    	"skuAttr": "data-style",
    	"nextPage": ".pagination-item>.next-page",
    	"nextPageAttr": "href",
    	"listing": ".product-result",
    	"usePhantomjs": true
    },
    'Ralph Lauren': {
    	"url": "http://www.ralphlauren.com/family/index.jsp?categoryId=2498319&cp=1760781&ab=ln_men_cs_casualshirts",
    	"id": "rl",
    	"date": "Sun Jun 15 17:10:35 2014",
    	"image": "div>.photo>img.regImage",
    	"imageAttr": "src",
    	"link": ".product-details>dt>a.prodtitle",
    	"linkAttr": "href",
    	"name": ".product-details>dt>a.prodtitle",
    	"nameAttr": "text",
    	"price": ".ourprice .prodtitle",
    	"priceAttr": "text",
    	"sku": ".product",
    	"skuAttr": "id",
    	"nextPage": ".grid-nav-links>.results",
    	"nextPageAttr": "href",
    	"listing": "form>.products>li.product",
    	"getSku": skuHelper.stripNonNumericChars
    },
    'Puma': {
    	"url": "http://us.puma.com/en_US/men/clothing/jackets",
    	"id": "pum",
    	"date": "Sun Jun 15 17:15:54 2014",
    	"image": ".product-image-inner>.thumb-link>img",
    	"imageAttr": "src",
    	"link": ".product-name>.h10>a.name-link",
    	"linkAttr": "href",
    	"name": ".product-name>.h10>a.name-link",
    	"nameAttr": "text",
    	"price": "div.product-pricing",
    	"priceAttr": "text",
    	"sku": ".product-tile",
    	"skuAttr": "data-itemid",
    	"nextPage": ".paginationlist>li>a.pagenext",
    	"nextPageAttr": "href",
    	"listing": ".grid-tile"
    },
    'Perry Ellis': {
    	"url": "http://www.perryellis.com/tops/casual-shirts/",
    	"id": "pe",
    	"date": "Sun Jun 15 17:22:47 2014",
    	"image": ".productimage>a>img",
    	"imageAttr": "src",
    	"link": ".name>a",
    	"linkAttr": "href",
    	"name": ".name>a",
    	"nameAttr": "text",
    	"price": ".pricing>div.price",
    	"priceAttr": "text",
    	"sku": "input[name=pitem]",
    	"skuAttr": "value",
    	"listing": ".productlisting>.product",
    	"usePhantomjs": true
    },
    'Oakley': {
    	"url": "http://www.oakley.com/store/products/men/apparel/sweaters-and-hoodies",
    	"id": "oak",
    	"date": "Sun Jun 15 17:30:30 2014",
    	"image": ".container>.image-container .image-pic",
    	"imageAttr": "data-img",
    	"link": ".product-name>a",
    	"linkAttr": "href",
    	"name": ".product-name>a>h5",
    	"nameAttr": "text",
    	"price": ".product-content>.product-price",
    	"priceAttr": "text",
    	"sku": ".product-name>a",
    	"skuAttr": "href",
    	"listing": ".product",
    	"getSku": function(sku){
    	   if (sku.lastIndexOf("/") == sku.length -1){
    	       sku = sku.substring(0, sku.length-1);   
    	   }
    	   
    	   if (sku.indexOf("?") > 0){
    	       return sku.substring(sku.lastIndexOf("/")+1, sku.indexOf("?", sku.lastIndexOf("/")));
    	   }else{
    	       return sku.substring(sku.lastIndexOf("/")+1);
    	   }
    	} 
    },
    'Jockey': {
    	"url": "http://www.jockey.com/catalog?department=men&category=sportswear",
    	"id": "joc",
    	"date": "Sun Jun 15 17:49:55 2014",
    	"image": ".OverlayWrapper>a>img.ProductListImage",
    	"imageAttr": "src",
    	"imageLazyAttr": "data-original",
    	"link": ".OverlayWrapper>a",
    	"linkAttr": "href",
    	"name": ".ProductListTitleLink>span.ProductListTitle",
    	"nameAttr": "text",
    	"price": ".ProductListPriceWrapper>span.ProductListPrice",
    	"priceAttr": "text",
    	"sku": ".OverlayWrapper>a:nth-child(1)",
    	"skuAttr": "rel",
    	"nextPage": ".SortWrapper>.Pagination>a.PageButton:not(.Selected)",
    	"nextPageAttr": "href",
    	"listing": ".ProductRow div.ProductListItem"
    },
    'Hugo Boss': {
    	"url": "http://www.hugoboss.com/us/all-brands/men/casualwear/",
    	"id": "hb",
    	"date": "Sun Jun 15 20:27:56 2014",
    	"image": ".product-image img",
    	"imageAttr": "rel",
    	"link": ".product-image a",
    	"linkAttr": "href",
    	"name": ".name-link",
    	"nameAttr": "text",
    	"price": ".product-sales-price",
    	"priceAttr": "text",
    	"sku": ".product-tile",
    	"skuAttr": "data-itemid",
    	"nextPage": ".pagination .current-page + li > a",
    	"nextPageAttr": "href",
    	"listing": ".grid-tile"
    },
    'GUESS': {
    	"url": "http://shop.guess.com/en/Catalog/Browse/women/dresses/",
    	"id": "gs",
    	"date": "Sun Jun 15 20:47:57 2014",
    	"image": ".prodImg>a>img",
    	"imageAttr": "src",
    	"imageLazyAttr": "originalurl",
    	"link": ".image>.prodImg>a",
    	"linkAttr": "href",
    	"name": ".name>a",
    	"nameAttr": "text",
    	"price": "div.price",
    	"priceAttr": "text",
    	"sku": ".prodImg>a>img",
    	"skuAttr": "alt",
    	"nextPage": ".pagination:first>.inline>li>a:last",
    	"nextPageAttr": "href",
    	"listing": ".thumbnails>.span3>div.productThumb"
    },
    'Gucci': {
    	"url": "http://www.gucci.com/us/category/f/women_s_ready_to_wear/dresses___jumpsuits",
    	"id": "gc",
    	"date": "Sun Jun 15 20:55:49 2014",
    	"image": "a>img.oneup_image",
    	"imageAttr": "src",
    	"link": "a",
    	"linkAttr": "href",
    	"name": ".product_info>h3>a",
    	"nameAttr": "text",
    	"noPrice": true,
    	"sku": ".imgcontainer",
    	"skuAttr": "id",
    	"listing": ".ggpanel"
    },
    'Express': {
    	"url": "http://www.express.com/clothing/Jackets+-+Coats/Jackets/cat/cat430018",
    	"id": "ex",
    	"date": "Thurs Aug 21 21:04:14 2014",
    	"image": ".image-container>a>img.product-image",
    	"imageAttr": "data-original",
    	"link": ".product-info>li>a",
    	"linkAttr": "href",
    	"name": ".product-info>li>a",
    	"nameAttr": "text",
    	"price": ".product-info>li>span:nth-child(1)",
    	"priceAttr": "text",
    	"sku": ".ev-icon",
    	"skuAttr": "data-product-id",
    	"nextPage": null,
    	"nextPageAttr": null,
    	"listing": "#browse-gallery>ul>li"
    },
    'Dockers': {
    	"url": "http://us.dockers.com/family/index.jsp?categoryId=41317386&cp=2271557&ab=men_MegaNav_summersale_Shorts_08082013",
    	"id": "dc",
    	"date": "Sun Jun 15 21:12:44 2014",
    	"image": "a>img",
    	"imageAttr": "src",
    	"link": ".prodTitleContainer>a.prodtitle",
    	"linkAttr": "href",
    	"name": ".prodTitleContainer>a.prodtitle",
    	"nameAttr": "text",
    	"price": ".prodTitleContainer>.priceDisplay>span.ourpricevpbold",
    	"priceAttr": "text",
    	"sku": ".productBox-Div>.prodTitleContainer>a.prodtitle",
    	"skuAttr": "href",
    	"listing": ".content>.prodloop-row>div.productBox-Div",
    	"sampleSku:" : "/product/index.jsp?productId=28665396&cp=2271557.41317386&ab=men_MegaNav_summersale_Shorts_08082013&parentPage=family&ab=",
    	"getSku": function(sku){    	   
            return sku.substring(sku.lastIndexOf("productId=")+10, sku.indexOf("&", sku.lastIndexOf("productId=")));    	   
    	}
    },
    'DKNY': {
    	"url": "http://www.dkny.com/dkny-jeans/dkny-jeans/mens/",
    	"id": "dk",
    	"date": "Sun Jun 15 21:20:44 2014",
    	"image": ".product-viewer>.product-link>img.product-image",
    	"imageAttr": "src",
    	"link": "a.product-link",
    	"linkAttr": "href",
    	"name": ".product-info>a.product-name",
    	"nameAttr": "text",
    	"price": ".product-info>div.product-price",
    	"priceAttr": "text",
    	"sku": ".product",
    	"skuAttr": "id",
    	"nextPage": ".page-set>.page>a.page-a[title=Next]",
    	"nextPageAttr": "href",
    	"listing": ".padder>.product-set>li.product",
    	"getSku": function(sku){    	   
            return sku.replace("product-","");
    	}
    },
    'Diesel': {
    	"url": "http://shop.diesel.com/womens/female-apparel/",
    	"id": "dl",
    	"date": "Sun Jun 15 21:33:35 2014",
    	"image": "li>a>img.primary-image",
    	"imageAttr": "data-original",
    	"link": ".product-info>.product-name>a.name-link",
    	"linkAttr": "href",
    	"name": ".product-info>.product-name>a.name-link",
    	"nameAttr": "text",
    	"price": ".product-info>.product-pricing>span.product-sales-price",
    	"priceAttr": "text",
    	"sku": ".product-info>.product-name>a.name-link",
    	"skuAttr": "href",
    	"nextPage": ".infinite-scroll-placeholder",
    	"nextPageAttr": "data-grid-url",
    	"listing": ".grid-tile>.product-tile>div.product-tile-content",
    	"sampleSku": "http://shop.diesel.com/d-dial/00SCQP0HAFE.html?dwvar_00SCQP0HAFE_color=900",
    	"getSku": function(sku){    	   
            return sku.substring(sku.lastIndexOf("/")+1, sku.indexOf(".html"));    	   
    	}
    },
    'Aeropostale': {
    	"url": "http://www.aeropostale.com/family/index.jsp?categoryId=11327013&cp=3534618.3534619.3534624.3542203.3536103",
    	"id": "aer",
    	"date": "Sun Jun 15 21:43:33 2014",
    	"image": ".details-image>a>img",
    	"imageAttr": "data-original",
    	"link": ".details-content>h4>a",
    	"linkAttr": "href",
    	"name": ".details-content>h4>a",
    	"nameAttr": "text",
    	"price": ".details-content>.price>li.now",
    	"priceAttr": "text",
    	"sku": ".item",
    	"skuAttr": "data-product-id",
    	"listing": ".products>.row>div.item"
    },
    'Adidas': {
    	"url": "http://www.adidas.com/us/men-s-graphic-tees/_/N-u2Z1z124qo",
    	"id": "adi",
    	"date": "Sun Jun 15 21:50:18 2014",
    	"image": ".image img",
    	"imageAttr": "src",
    	"imageLazyAttr": "rel",
    	"link": "a.product-link",
    	"linkAttr": "href",
    	"name": "a.product-link .title",
    	"nameAttr": "text",
    	"price": ".price",
    	"priceAttr": "text",
    	"sku": "div[data-target]",
    	"skuAttr": "data-target",
    	"nextPage": ".categorypagination>.nextPage>a",
    	"nextPageAttr": "href",
    	"listing": "#product-grid div[data-target]",
    	"sampleSku": "scene_7_F82526"    	
    },
    'New Balance': {
    	"url": "http://www3.newbalance.com/151000",
    	"id": "nb",
    	"date": "Sun Jun 15 21:57:52 2014",
    	"image": ".product-image>img.shot",
    	"imageAttr": "data-original",
    	"link": ".product-name>a",
    	"linkAttr": "href",
    	"name": ".product-name>a",
    	"nameAttr": "text",
    	"price": "div.product-pricing",
    	"priceAttr": "text",
    	"sku": ".product",
    	"skuAttr": "data-product-id",
    	"listing": ".product-list>.tile>div.product"
    },
    'Lucky Brand': {
    	"url": "http://www.luckybrand.com/mens/clothing/tops/shirts",
    	"id": "lb",
    	"date": "Sun Jun 15 22:06:22 2014",
    	"image": ".product-image>.thumb-link>img.first-image",
    	"imageAttr": "src",
    	"link": ".product-name>h2>a.name-link",
    	"linkAttr": "href",
    	"name": ".product-name>h2>a.name-link",
    	"nameAttr": "text",
    	"price": ".product-pricing>",
    	"priceAttr": "text",
    	"sku": ".product-tile",
    	"skuAttr": "data-itemid",
    	"listing": ".search-result-items>.grid-tile>div.product-tile"
    },
    'Victorias Secret': {
    	"url": "https://www.victoriassecret.com/victorias-secret-sport/all-bottoms",
    	"id": "vs",
    	"date": "Sun Jun 15 22:06:22 2014",
    	"image": ".qv-product-img-wrapper>a img",
    	"imageAttr": "src",
    	"imageLazyAttr": "data-lazy-asset",
    	"link": ".qv-product-img-wrapper>a",
    	"linkAttr": "href",
    	"name": "a.ssf3:last h3",
    	"nameAttr": "text",
    	"price": "a.ssf3:last p:not(.color)",
    	"priceAttr": "text",
    	"sku": "a:first",
    	"skuAttr": "data-item-id",
    	"listing": "ul.products > li",
    	"usePhantomjs": true
    },
    'Columbia': {
    	"url": "http://www.columbia.com/mens-t-shirts/men-shirts-tshirts,default,sc.html",
    	"id": "col",
    	"date": "Mon Jul  7 22:46:58 2014",
    	"image": ".product-image>.thumb-link>img.product-image",
    	"imageAttr": "src",
    	"name": ".product-name>h2>a.name-link",
    	"nameAttr": "text",
    	"link": ".product-name>h2>a.name-link",
    	"linkAttr": "href",
    	"price": ".product-pricing .product-sales-price",
    	"priceAttr": "text",
    	"sku": "div.product-tile ",
    	"skuAttr": "data-itemid",
    	"listing": ".grid-tile.product-tile",
    	"sampleSku": "AM6579",
    	"usePhantomjs": true
    },
    'Nautica': {
      	"url": "http://www.nautica.com/mens-shirts/",
      	"id": "nau",
      	"date": "Tue Jul 15 23:13:04 2014",
      	"image": ".product-image>.thumb-link>img",
      	"imageAttr": "src",
      	"name": ".product-name>h2>a.name-link",
      	"nameAttr": "text",
      	"link": ".product-name>h2>a.name-link",
      	"linkAttr": "href",
      	"price": "div.product-pricing",
      	"priceAttr": "text",
      	"sku": ".product-tile",
      	"skuAttr": "data-itemid",
      	"listing": ".search-result-items>.grid-tile>div.product-tile",
      	"sampleSku": "W42179"
      },
      'Elie Tahari': {
      	"url": "http://www.elietahari.com/en_US/men/shop/knits-sweaters",
      	"id": "eli",
      	"date": "Fri Jul 18 14:15:33 2014",
      	"image": ".productimage>a>img.primary",
      	"imageAttr": "src",
      	"name": ".gridimagehover>ul>li.gridimagename",
      	"nameAttr": "text",
      	"link": ".productimage>a>img.primary",
      	"linkAttr": "src",
      	"price": ".gridimagehover>ul>li.gridimageprice",
      	"priceAttr": "text",
      	"sku": ".productimage>a>img.primary",
      	"skuAttr": "src",
      	"nextPage": "ul>.view-all>a",
      	"nextPageAttr": "href",
      	"listing": ".productlisting>.product>div.image",
      	"sampleSku": "http://cdn.fluidretail.net/customers/c1444/J35AK504/generated/J35AK504_N8R_RB1_324x477.jpg",
      	"getSku": function(sku){    	   
            return sku.substring(sku.lastIndexOf("/")+1, sku.indexOf("_", sku.lastIndexOf("/")+1));    	   
    	}
      },
      'Bonobos': {
      	"url": "http://bonobos.com/b/new-clothing-for-men",
      	"id": "bon",
      	"date": "Tue Jul 29 22:11:59 2014",
      	"image": "a>img",
      	"imageAttr": "src",
      	"name": "a>.product-summary-container>h3.product-name",
      	"nameAttr": "text",
      	"link": "a",
      	"linkAttr": "href",
      	"price": "a>.product-summary-container>p>.price",
      	"priceAttr": "text",
      	"sku": ".item[itemtype]",
      	"skuAttr": "id",
      	"nextPage": "div>map>area",
      	"nextPageAttr": "href",
      	"listing": ".products-list>.category-products>li.item[itemtype]",
      	"sampleSku": "product-235671",
      	"usePhantomjs": true,
      	"getSku": skuHelper.stripNonNumericChars
      },
      'Intermix': {
      	"url": "http://www.intermixonline.com/category/clothing/just+in.do?nType=1",
      	"id": "im",
      	"date": "Thur Aug 21 22:11:59 2014",
      	"image": ".thumbcontainer img",
      	"imageAttr": "src",
      	"name": ".thumbcontainer img",
      	"nameAttr": "alt",
      	"link": ".thumbcontainer a",
      	"linkAttr": "href",
      	"price": ".thumbInfo > .thumbPricing > #productPricing",
      	"priceAttr": "text",
      	"sku": ".thumbcontainer img",
      	"skuAttr": "src",
      	"nextPage": ".viewButtons:first>a",
      	"nextPageAttr": "onclick",
      	"listing": ".dirThumbsCatProductGrid>.thumbtext",
      	"sampleSku": "//intermix.scene7.com/is/image/Intermix/PROD_F141C747SJGREY_140?&$273x341$",
    	"usePhantomjs": true,
      	"getSku": function(sku){      	 
    	   sku = sku.substring(sku.lastIndexOf("/")+1);
    	   
    	   if (sku.indexOf("?") > 0){
    	       sku = sku.substring(0, sku.indexOf("?"));   
    	   }
    	   
    	   return sku.replace(/_/g, '');
    	}
      },
      'Shinesty': {
      	"url": "http://shinesty.com/collections/80s",
      	"id": "sh",
      	"date": "Mon Nov 3 22:11:59 2014",
      	"image": "a>img",
      	"imageAttr": "src",
      	"name": "a>.info>span.title:first-child()",
      	"nameAttr": "text",
      	"link": "a:first-child()",
      	"linkAttr": "href",
      	"price": "a>.info>span.price",
      	"priceAttr": "text",
      	"sku": ".modal",
      	"skuAttr": "id",
      	"nextPage": ".paginate>span.next>a",
      	"nextPageAttr": "href",
      	"listing": ".column.thumbnail",
      	"sampleSku": "product-372747380",
      	"getSku": skuHelper.stripNonNumericChars
      }
};


var NextPageSelector = {    
    "AmericanApparel": null,
    "AmericanEagle": null,
    "AnnTaylor": ".pages a.next",
    "Anthropologie": null,
    "Athleta": null,
    "BananaRepublic": null,
    "BCBG": ".first-last a.page-next",
    "Bloomingdales": "#topRightArrow.nextArrow", 
    "BrooksBrothers": null,
    "Burberry": null,
    "CharlesTyrwhitt": ".all",
    "Chicos": "#pagination a.next",
    "Cusp": null, // onclick event, but lots of pages 
    "Dillards": ".next",
    "Forever21": "img#arrowNext",
    "FreePeople": ".next.page a.arrow",
    "Gap": null,
    "HM": ".pages .next",
    "Hollister": null,
    "Intermix": null,
    "JCPenney": "#paginationIdTOP a[title='next page']",
    "JCrew": ".paginationTop .pageNext",
    "JJill": null, // ".result-nav #(end with _sNextTop) a",
    "KateSpade": null,
    "Kohls": "a.next-set",
    "Loft": ".pages .next",
    "Lululemon": null,
    "LordTaylor": null,
    "Macys": "#paginationTop .arrowRight",
    "Madewell": null,
    "MichaelKors": ".pagination .nextpage",
    "NeimanMarcus": null, // "$(.nextarrow).prev()"
    "Nike": null,
    "Nordstrom": ".next",
    "NewYorkCompany": ".nav .next",
    "OldNavy": null,
    "Piperlime": null,
    "Target": ".pagination-item.next",
    "TopShop": ".show_next",
    "ToryBurch": null,
    "UrbanOutfitters": null, // "$(.category-pagination-pages a).last()"
    "Zara": null
};