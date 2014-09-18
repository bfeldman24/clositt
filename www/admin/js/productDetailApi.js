var productDetailApi = {

    "American Eagle": {
        id: 'ae',
        originalPrice: ".pContent .listPrice",
        price: ".price .dollars",
        priceCents: ".price .cents",        
        details: ".pDetailBody .pDetailLeft .addlEquity",
        detailsAttr: "text",
        colors: ".swatches a.swatch_link",
        colorsAttr: "href",        
        colorsNamesAttr: "title",   
        swatches: ".productSet .imgThumbSwap img", 
        swatchesAttr: "src",
        sizes: ".sizeField option:not(:first)",
        sizesAttr: "text",
        promotion: ".mainEquity .pMarketing",
        promotionTwo: ".testPromotionNo"
    },
        
    'American Apparel': {
    	"url": "http://store.americanapparel.net/screen-printed-fine-jersey-short-sleeve-t-shirt-harry-dodge_2001sphd",
    	"id": "aa",
    	"date": "Sat Jun 14 22:08:15 2014",
    	"details": "tbody>tr>td",
    	"detailsAttr": "text",
    	"price": ".price>div>span",
    	"priceAttr": "text",
    	"promotionTwo": ".column>.clearfix>p",
    	"promotionTwoAttr": "text",
    	"colors": ".color .swatch",    	
    	"colorsNamesAttr": "title",
    	"colorsImagesAttr": "style-background-image",
    	"swatches": "div>.slide>img",
    	"swatchesAttr": "src",
    	"sizes": "div>ul>li.size",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    
    'Ann Taylor': {
    	"url": "http://www.anntaylor.com/open-knit-v-neck-sweater/277012?colorExplode=false&skuId=16502635&catid=cata000011&productPageType=fullPriceProducts&defaultColor=9145",
    	"id": "at",
    	"date": "Sun Jun 15 00:10:31 2014",
    	"name": "div>div>h1",
    	"nameAttr": "text",
    	"details": "div>.gu>p",
    	"detailsAttr": "text",
    	"price": ".price",
    	"priceAttr": "text",
    	"promotion": ".gu>.info-product>p.note-pos",
    	"promotionAttr": "text",
    	"colorsImages": "#color-picker>ul>li",
    	"colorsImagesAttr": "style-background-color",
    	"colorsNames": "#color-picker>ul>li>a",
    	"colorsNamesAttr": "title",
    	"sizes": ".selectSize > li",
    	"sizesAttr": "id"
    },
    'Anthropologie': {
    	"url": "http://www.anthropologie.com/anthro/product/clothes-dresses/4130075284111.jsp?cm_sp=Grid-_-4130075284111-_-Regular_0#/",
    	"id": "a",
    	"date": "Sun Jun 15 00:36:32 2014",
    	"name": ".product-info>.selections>h1.product-name",
    	"nameAttr": "text",
    	"summary": ".selections>.description>p.description-content",
    	"summaryAttr": "text",
    	"details": ".details-content>ul",
    	"detailsAttr": "text",
    	"price": ".selections>.price>div.ng-scope",
    	"priceAttr": "text",
    	"colorsNames": ".color-swatches>.ng-scope>.ng-scope",
    	"colorsNamesAttr": "title",
    	"swatches": "#imgSlider img",
    	"swatchesAttr": "ng-src",
    	"sizes": ".ng-pristine>.size>select.size-dropdown:first>option:not(:first)",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    'Gap': {
    	"url": "http://www.gap.com/browse/product.do?cid=1007498&vid=1&pid=960403012",
    	"id": "g",
    	"date": "Sun Jun 15 08:26:53 2014",
    	"name": ".brand1>div>span.productName",
    	"nameAttr": "text",
    	"details": "#tabWindow",
    	"detailsAttr": "text",
    	"price": "#priceText",
    	"priceAttr": "text",
    	"promotionTwo": "#newTabWindow >ul> li",
    	"promotionTwoAttr": "text",
    	"colorsImages": "#colorSwatchContent input",
    	"colorsImagesAttr": "src",
    	"colorsNames": "#colorSwatchContent input",
    	"colorsNamesAttr": "alt",
    	"swatches": "#imageThumbs input",
    	"swatchesAttr": "src",
    	"sizes": "div>div>button.normal",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    'BCBG': {
    	"url": "http://www.bcbg.com/Leslie-Twist-Back-Tank/WCJ1R998-N6N,default,pd.html?dwvar_WCJ1R998-N6N_color=N6N&cgid=clothing-by-category-tops#start=2",
    	"id": "bcbg",
    	"date": "Sun Jun 15 08:53:15 2014",
    	"container": ".full-width>.primary-content>div.pdp-main",
    	"containerAttr": "text",
    	"name": ".pdp-detailinfo>.product-col-2>h1.product-name",
    	"nameAttr": "text",
    	"details": "div>.product-tabs>div.tab-content",
    	"detailsAttr": "text",
    	"price": "div>.product-price>span.original-price",
    	"priceAttr": "text",
    	"colors": ".swatches>li>a.swatchanchor",
    	"colorsAttr": "href",
    	"colorsImages": ".swatches>li>a.swatchanchor",
    	"colorsImagesAttr": "data-lgimg",
    	"colorsNames": ".swatches>li>a.swatchanchor",
    	"colorsNamesAttr": "title",
    	"swatches": ".prodThumbnailCarousel img",
    	"swatchesAttr": "src",
    	"sizes": ".val_div>.attribute>select.variation-select>option",
    	"sizesAttr": "text"
    },
    'Betsey Johnson': {
    	"url": "http://www.betseyjohnson.com/CategoryItem.aspx?id=991&nav=1000&np=991_1000",
    	"id": "bj",
    	"date": "Sun Jun 15 08:56:55 2014",
    	"name": ".span-12>.underline-area>h1",
    	"nameAttr": "text",
    	"details": ".area-shadow>.item-description>div.tabs-container",
    	"detailsAttr": "text",
    	"price": ".underline-area>.item-price-wrapper>span.item-price",
    	"priceAttr": "text",
    	"colors": ".item-style-thumb-wrapper>.thumb>img",
    	"colorsAttr": "alt",
    	"colorsImages": ".item-style-thumb-wrapper>.thumb>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".item-style-thumb-wrapper>.item-style-thumb-name>a.item-name",
    	"colorsNamesAttr": "text",
    	"swatches": ".view-selector-thumb>.cloud-zoom-gallery>img",
    	"swatchesAttr": "src",
    	"sizes": ".step-wrapper>.size-selector>li",
    	"sizesAttr": "text"
    },
    'Bloomingdales': {
    	"url": "http://www1.bloomingdales.com/shop/product/nally-millie-tie-dye-dress?ID=1049223&CategoryID=21683#fn=spp%3D2%26ppp%3D96%26sp%3D1%26rid%3D9%26spc%3D3979",
    	"id": "b",
    	"date": "Sun Jun 15 09:01:54 2014",
    	"name": ".pdp_productInfo>.pdp_descriptionAndPrice>h1",
    	"nameAttr": "text",
    	"details": ".yui-navset>.yui-content>div",
    	"detailsAttr": "text",
    	"price": ".priceSale>.singleTierPrice>span.priceBig",
    	"priceAttr": "text",
    	"colorsNames": ".pdp_member_color>div>span.pdpColorDesc",
    	"colorsNamesAttr": "text",
    	"swatches": ".bl_pdp_thumb>.pdp_alt_image_link>img.altImage",
    	"swatchesAttr": "src",
    	"sizes": "ul>.size>span",
    	"sizesAttr": "text"
    },
    'Brooks Brothers': {
    	"url": "http://www.brooksbrothers.com/Non-Iron-Slim-Fit-Button-Down-Collar-Dress-Shirt/118Q,default,pd.html?dwvar_118Q_Color=BLUE&contentpos=2&cgid=0203",
    	"id": "bb",
    	"date": "Sun Jun 15 09:10:36 2014",
    	"container": ".clearfix>.pdp-main>div.wrapper-product-details",
    	"containerAttr": "text",
    	"name": ".wrapper-product-details>.product-col-2>h1.product-name",
    	"nameAttr": "text",
    	"details": ".pd-expandable>.product-description",
    	"detailsAttr": "text",
    	"originalPrice": ".price-standard>span>span.price-value",
    	"originalPriceAttr": "text",
    	"price": ".priceDisplay>span>span.price-value",
    	"priceAttr": "text",
    	"colors": ".swatches>li>a.swatchanchor",
    	"colorsAttr": "href",
    	"colorsImages": ".swatches>li>a.swatchanchor",
    	"colorsImagesAttr": "style",
    	"colorsNames": ".swatches>li>a.swatchanchor",
    	"colorsNamesAttr": "title",
    	"swatches": ".thumb>.thumbnail-link>img.productthumbnail",
    	"swatchesAttr": "src",
    	"sizes": ".size-sel option",
    	"sizesAttr": "text"
    },
    'Burberry': {
    	"url": "http://us.burberry.com/the-sandringham-short-heritage-trench-coat-p39066871",
    	"id": "bu",
    	"date": "Sun Jun 15 09:17:28 2014",
    	"details": ".ctg-accordion-content-inner>ul",
    	"detailsAttr": "text",
    	"price": ".price>.price-info>span.price-amount",
    	"priceAttr": "text",
    	"colorsImages": ".value>img",
    	"colorsImagesAttr": "src",
    	"swatches": ".product-media-set>.product-image>img",
    	"swatchesAttr": "src",
    	"sizes": ".size-set>.size>span.-radio-span",
    	"sizesAttr": "text"
    },
    'Charles Tyrwhitt': {
    	"url": "http://www.ctshirts.com/men%27s-shirts/view-all/Royal-gingham-check-slim-fit-shirt?q=usddefault||fc090ryl|||||407,||||||||",
    	"id": "ct",
    	"date": "Sun Jun 15 09:22:37 2014",
    	"name": "h1",
    	"nameAttr": "text",
    	"details": ".tabbed>.mod",
    	"detailsAttr": "text",
    	"originalPrice": ".double>.price>span",
    	"originalPriceAttr": "text",
    	"price": ".submit>.double>strong.price",
    	"priceAttr": "text",
    	"promotion": ".double>div>img.offer",
    	"promotionAttr": "alt",
    	"swatches": "#prod_thumbs_scrollbox img",
    	"swatchesAttr": "src",
    	"sizes": "#collar_size_selected option",
    	"sizesAttr": "text"
    },
    'Chicos': {
    	"url": "http://www.chicos.com/store/browse/product.jsp?maxRec=51&pageId=1&productId=570109226&viewAll=&prd=Black+Label+Mixed+Print+Dress&subCatId=&color=&fromSearch=&inSeam=&posId=10&catId=cat40004&cat=Dresses++Skirts&onSale=&colorFamily=&maxPg=4&size=",
    	"id": "ch",
    	"date": "Sun Jun 15 09:25:10 2014",
    	"name": "div>div>h1",
    	"nameAttr": "text",
    	"details": "#product-description",
    	"detailsAttr": "text",
    	"price": "div>div>span.regular-price",
    	"priceAttr": "text",
    	"colors": "div>.skuGroup>select.color-menu>option",
    	"colorsAttr": "text",
    	"swatches": "#zoomThumbnails img",
    	"swatchesAttr": "src",
    	"sizes": "div>.skuGroup>select.size-menu>option",
    	"sizesAttr": "text"
    },
    'Cusp': {
    	"url": "http://www.cusp.com/Cooper-Ella-Alana-Printed-Open-Back-Tee-Tops/prod11690234_cat2280017__/p.prod?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat2280017%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod11690234&cmCat=product",
    	"id": "cu",
    	"date": "Sun Jun 15 09:28:36 2014",
    	"name": "div>.details>h1",
    	"nameAttr": "text",
    	"details": "div>.productCutline>h2",
    	"detailsAttr": "text",
    	"price": ".lineItemData>.lineItemInfo>span",
    	"priceAttr": "text",
    	"swatches": "ul>li>img.alt-shot",
    	"swatchesAttr": "src"
    },
    'Dillards': {
    	"url": "http://www.dillards.com/product/Gianni-Bini-Larue-CrochetInset-Maxi-Dress_301_-1_301_504526125?df=04259085_zi_ivory&scrollTop=0",
    	"id": "di",
    	"date": "Sun Jun 15 09:31:43 2014",
    	"name": ".bundle>div>h1",
    	"nameAttr": "text",
    	"details": "#description",
    	"detailsAttr": "text",
    	"price": "#price",
    	"priceAttr": "text",
    	"colorsImages": ".swatches>li>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".swatches>li>img",
    	"colorsNamesAttr": "class",
    	"sizes": ".bundle-item>div>select.Size_dd>option",
    	"sizesAttr": "text"
    },
    'Forever21': {
    	"url": "http://www.forever21.com/Product/Product.aspx?BR=f21&Category=dress&ProductID=2000104408&VariantID=",
    	"id": "fo",
    	"date": "Sun Jun 15 09:37:50 2014",
    	"name": "div>span>h1.product-title",
    	"nameAttr": "text",
    	"details": ".simpleTabs>.simpleTabsContent>span.productFontColor",
    	"detailsAttr": "text",
    	"price": "span>span>p.product-price",
    	"priceAttr": "text",
    	"colorsNames": "td>div>select.input:first>option",
    	"colorsNamesAttr": "text",
    	"sizes": "td>div>select.input:last>option",
    	"sizesAttr": "text"
    },
    'Free People': {
    	"url": "http://www.freepeople.com/clothes-dresses/emily-slip/_/PRODUCTOPTIONIDS/BEE1C344-4601-4985-97DB-EB5BCFE2AD06/",
    	"id": "fp",
    	"date": "Sun Jun 15 09:42:12 2014",
    	"name": ".title-band>.metadata>p",
    	"nameAttr": "text",
    	"summary": ".product-translation-content>.content>div.long-desc",
    	"summaryAttr": "text",
    	"details": ".product-translation-content>.content>div.care-desc",
    	"detailsAttr": "text",
    	"price": ".primary>.price",
    	"priceAttr": "text",
    	"swatches": ".alternates>ul>li>a>img",
    	"swatchesAttr": "src",
    	"sizes": ".instock>.option>span",
    	"sizesAttr": "text"
    },
    'H&M': {
    	"url": "http://www.hm.com/us/product/19356?article=19356-A",
    	"id": "hm",
    	"date": "Sun Jun 15 09:46:11 2014",
    	"details": "form>.description>p",
    	"detailsAttr": "text",
    	"price": "h1>.price>span",
    	"priceAttr": "text",
    	"colorsNames": "#options-articles li",
    	"colorsNamesAttr": "text",
    	"swatches": "#product-thumbs img",
    	"swatchesAttr": "src",
    	"sizes": "#options-variants a>span",
    	"sizesAttr": "text"
    },
    'Hollister': {
    	"url": "http://www.hollisterco.com/shop/us/bettys-sleeveless-fashion-tops/balboa-island-tank-2622096_02",
    	"id": "ho",
    	"date": "Sun Jun 15 09:50:52 2014",
    	"name": ".product-form>.product-title>h1.name",
    	"nameAttr": "text",
    	"originalPrice": ".info>.price>h4.list-price",
    	"originalPriceAttr": "text",
    	"price": ".info>.price>h4.offer-price",
    	"priceAttr": "text",
    	"promotionTwo": ".genericESpot>span>a.legal",
    	"promotionTwoAttr": "text",
    	"colors": "ul>.swatch>a.swatch-link",
    	"colorsAttr": "href",
    	"colorsImages": "ul>.swatch>a.swatch-link",
    	"colorsImagesAttr": "style",
    	"colorsNames": "ul>.swatch>a.swatch-link",
    	"colorsNamesAttr": "title",
    	"swatches": ".thumbnails>.thumbnail-product>img",
    	"swatchesAttr": "src",
    	"sizes": ".size .dk_container ul>li",
    	"sizesAttr": "text"
    },
    'Intermix': {
    	"url": "http://www.intermixonline.com/product/veronica+beard+zipper+detailed+leather-scuba+top.do?sortby=ourPicks&CurrentCat=109564",
    	"id": "i",
    	"date": "Sun Jun 15 09:53:37 2014",
    	"container": ".bodyContent>div>div.pdpTop",
    	"name": ".pdpRight>.itemtablebg>div.productName",
    	"nameAttr": "text",
    	"details": ".detailtext",
    	"detailsAttr": "text",
    	"price": ".detailprice>span>span",
    	"priceAttr": "text",
    	"colorsImages": ".itemtablebg>div>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".itemtablebg>div>img",
    	"colorsNamesAttr": "title",
    	"swatches": ".altViews>li>img",
    	"swatchesAttr": "src",
    	"sizes": ".pdpOption>.rowRight>span",
    	"sizesAttr": "text"
    },
    'J.Crew': {
    	"url": "https://www.jcrew.com/womens_category/dresses/Day/PRDOVR~A6556/A6556.jsp",
    	"id": "jc",
    	"date": "Sun Jun 15 09:53:37 2014",
    	"name": "h1",
    	"nameAttr": "text",
    	"details": "#prodDtlBody",
    	"detailsAttr": "text",
    	"swatches": "img.product-detail-images",
    	"swatchesAttr": "data-imgurl",
    	"sizes": ".size-box",
    	"sizesAttr": "text"
    },
    'J.Jill': {
    	"url": "http://www.jjill.com/jjillonline/product/itempage.aspx?item=720357&rPFID=40&h=W&sk=W&BID=481581686",
    	"id": "jj",
    	"date": "Sun Jun 15 10:02:38 2014",
    	"name": "div>h1>span.Style2B",
    	"nameAttr": "text",
    	"details": "div>div>span.Style5A",
    	"detailsAttr": "text",
    	"price": "td>span>span.price",
    	"priceAttr": "text",
    	"colorsImages": "td>.divOuterColorChip>img",
    	"colorsImagesAttr": "src",
    	"swatches": "tr>td>img.alt-img",
    	"swatchesAttr": "src",
    	"sizes": "td>.divOuterSizeChip>div.divInnerSizeChip",
    	"sizesAttr": "text"
    },
    'JCPenney': {
    	"url": "http://www.jcpenney.com/mens-clothing/haggar-work-to-weekend-no-iron-flat-front-pants/prod.jump?ppId=158cb2c&catId=cat100250021&deptId=dept20000014&&colorizedImg=DP0411201417094449M.tif",
    	"id": "jp",
    	"date": "Sun Jun 15 10:33:24 2014",
    	"name": ".flt_wdt>.pdp_details>h1",
    	"nameAttr": "text",
    	"details": ".pdp_brand_desc_info",
    	"detailsAttr": "text",
    	"originalPrice": ".ppPriceDetails>.pp_page_price>a.def_cur",
    	"originalPriceAttr": "text",
    	"price": ".ppPriceDetails>.gallery_page_price>a.def_cur",
    	"priceAttr": "text",
    	"colors": ".flt_lft>.small_swatches>li>a",
    	"colorsAttr": "href",
    	"colorsImages": ".flt_lft>.small_swatches>li>a>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".flt_lft>.small_swatches>li>a>img",
    	"colorsNamesAttr": "alt",
    	"swatches": ".alternateImagesDHTML>.alternateImageLink>img",
    	"swatchesAttr": "src",
    	"sizes": "#waist >a",
    	"sizesAttr": "text"
    },
    'Kate Spade': {
    	"url": "http://www.katespade.com/chambray-blaire-dress/NJMU3732,en_US,pd.html?dwvar_NJMU3732_color=446&cgid=ks-clothing-dresses#start=2&cgid=ks-clothing-dresses",
    	"id": "ks",
    	"date": "Sun Jun 15 10:35:08 2014",
    	"name": ".product-col-2>div>h1.product-name",
    	"nameAttr": "text",
    	"details": ".product-tabs>.tabs-container>div.tab-content",
    	"detailsAttr": "text",
    	"price": "div>.product-price>span.price-sales",
    	"priceAttr": "text",
    	"colors": ".selected>.swatchanchor",
    	"colorsAttr": "href",
    	"colorsImages": ".selected>.swatchanchor>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".selected>.swatchanchor",
    	"colorsNamesAttr": "title",
    	"swatches": ".thumb>.thumbnail-link>img",
    	"swatchesAttr": "src",
    	"sizes": ".swatches>.emptyswatch>a.swatchanchor",
    	"sizesAttr": "text"
    },
    'Kohls': {
    	"url": "http://www.kohls.com/product/prd-1534280/nike-striped-dri-fit-performance-polo-men.jsp",
    	"id": "ko",
    	"date": "Sun Jun 15 10:37:31 2014",
    	"name": ".column_content>.column_content_container>h1.productTitleName",
    	"nameAttr": "text",
    	"details": ".product-cd>div>div.prod_description1",
    	"detailsAttr": "text",
    	"originalPrice": ".price-holder>.multiple-price>div.original",
    	"originalPriceAttr": "text",
    	"price": ".price-holder>.multiple-price>div.sale",
    	"priceAttr": "text",
    	"swatches": ".hor-carousel>ul>li>a>img",
    	"swatchesAttr": "src",
    	"sizes": ".size-waist>.size_off_left1>a.size_off1",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    'Loft': {
    	"url": "http://www.loft.com/crossover-tank-dress/329520?colorExplode=false&skuId=16643864&catid=catl000013&productPageType=fullPriceProducts&defaultColor=4632",
    	"id": "l",
    	"date": "Sun Jun 15 10:42:27 2014",
    	"name": "div>div>h1",
    	"nameAttr": "text",
    	"details": "div>.gu>p",
    	"detailsAttr": "text",
    	"price": ".sale>.Oprice>span",
    	"priceAttr": "text",
    	"colorsImages": "#color-picker li",
    	"colorsImagesAttr": "style",
    	"colorsNames": "#color-picker li>a",
    	"colorsNamesAttr": "title",
    	"swatches": ".RICHFXViewerContainer img.RICHFXColorChangeView",
    	"swatchesAttr": "src",
    	"sizes": ".multiSelect li",
    	"sizesAttr": "id"
    },
    'Lord And Taylor': {
    	"url": "http://www.lordandtaylor.com/webapp/wcs/stores/servlet/en/lord-and-taylor/mens/Mens-Outerwear/koen-zip-thru-jacket",
    	"id": "ll",
    	"date": "Sun Jun 15 10:49:53 2014",
    	"name": "div>.detial_right>h2.detial",
    	"nameAttr": "text",
    	"details": "#detial_main_content",
    	"detailsAttr": "text",
    	"originalPrice": ".woaicss_con>.detial_pric>span.ora",
    	"originalPriceAttr": "text",
    	"price": ".woaicss_con>.detial_pric>span.sale",
    	"priceAttr": "text",
    	"colorsImages": ".cur>.color_swatch_selected>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".cur>.color_swatch_selected>img",
    	"colorsNamesAttr": "alt",
    	"swatches": ".pic-container>ul>li>img[src]",
    	"swatchesAttr": "src",
    	"sizes": ".detail_size li>a",
    	"sizesAttr": "text"
    },
    'Lululemon': {
    	"url": "http://shop.lululemon.com/products/clothes-accessories/mens-pants-gym/Kung-Fu-Pant-Tall?cc=7237&skuId=3526228&catId=mens-pants-gym",
    	"id": "lll",
    	"date": "Sun Jun 15 10:54:49 2014",
    	"name": ".subContainer>h1>div.OneLinkNoTx",
    	"nameAttr": "text",
    	"details": "#productImage",
    	"detailsAttr": "text",
    	"price": ".priceSku>div>span.amount",
    	"priceAttr": "text",
    	"colorsImages": ".pickColor>img.unselected",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".pickColor>img.unselected",
    	"colorsNamesAttr": "alt",
    	"swatches": "li>.pdpThumb>img",
    	"swatchesAttr": "src",
    	"sizes": "ul>li>a.pickSize",
    	"sizesAttr": "text"
    },
    'Macys': {
    	"url": "http://www1.macys.com/shop/product/alfani-spectrum-slim-fit-dress-shirt?ID=1285068&CategoryID=20635#fn=sp%3D1%26spc%3D1152%26ruleId%3D78%26slotId%3D2",
    	"id": "ma",
    	"date": "Sun Jun 15 11:01:52 2014",
    	"name": "#productDescription h1.productTitle",
    	"nameAttr": "text",
    	"details": "#prdDesc",
    	"detailsAttr": "text",
    	"price": ".standardProdPricingGroup",
    	"priceAttr": "text",
    	"promotion": "div>.badge>span.badgePromoCode:first",
    	"promotionAttr": "text",
    	"promotionTwo": ".freeShipping",
    	"promotionTwoAttr": "text",
    	"colorsImages": ".colors li>img.colorSwatch",
    	"colorsImagesAttr": "style",
    	"colorsNames": ".colors li>img.colorSwatch",
    	"colorsNamesAttr": "title",
    	"swatches": "#zoomViewerContainer img",
    	"swatchesAttr": "src"
    }
    ,
    'Madewell': {
    	"url": "https://www.madewell.com/madewell_category/DRESSES/waistdefineddresses/PRDOVR~A8495/A8495.jsp?color_name=red-snapper",
    	"id": "m",
    	"date": "Sun Jun 15 11:01:52 2014",
    	"name": ".description h1",
    	"nameAttr": "text",
    	"details": "#prodDtlBody",
    	"detailsAttr": "text",
    	"originalPrice": ".price-soldout",
    	"originalPriceAttr": "text",
    	"price": ".selected-color-price",
    	"priceAttr": "text",
    	"promotionTwo": ".product-detail-promotext",
    	"promotionTwoAttr": "text",
    	"colorsImages": ".color-box img",
    	"colorsImagesAttr": "src",
    	"sizes": ".size-box",
    	"sizesAttr": "text",
    	"swatches": "img.product-detail-images",
    	"swatchesAttr": "data-imgurl"
    },
    'Michael Kors': {
    	"url": "http://www.michaelkors.com/p/MICHAEL-Michael-Kors-MICHAEL-Michael-Kors-Drawstring-Side-Ruched-Dress-DRESSES/prod25840017_cat18007_cat102_/?index=0&cmCat=cat000000cat102cat18007&isEditorial=false",
    	"id": "mk",
    	"date": "Sun Jun 15 11:14:22 2014",
    	"name": "tr>.Black12VB>h1",
    	"nameAttr": "text",
    	"details": ".productCutline>ul",
    	"detailsAttr": "text",
    	"colorsNames": "select.variationDD:last>option",
    	"colorsNamesAttr": "text",
    	"swatches": "tr>td>img.zoomProductThumbnail",
    	"swatchesAttr": "src",
    	"sizes": "select.variationDD:first>option",
    	"sizesAttr": "text"
    },
    'Neiman Marcus': {
    	"url": "http://www.neimanmarcus.com/Victoria-Beckham-Denim-Sleeveless-Eyelet-Overlap-Skirt-Dress-Dresses/prod166260046_cat43810733__/p.prod?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat43810733%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod166260046&cmCat=product",
    	"id": "nm",
    	"date": "Sun Jun 15 11:16:59 2014",
    	"name": "div>.details>h1",
    	"nameAttr": "text",
    	"details": ".moreDetail .suiteProducts:first",
    	"detailsAttr": "text",
    	"price": ".lineItemData>.lineItemInfo>span",
    	"priceAttr": "text",
    	"promotionTwo": "div>.sr_proDetDiv>div.sr_messaging",
    	"promotionTwoAttr": "text",
    	"swatches": "ul>li>img.alt-shot",
    	"swatchesAttr": "src",
    	"sizes": ".lineItem>.lineItemOptionSelect>select.variationDD:first>option",
    	"sizesAttr": "text"
    },
    'Nike': {
    	"url": "http://store.nike.com/us/en_us/pd/dri-fit-touch-tailwind-short-sleeve-crew-running-shirt/pid-926990/pgid-926984",
    	"id": "ni",
    	"date": "Sun Jun 15 11:20:16 2014",
    	"name": ".exp-pdp-content-container>.exp-product-header>h1.exp-product-title",
    	"nameAttr": "text",
    	"summary": ".exp-product-header>.exp-product-notifyCustomMessage>p.oeContent",
    	"summaryAttr": "text",
    	"details": ".pi-tier3>.pi-pdpmainbody",
    	"detailsAttr": "text",
    	"price": "span>.exp-pdp-product-price>span.exp-pdp-local-price",
    	"priceAttr": "text",
    	"colorsImages": ".color-chip-container>li>a>img",
    	"colorsImagesAttr": "src",
    	"swatches": ".exp-pdp-alt-images-viewport>.exp-pdp-alt-images-carousel>li.exp-pdp-image-container>img",
    	"swatchesAttr": "src",
    	"sizes": ".exp-pdp-size-dropdown-container>.nsg-form--drop-down--option-container>li.nsg-form--drop-down--option",
    	"sizesAttr": "text"
    },
    'Nordstrom': {
    	"url": "http://shop.nordstrom.com/s/nordstrom-smartcare-wrinkle-free-trim-fit-dress-shirt/3436249?origin=category-personalizedsort&contextualcategoryid=0&fashionColor=Green-+Ash&resultback=479&cm_sp=personalizedsort-_-browseresults-_-1_1_A",
    	"id": "n",
    	"date": "Sun Jun 15 11:26:11 2014",
    	"name": "div>section>h1",
    	"nameAttr": "text",
    	"summary": "div>ul>li.info:first",
    	"summaryAttr": "text",
    	"details": "#details-and-care div:first",
    	"detailsAttr": "text",
    	"price": ".item-price-rows>.item-price>span:first",
    	"priceAttr": "text",
    	"promotionTwo": ".item-price-rows>td>span.item-free-shipping:first",
    	"promotionTwoAttr": "text",
    	"colorsImages": "#color-swatch li ",
    	"colorsImagesAttr": "data-img-gigantic-filename",
    	"colorsNames": "#color-swatch li ",
    	"colorsNamesAttr": "title",
    	"swatches": ".image-thumbs>.image-thumb>button",
    	"swatchesAttr": "data-img-gigantic-filename",
    	"sizes": "ul>.button>button.option-label",
    	"sizesAttr": "value"
    },
    'NY and Company': {
    	"url": "http://www.nyandcompany.com/nyco/prod/tops/clip-dot-raglan-sleeve-blouse/A-prod970011/#.U527SajXdB5",
    	"id": "ny",
    	"date": "Sun Jun 15 11:30:03 2014",
    	"name": ".row>.colpdp>h1",
    	"nameAttr": "text",
    	"details": ".colpdp>.pricingdetails>li.content-container",
    	"detailsAttr": "text",
    	"price": ".pricingdetails>li>p.price",
    	"priceAttr": "text",
    	"promotion": ".pricingdetails>li>p.micro_red",
    	"promotionAttr": "text",
    	"colors": ".border>a>img",
    	"colorsAttr": "src",
    	"colorsNames": ".border>a>img",
    	"colorsNamesAttr": "alt",
    	"swatches": ".s7swatches .s7thumb",
    	"swatchesAttr": "style",
    	"sizes": "#prod_prodsize>option",
    	"sizesAttr": "text"
    },
    'Saks Fifth Avenue': {
    	"url": "http://www.saksfifthavenue.com/main/ProductDetail.jsp?FOLDER%3C%3Efolder_id=2534374306418059&PRODUCT%3C%3Eprd_id=845524446692183&R=628708342392&P_name=ML+Monique+Lhuillier&N=306418059&bmUID=kquAbCj",
    	"id": "sak",
    	"date": "Sun Jun 15 11:34:31 2014",
    	"name": ".pdp-reskin-right-container>.pdp-reskin-general-info>h1.brand",
    	"nameAttr": "text",
    	"summary": ".pdp-reskin-right-container>.pdp-reskin-general-info>h2.description",
    	"summaryAttr": "text",
    	"details": "tr>td>span.pdp-reskin-detail-content",
    	"detailsAttr": "text",
    	"price": ".clearfix>.reskin-regular-price-container>span.product-price",
    	"priceAttr": "text",
    	"sizes": ".dropdown-helper>.js-saks-sku-dropdown:first>option",
    	"sizesAttr": "text"
    },
    'Target': {
    	"url": "http://www.target.com/p/men-s-batman-shield-logo-graphic-tee-black/-/A-15279831#prodSlot=_1_2",
    	"id": "t",
    	"date": "Sun Jun 15 11:38:05 2014",
    	"name": ".primaryInfo>.product-name>span.fn",
    	"nameAttr": "text",
    	"details": ".tabs-section>.content-set>div.content:first",
    	"detailsAttr": "text",
    	"price": ".offerprice>.price>span.offerPrice",
    	"priceAttr": "text",
    	"promotionTwo": ".testList>.checkmark>span.red:first",
    	"promotionTwoAttr": "text",
    	"swatches": "#carouselContainer .imgAnchor img",
    	"swatchesAttr": "src",
    	"sizes": ".no-summary>.sizeSelection>select.sizeSelection>option",
    	"sizesAttr": "text"
    },
    'Top Shop': {
    	"url": "http://us.topshop.com/en/tsus/product/clothing-70483/dresses-70497/simple-shift-dress-by-the-wh-3048679?bi=1&ps=200",
    	"id": "ts",
    	"date": "Sun Jun 15 11:40:58 2014",
    	"name": ".sp_10>.tab>h1",
    	"nameAttr": "text",
    	"summary": ".sp_10>.tab>p.product_description",
    	"summaryAttr": "text",
    	"price": ".product_summary>.product_price>span",
    	"priceAttr": "text",
    	"swatches": "a.image_thumb img",
    	"swatchesAttr": "src",
    	"sizes": ".field>.product_size_grid>li",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    'Tory Burch': {
    	"url": "http://www.toryburch.com/rimona-dress/31141465.html?dwvar_31141465_color=411&start=2&cgid=clothing-dresses",
    	"id": "tb",
    	"date": "Sun Jun 15 11:43:34 2014",
    	"name": ".clearfix>.productdetailcolumn>h1.productname",
    	"nameAttr": "text",
    	"details": ".productdetailcolumn>.collapsibleDetails",
    	"detailsAttr": "text",
    	"price": ".pricing>.price>div.salesprice",
    	"priceAttr": "text",
    	"colors": ".swatchanchor",
    	"colorsAttr": "name",
    	"colorsImages": ".swatchanchor>img.swatchimage",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".swatchanchor>img.swatchimage",
    	"colorsNamesAttr": "alt",
    	"swatches": ".alternateImages a>img",
    	"swatchesAttr": "src",
    	"sizes": ".variationattribute>.dropdownselect>select>option",
    	"sizesAttr": "text"
    },
    'Urban Outfitters': {
    	"url": "http://www.urbanoutfitters.com/urban/catalog/productdetail.jsp?id=26986208&parentid=M_APP_TEESSHORT",
    	"id": "uo",
    	"date": "Sun Jun 15 11:47:32 2014",
    	"name": "#prodTitle",
    	"nameAttr": "text",
    	"details": ".detailContent>div:first",
    	"detailsAttr": "text",
    	"price": ".default>.price>span",
    	"priceAttr": "text",
    	"promotionTwo": "#freeShip",
    	"promotionTwoAttr": "text",
    	"colorsImages": ".swatches img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".swatches img",
    	"colorsNamesAttr": "alt",
    	"swatches": "a>.thumb>img.single-product-thumbnail",
    	"swatchesAttr": "src",
    	"sizes": ".size>.sizes>a",
    	"sizesAttr": "text"
    },
    'Zara': {
    	"url": "http://www.zara.com/us/en/man/jackets/jacket-with-faux-leather-collar-c586542p2005187.html",
    	"id": "z",
    	"date": "Sun Jun 15 11:52:55 2014",
    	"name": ".right>header>h1",
    	"nameAttr": "text",
    	"details": ".product-info ul:first",
    	"detailsAttr": "text",
    	"price": ".right>.price>span.price",
    	"priceAttr": "text",
    	"promotionTwo": ".line>.category-content",
    	"promotionTwoAttr": "text",
    	"colorsImages": ".colorEl>.imgCont>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".colorEl>.imgCont>span",
    	"colorsNamesAttr": "text",
    	"swatches": ".media-wrap>.disabled-anchor>img.image-big",
    	"swatchesAttr": "data-src",
    	"sizes": "tbody>.product-size>td.size-name",
    	"sizesAttr": "text"
    },    
    'Lands End': {
    	"url": "http://www.landsend.com/products/mens-traditional-fit-solid-no-iron-supima-pinpoint-buttondown-dress-shirt/id_242762",
    	"id": "le",
    	"date": "Sun Jun 15 12:47:41 2014",
    	"name": ".line>.unit>h1.pp-product-name",
    	"nameAttr": "text",
    	"details": ".unit>.pp-product-description",
    	"detailsAttr": "text",
    	"price": ".unit>.pp-summary-price>span",
    	"priceAttr": "text",
    	"promotion": ".unit>.pp-promotion-wrapper>p.pp-promotion",
    	"promotionAttr": "text",
    	"colorsImages": ".pp-swatch-selector ul>li>a",
    	"colorsImagesAttr": "style",
    	"colorsNames": ".pp-swatch-selector ul>li>a",
    	"colorsNamesAttr": "text",
    	"swatches": ".pp-image-viewer-gallery:first>li>a>img.default",
    	"swatchesAttr": "src",
    	"sizes": ".pp-wide>li>a.pp-available",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    'Calvin Klein': {
    	"url": "http://www.calvinklein.com/webapp/wcs/stores/servlet/SearchDisplay?Color=WATER+MILL&showResultsPage=true&langId=-1&beginIndex=0&productId=226316&sType=SimpleSearch&pageSize=16&pageView=image&catalogId=12101&errorViewName=ProductDisplayErrorView&categoryId=48725&storeId=10751&viewAll=N&ddkey=http:en/ck/mens-dress-shirts/22054236",
    	"id": "ck",
    	"date": "Sun Jun 15 12:55:59 2014",
    	"name": ".span18>.left>span",
    	"nameAttr": "text",
    	"summary": ".description>.short-description>p.itemDescription",
    	"summaryAttr": "text",
    	"originalPrice": ".span18>div>span.price:first",
    	"originalPriceAttr": "text",
    	"price": ".span18>div>span.price:last",
    	"priceAttr": "text",
    	"promotion": ".span18>.prodPromoTagline>div.order_content",
    	"promotionAttr": "text",
    	"promotionTwo": ".sr_proDetDiv>.sr_messaging>b",
    	"promotionTwoAttr": "text",
    	"colors": ".active>.cloud-zoom-gallery",
    	"colorsAttr": "href",
    	"colorsImages": ".active>.cloud-zoom-gallery>img.imgSwatch",
    	"colorsImagesAttr": "data-src",
    	"colorsNames": ".active>.cloud-zoom-gallery>img.imgSwatch",
    	"colorsNamesAttr": "data-title",
    	"swatches": ".prodThumbnails>.cloud-zoom-gallery>img",
    	"swatchesAttr": "src",
    	"sizes": "#dk_container_sizeAttrValue .dk_options ul>li>a",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    'Vineyard Vines': {
    	"url": "http://www.vineyardvines.com/womens-dresses/whale-tail-jacquard-shift-dress/2Q0365,default,pd.html?dwvar_2Q0365_color=406&start=1&cgid=Womens-Dresses-Skirts",
    	"id": "vv",
    	"date": "Sun Jun 15 13:06:27 2014",
    	"name": ".productdetailcolumn>a>h1.productname",
    	"nameAttr": "text",
    	"summary": "#pdescription",
    	"summaryAttr": "text",
    	"details": "#details",
    	"detailsAttr": "text",
    	"price": ".pricing>.price>div.salesprice",
    	"priceAttr": "text",
    	"colorsImages": ".swatches.color>.swatchesdisplay li",
    	"colorsImagesAttr": "style",
    	"colorsNames": ".swatches.color>.swatchesdisplay li",
    	"colorsNamesAttr": "text",
    	"sizes": ".swatches.size>.swatchesdisplay>.emptyswatch:not(.unselectable)>a.swatchanchor",
    	"sizesAttr": "text"
    },
    'Rag Bone': {
    	"url": "http://www.rag-bone.com/Caleb_Henley/pd/c/734/np/734/p/6465.html",
    	"id": "rb",
    	"date": "Sun Jun 15 13:14:18 2014",
    	"name": "div>.product-details-area>p.prod-name",
    	"nameAttr": "text",
    	"details": "div>.detail-section>div.text-col",
    	"detailsAttr": "text",
    	"price": ".prod-price>span>span",
    	"priceAttr": "text",
    	"promotionTwo": "#free-shipping-button",
    	"promotionTwoAttr": "text",
    	"colorsImages": ".selectColor img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".selectColor img",
    	"colorsNamesAttr": "title",
    	"swatches": "li>.thumb>img.thumb",
    	"swatchesAttr": "src",
    	"sizes": "#ContentPlaceHolder1_ProductSizes option",
    	"sizesAttr": "text"
    },
    'Marc Jacobs': {
    	"url": "http://www.marcjacobs.com/marc-jacobs/mens/ready-to-wear/s84dl0181/brooks-plaid-long-sleeved-shirt?sort=",
    	"id": "mj",
    	"date": "Sun Jun 15 13:21:14 2014",
    	"name": ".partial-product_detail>.partial-product_info>h1.product-title",
    	"nameAttr": "text",
    	"details": ".details-container>.product-description>p",
    	"detailsAttr": "text",
    	"price": "div>.product-price>span",
    	"priceAttr": "text",
    	"colors": ".swatch-set>.swatch>a.swatch-a",
    	"colorsAttr": "href",
    	"colorsImages": ".swatch-set>.swatch>.swatch-img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".swatch-set>.swatch>a.swatch-a",
    	"colorsNamesAttr": "title",
    	"swatches": ".variant-thumbnail>.variant-thumbnail-a>img.variant-thumbnail-img",
    	"swatchesAttr": "src",
    	"sizes": ".-field>.ctg-field-select>select.select-size>option",
    	"sizesAttr": "text"
    },
    'Hermes': {
    	"url": "http://usa.hermes.com/man/ready-to-wear/active-wear/hooded-zip-sweater/configurable-product-437290ha-58763.html",
    	"id": "her",
    	"date": "Sun Jun 15 13:26:19 2014",
    	"name": ".offer-description>.head6>span",
    	"nameAttr": "text",
    	"summary": ".right-col>.offer-description>p:first",
    	"summaryAttr": "text",
    	"price": ".price-box>.regular-price>span.price",
    	"priceAttr": "text",
    	"colorsImages": "ul>.super-attribute-icons>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": "ul>.super-attribute-icons>img",
    	"colorsNamesAttr": "alt",
    	"sizes": "ul>.legend10>p",
    	"sizesAttr": "text"
    },
    'Canada Goose': {
    	"url": "http://www.canada-goose.com/products-page/womens-arctic/victoria-parka",
    	"id": "cg",
    	"date": "Sun Jun 15 13:39:33 2014",
    	"name": "figcaption>section>h2",
    	"nameAttr": "text",
    	"summary": "figcaption>article>p",
    	"summaryAttr": "text",
    	"details": "#product-point-list",
    	"detailsAttr": "text",
    	"colorsImages": "section>.product-color",
    	"colorsImagesAttr": "style",
    	"colorsNames": "section>.product-color",
    	"colorsNamesAttr": "text"
    },
    'Balenciaga': {
    	"url": "http://www.balenciaga.com/us/jacket_cod41458090ek.html",
    	"id": "bal",
    	"date": "Sun Jun 15 13:46:45 2014",
    	"name": "div>div>h1",
    	"nameAttr": "text",
    	"summary": "div>div>h2:first",
    	"summaryAttr": "text",
    	"details": "#description_pane",
    	"detailsAttr": "text",
    	"price": "div>.newprice>span.priceValue",
    	"priceAttr": "text",
    	"colorsImages": "#itemColors li img",
    	"colorsImagesAttr": "src",
    	"colorsNames": "#itemColors li",
    	"colorsNamesAttr": "title",
    	"swatches": "#alternateList li>.inner>img",
    	"swatchesAttr": "src",
    	"sizes": ".selectionLists>.itemSize>span",
    	"sizesAttr": "text"
    },
    'Armani': {
    	"url": "http://www.armani.com/us/armanicollezioni/sleeveless-top_cod37522138uu.html",
    	"id": "arm",
    	"date": "Sun Jun 15 13:54:56 2014",
    	"name": ".item>.descriptionContainer>h2.productName",
    	"nameAttr": "text",
    	"details": ".tabs div.descriptionContent",
    	"detailsAttr": "text",
    	"originalPrice": ".itemBoxPrice>.oldprice>span.priceValue",
    	"originalPriceAttr": "text",
    	"price": ".itemBoxPrice>.newprice>span.priceValue",
    	"priceAttr": "text",
    	"colorsNames": ".colorSizeContainer>.armaniForms:first>.Colors>li>a",
    	"colorsNamesAttr": "text",
    	"swatches": ".thumbs>.thumbElement>img.thumb",
    	"swatchesAttr": "src",
    	"sizes": ".colorSizeContainer>.armaniForms:last>.SizeW>li>a",
    	"sizesAttr": "text"
    },
    '7 For All Mankind': {
    	"url": "http://www.7forallmankind.com/Slim_Illusion_Roll_Up_Short_in_Faded_Blue_3_inseam/pd/np/4900/p/8923.html",
    	"id": "fam",
    	"date": "Sun Jun 15 14:08:35 2014",
    	"name": ".product-detail-white>div>h2",
    	"nameAttr": "text",
    	"details": "#accordion",
    	"detailsAttr": "text",
    	"originalPrice": ".saleprice>font>strike",
    	"originalPriceAttr": "text",
    	"price": ".price>span>span",
    	"priceAttr": "text",
    	"swatches": ".prod-thumbnails li>a>img",
    	"swatchesAttr": "src",
    	"sizes": "li>span>a.sizeButton",
    	"sizesAttr": "text"
    },
    'Van Heusen': {
    	"url": "http://vanheusen.com/products/sky_check_long_sleeve_button-down/",
    	"id": "vh",
    	"date": "Sun Jun 15 16:24:35 2014",
    	"name": ".productDescContainer>.productcontent>h6",
    	"nameAttr": "text",
    	"summary": ".productDetailsContainer>.productDescContainer>div.productcontent",
    	"summaryAttr": "text"
    },
    'Under Armour': {
    	"url": "http://www.underarmour.com/shop/us/en/1242802/pid1242802-002",
    	"id": "ua",
    	"date": "Sun Jun 15 16:36:30 2014",
    	"name": ".buy-panel>.buy-panel-product-name",
    	"nameAttr": "text",
    	"details": ".buy-panel>.buy-elements>div.product-info",
    	"detailsAttr": "text",
    	"price": "span>.price>span.money",
    	"priceAttr": "text",
    	"colorsImages": ".color-chips>.chip-wrap",
    	"colorsImagesAttr": "data-chipimage",
    	"colorsNames": ".color-chips>.chip-wrap",
    	"colorsNamesAttr": "title",
    	"swatches": ".zoom-carousel-container>.zoom-carousel-content>img.alt-view",
    	"swatchesAttr": "src",
    	"sizes": ".buy-elements>.size-selector>a.size",
    	"sizesAttr": "text"
    },
    'Ugg Australia': {
    	"url": "http://www.uggaustralia.com/women-apparel/sarasee/UA6155W.html?dwvar_UA6155W_color=CRM",
    	"id": "ugg",
    	"date": "Sun Jun 15 16:39:57 2014",
    	"name": ".pdp-main>.product-col-2>h1.product-name",
    	"nameAttr": "text",
    	"details": ".product-col-2>div>div.attribute",
    	"detailsAttr": "text",
    	"price": "div>.product-price>span.price-sales",
    	"priceAttr": "text",
    	"colors": ".swatches.Color a.swatchanchor",
    	"colorsAttr": "href",
    	"colorsImages": ".swatches.Color a.swatchanchor",
    	"colorsImagesAttr": "data-lgimg",
    	"colorsNames": ".swatches.Color a.swatchanchor",
    	"colorsNamesAttr": "text",
    	"swatches": ".thumb>.thumbnail-link>img.productthumbnail",
    	"swatchesAttr": "src",
    	"sizes": ".swatches.variationsize>.emptyswatch>a.swatchanchor",
    	"sizesAttr": "text"
    },
    'True Religion': {
    	"url": "http://www.truereligion.com/HAND_PICKED_LOGO_CREST_MENS_HOODIE/pd/c/5600/np/5600/p/11043.html",
    	"id": "tr",
    	"date": "Sun Jun 15 16:43:01 2014",
    	"name": ".col-5-12>.pdp-title>span",
    	"nameAttr": "text",
    	"details": ".size-selector>.accordion>dd.default",
    	"detailsAttr": "text",
    	"originalPrice": ".pdp-price>.price>span.line-through",
    	"originalPriceAttr": "text",
    	"price": ".pdp-price>.price>span.UnitCostSpanSalePrice",
    	"priceAttr": "text",
    	"swatches": "li>a>img",
    	"swatchesAttr": "src",
    	"sizes": ".sizes>span>a.availableSizeButton",
    	"sizesAttr": "text"
    },
    'Tommy Hilfiger': {
    	"url": "http://usa.tommy.com/shop/en/thb2cus/women/SWEATERS-WOMEN/7644674?Color=NAVY",
    	"id": "th",
    	"date": "Sun Jun 15 16:52:41 2014",
    	"name": ".span18>.catalog_link>span",
    	"nameAttr": "text",
    	"details": ".description>.expandable",
    	"detailsAttr": "text",
    	"promotionTwo": ".sr_tommy_free_ship>.text>strong",
    	"promotionTwoAttr": "text",
    	"colorsImages": ".productswatches .cloud-zoom-gallery>img.imgSwatch",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".productswatches .cloud-zoom-gallery>img.imgSwatch",
    	"colorsNamesAttr": "title",
    	"swatches": ".prodThumbnails>.cloud-zoom-gallery>img",
    	"swatchesAttr": "src",
    	"sizes": "#sizes >li.available",
    	"sizesAttr": "text"
    },
    'The North Face': {
    	"url": "http://www.thenorthface.com/catalog/sc-gear/mens-shirts-tops-filter-category-shirts-polos/men-8217-s-cool-horizon-polo.html?variationId=682&variationName=TNF%20RED",
    	"id": "tnf",
    	"date": "Sun Jun 15 16:59:16 2014",
    	"name": "ul>.productName>h1.heading",
    	"nameAttr": "text",
    	"summary": ".productConfiguration>ul>li.productPrice",
    	"summaryAttr": "text",
    	"details": "#details",
    	"detailsAttr": "text",
    	"price": ".productConfiguration>ul>li.productPrice",
    	"priceAttr": "text",
    	"colorsImages": ".swatch>span.innerBorder",
    	"colorsImagesAttr": "style",
    	"colorsNames": ".swatch>span.innerBorder",
    	"colorsNamesAttr": "text",
    	"swatches": ".alternateViews .jspPane>a>span>img",
    	"swatchesAttr": "src",
    	"sizes": ".productSize > a",
    	"sizesAttr": "text"
    },
    'REI': {
    	"url": "http://www.rei.com/product/873485/the-north-face-apex-elevation-jacket-mens-2013-closeout",
    	"id": "rei",
    	"date": "Sun Jun 15 17:08:20 2014",
    	"name": ".col5>div>h1.fn",
    	"nameAttr": "text",
    	"summary": ".cf>.priceDescription>h2.primaryProductDescription",
    	"summaryAttr": "text",
    	"details": ".tabArea1>ul",
    	"detailsAttr": "text",
    	"originalPrice": ".itemprice>.originalPrice>span",
    	"originalPriceAttr": "text",
    	"price": ".productState>.itemprice>li.salePrice",
    	"priceAttr": "text",
    	"promotionTwo": ".cf>div>p.productQualify",
    	"promotionTwoAttr": "text",
    	"swatches": "#productCarousel .imgSwatch",
    	"swatchesAttr": "lgimg",
    	"sizes": ".msgBox>.required>option",
    	"sizesAttr": "text"
    },
    'Ralph Lauren': {
    	"url": "http://www.ralphlauren.com/product/index.jsp?productId=32713796",
    	"id": "rl",
    	"date": "Sun Jun 15 17:13:32 2014",
    	"name": ".itemheadernew>.prodtitleLG>h1",
    	"nameAttr": "text",
    	"details": "div>.content>div.descpad",
    	"detailsAttr": "text",
    	"price": ".itemheadernew>.ProductPriceContainer>span.prodourprice",
    	"priceAttr": "text",
    	"colorsNames": ".colorHeader .dropDown li",
    	"colorsNamesAttr": "text",
    	"sizes": ".sizeHeader .dropDown li",
    	"sizesAttr": "text"
    },
    'Puma': {
    	"url": "http://www.shop.puma.com/Graphic-T-Shirt/pna893057,en_US,pd.html?cgid=22500&vid=#!i%3D1%26color%3D04%26size%3DUS_S",
    	"id": "pum",
    	"date": "Sun Jun 15 17:19:46 2014",
    	"name": ".product-name>div>h1",
    	"nameAttr": "text",
    	"details": ".extendedproduct>.infobox>div.ui-tabs-panel",
    	"detailsAttr": "text",
    	"price": ".pricing>.price>div.standardoneprice",
    	"priceAttr": "text",
    	"promotion": ".promotion>.promo_callout>div.promobox",
    	"promotionAttr": "text",
    	"colors": "li>.swatch>a.swatchanchor",
    	"colorsAttr": "href",
    	"colorsImages": "li>.swatch>a.swatchanchor",
    	"colorsImagesAttr": "style",
    	"colorsNames": "li>.swatch>a.swatchanchor",
    	"colorsNamesAttr": "title",
    	"sizes": ".sizeVariations>.selectricWrapper>.selectricItems li",
    	"sizesAttr": "text"
    },
    'Perry Ellis': {
    	"url": "http://www.perryellis.com/casual-shirts/short-sleeve-uneven-plaid-shirt/44MW7015PS.html?start=2&cgid=peshortsleevewovens&dwvar_44MW7015PS_color=010",
    	"id": "pe",
    	"date": "Sun Jun 15 17:28:10 2014",
    	"name": ".productdetailcolumn>.detailsblock>h1.productname",
    	"nameAttr": "text",
    	"details": ".productdetailcolumn>.product_tabs>div.ui-tabs-panel",
    	"detailsAttr": "text",
    	"price": ".pricing>.price>div.salesprice",
    	"priceAttr": "text",
    	"promotionTwo": ".bottombannercontainer>.pdp-banner>p",
    	"promotionTwoAttr": "text",
    	"colorsImages": ".swatches.color .swatchesdisplay li",
    	"colorsImagesAttr": "style",
    	"colorsNames": ".swatches.color .swatchesdisplay a.swatchanchor",
    	"colorsNamesAttr": "text",
    	"swatches": ".productdetailcolumn>.productthumbnails>img",
    	"swatchesAttr": "src",
    	"sizes": ".swatches.size .swatchesdisplay li",
    	"sizesAttr": "text"
    },
    'Oakley': {
    	"url": "http://www.oakley.com/products/charley-fleece-hoodie/471871-68G",
    	"id": "oak",
    	"date": "Sun Jun 15 17:34:28 2014",
    	"name": "div>.title>span.OneLinkNoTx",
    	"nameAttr": "text",
    	"summary": "#short_description",
    	"summaryAttr": "text",
    	"details": "#description",
    	"detailsAttr": "text",
    	"price": "#product_price",
    	"priceAttr": "text",
    	"promotionTwo": "li>.free_shipping>span.free_shipping_order_bar_free_shipping",
    	"promotionTwoAttr": "text",
    	"colors": ".sku_selector>.OneLinkNoTx",
    	"colorsAttr": "href",
    	"colorsNames": ".sku_selector>.OneLinkNoTx",
    	"colorsNamesAttr": "data-tealium-utag-custom-link-product_color",
    	"sizes": ".options>li>label.size_selector",
    	"sizesAttr": "text"
    },
    'Jockey': {
    	"url": "http://www.jockey.com/catalog/product/jockey-coral-stripes-swim-shorts",
    	"id": "joc",
    	"date": "Sun Jun 15 17:52:54 2014",
    	"name": "div>.ProductNameHeading>span",
    	"nameAttr": "text",
    	"details": "#ProdDesc",
    	"detailsAttr": "text",
    	"price": "div>.ProductPriceWrapper>span.ProductListPrice",
    	"priceAttr": "text",
    	"promotionTwo": ".sr_buynow>.sr_message>b",
    	"promotionTwoAttr": "text",
    	"colorsImages": "#ProductColors a.ColorSwatch",
    	"colorsImagesAttr": "style",
    	"colorsNames": "#ProductColors a.ColorSwatch",
    	"colorsNamesAttr": "data-color-name",
    	"swatches": "div>a>img.AltImage",
    	"swatchesAttr": "src",
    	"sizes": "div>.SizeSwatchWrapper>a.SizeSwatch",
    	"sizesAttr": "text"
    },
    'Hugo Boss': {
    	"url": "http://store-us.hugoboss.com/%27Adris/Heibo%27-%7C-Extra-Slim-Fit%2C-Stretch-Virgin-Wool-Suit/hbna50262233,en_US,pd.html?cgid=21001#!i%3D0%26color%3D001_Black",
    	"id": "hb",
    	"date": "Sun Jun 15 20:45:19 2014",
    	"name": ".variantDetails>.productinfo>h1.productname",
    	"nameAttr": "text",
    	"details": "#additional-productinfo-tabs ",
    	"detailsAttr": "text",
    	"price": ".pricing>.price>div.salesprice",
    	"priceAttr": "text",
    	"promotionTwo": ".pricing_info>.contentasset>span.vkfmsg",
    	"promotionTwoAttr": "text",
    	"colors": ".swatches.color .swatchesdisplay a.swatchanchor",
    	"colorsAttr": "href",
    	"colorsNames": ".swatches.color .swatchesdisplay a.swatchanchor",
    	"colorsNamesAttr": "text",
    	"swatches": ".thumbnailscontainer>.productthumbnails>ul>li>img.thumbnail",
    	"swatchesAttr": "data-detailurl",
    	"sizes": ".sizeVariations>.select-replacement>ul>li",
    	"sizesAttr": "text"
    },
    'Guess': {
    	"url": "http://shop.guess.com/en/Catalog/View/women/dresses/long-sleeve-knotted-v-neck-body-con-dress/W4FK51H2200",
    	"id": "gs",
    	"date": "Sun Jun 15 20:52:18 2014",
    	"name": ".row-fluid>.rightdetails>h1",
    	"nameAttr": "text",
    	"details": "#collapseOne",
    	"detailsAttr": "text",
    	"price": ".row-fluid>.rightdetails>div.price",
    	"priceAttr": "text",
    	"promotionTwo": ".rightdetails>.notebox>div.discount",
    	"promotionTwoAttr": "text",
    	"colors": ".colors>li>a",
    	"colorsAttr": "href",
    	"colorsImages": ".colors>li>a>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".colors>li>a>img",
    	"colorsNamesAttr": "alt",
    	"swatches": ".s7thumbcell>.s7thumb",
    	"swatchesAttr": "style",
    	"sizes": ".sizes>li>a",
    	"sizesAttr": "text"
    },
    'Gucci': {
    	"url": "http://www.gucci.com/us/styles/362147X86699011#",
    	"id": "gc",
    	"date": "Sun Jun 15 21:00:47 2014",
    	"name": "h1",
    	"nameAttr": "text",
    	"details": ".accordion_content>div>ul",
    	"detailsAttr": "text",
    	"price": "#price",
    	"priceAttr": "text",
    	"colorsImages": "#variations .items>li>img",
    	"colorsImagesAttr": "src",
    	"swatches": "#view_thumbs_list>.view>img",
    	"swatchesAttr": "src",
    	"sizes": "div>p>select>option",
    	"sizesAttr": "text"
    },
    'Express': {
    	"url": "http://www.express.com/clothing/vtoneck+jumpsuit/pro/7827870/cat2002",
    	"id": "ex",
    	"date": "Sun Jun 15 21:08:24 2014",
    	"name": "div>div>h1",
    	"nameAttr": "text",
    	"details": "div>div>div.cat-pro-desc",
    	"detailsAttr": "text",
    	"price": "strong>span>span:nth-child(2)",
    	"priceAttr": "text",
    	"colors": "#widget-product-swatches > a",
    	"colorsAttr": "href",
    	"colorsImages": "#widget-product-swatches > a > img",
    	"colorsImagesAttr": "src",
    	"colorsNames": "#widget-product-swatches > a > img",
    	"colorsNamesAttr": "alt",
    	"swatches": ".s7flyoutSwatch>div>img",
    	"swatchesAttr": "src",
    	"sizes": ".optionsSelect>.options-Size>select.expandMe>option:not(:first)",
    	"sizesAttr": "text"
    },
    'Dockers': {
    	"url": "http://us.dockers.com/product/index.jsp?productId=28665616&cp=2271557.41317386&ab=men_MegaNav_summersale_Shorts_08082013&parentPage=family&ab=",
    	"id": "dc",
    	"date": "Sun Jun 15 21:15:46 2014",
    	"name": ".productForm>.product-main-details>h1.product-name",
    	"nameAttr": "text",
    	"summary": ".productForm>.product-main-details>span.product-short-desc",
    	"summaryAttr": "text",
    	"details": ".product-main-details>.product-bullets",
    	"detailsAttr": "text",
    	"originalPrice": ".productForm>.product-main-details>span.product-price-was",
    	"originalPriceAttr": "text",
    	"price": ".productForm>.product-main-details>span.product-price-now",
    	"priceAttr": "text",
    	"promotionTwo": ".productForm>.product-main-details>span.product-promo",
    	"promotionTwoAttr": "text",
    	"colorsNames": ".top-inputs>.color-wrapper>select.product-input>option",
    	"colorsNamesAttr": "text",
    	"swatches": "#main_image_toggles a.image",
    	"swatchesAttr": "href",
    	"sizes": ".bottom-inputs>.size-wrapper>select.product-input>option:not(:first)",
    	"sizesAttr": "text"
    },
    'DKNY': {
    	"url": "http://www.dkny.com/dkny-jeans/dkny-jeans/mens/m2410006/dkny-jeans-williamsburg-30-grey",
    	"id": "dk",
    	"date": "Sun Jun 15 21:23:44 2014",
    	"name": ".product-info-container>.partial-product_info>h1.product-name",
    	"nameAttr": "text",
    	"details": ".partial-product_info>.product-description>div.product-description-truncated",
    	"detailsAttr": "text",
    	"price": ".price-set>.price>span.price-retail",
    	"priceAttr": "text",
    	"colorsImages": ".option-value>.option-value-a>img.option-value-img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".option-value>.option-value-a>img.option-value-img",
    	"colorsNamesAttr": "alt",
    	"swatches": ".variant-thumbnail>.variant-thumbnail-a>img.variant-thumbnail-img",
    	"swatchesAttr": "src",
    	"sizes": ".option-size .option-value>.option-value-a",
    	"sizesAttr": "text"
    },
    'Diesel': {
    	"url": "http://shop.diesel.com/f-lunar/00SBS50JAEF.html?dwvar_00SBS50JAEF_color=912#.U55Jd6jXdB4",
    	"id": "dl",
    	"date": "Sun Jun 15 21:36:34 2014",
    	"name": "div>.product-content-header>h1.product-name",
    	"nameAttr": "text",
    	"details": ".first>.detail-content>p",
    	"detailsAttr": "text",
    	"price": ".product-content-header>.product-price>span.price-sales",
    	"priceAttr": "text",
    	"promotionTwo": ".product-Promotions>.promotion>div.promotion-callout",
    	"promotionTwoAttr": "text",
    	"colors": ".swatches.Color .selected>.swatchanchor>img",
    	"colorsAttr": "src",
    	"colorsImages": ".swatches.Color .selected>.swatchanchor>img",
    	"colorsImagesAttr": "data-thumb",
    	"swatches": ".product-view>.product-image>img.primary-image",
    	"swatchesAttr": "src",
    	"sizes": ".swatch-variation.size>li",
    	"sizesAttr": "text"
    },
    'Aeropostale': {
    	"url": "http://www.aeropostale.com/product/index.jsp?productId=3995015&cp=3534618.3534619.3534624.3542203.3536103.11327013.1988237",
    	"id": "aer",
    	"date": "Sun Jun 15 21:46:21 2014",
    	"name": "div>.right>h2",
    	"nameAttr": "text",
    	"details": "div>.right>div.product-description",
    	"detailsAttr": "text",
    	"originalPrice": ".right>.price>li:nth-child(1)",
    	"originalPriceAttr": "text",
    	"price": ".right>.price>li.now",
    	"priceAttr": "text",
    	"colorsImages": ".swatches>li>a>img",
    	"colorsImagesAttr": "src",
    	"colorsNames": ".swatches>li>a>img",
    	"colorsNamesAttr": "alt",
    	"sizes": "form>.product-order-size>select>option:not(:first)",
    	"sizesAttr": "text"
    },
    'Adidas': {
    	"url": "http://www.adidas.com/us/product/mens-originals-earn-your-stripes-street-tee/AMR61?cid=F78469&breadcrumb=1z13071Z1z11zrfZu2Z1z124qo",
    	"id": "adi",
    	"date": "Sun Jun 15 21:54:29 2014",
    	"name": ".topContentItems>.productDetailSection>div.productName",
    	"nameAttr": "text",
    	"details": ".pdpBottomContentWrapper>.productInfoSection>div.productInfoSubSection",
    	"detailsAttr": "text",
    	"originalPrice": ".productDetailSection>.productPrice>span:nth-child(1)",
    	"originalPriceAttr": "text",
    	"price": ".productDetailSection>.productPrice>span:nth-child(2)",
    	"priceAttr": "text",
    	"promotionTwo": ".breadCrumbItems>.pdpPromoMessage>span",
    	"promotionTwoAttr": "text",
    	"colors": ".productAltColors>.altColor",
    	"colorsAttr": "data-prod-url",
    	"colorsImages": ".productAltColors>.altColor>img",
    	"colorsImagesAttr": "src",
    	"swatches": "#altImages img",
    	"swatchesAttr": "src",
    	"sizes": ".productSizeList>ul>li",
    	"sizesAttr": "text",
    	"usePhantomjs": true
    },
    'New Balance': {
    	"url": "http://www3.newbalance.com/MRT4117.html?dwvar_MRT4117_color=Black#color=Black",
    	"id": "nb",
    	"date": "Sun Jun 15 22:03:59 2014",
    	"name": ".row>.small-12>h1.product-name",
    	"nameAttr": "text",
    	"summary": ".row.product-metadata + .row",
    	"summaryAttr": "text",
    	"details": ".country-US>.pt_storefront>section.product-details",
    	"detailsAttr": "text",
    	"originalPrice": ".product-pricing>.pricenote>span.pricenotebucket",
    	"originalPriceAttr": "text",
    	"price": ".small-12>.product-pricing>span.price",
    	"priceAttr": "text",
    	"promotionTwo": ".small-12>.promo-messages>li",
    	"promotionTwoAttr": "text",
    	"colorsNames": ".variant-select.color div.swatch",
    	"colorsNamesAttr": "title",
    	"swatches": ".swiper-wrapper>.swiper-slide>img",
    	"swatchesAttr": "src",
    	"usePhantomjs": true
    },
    'Lucky Brand': {
    	"url": "http://www.luckybrand.com/wiley-1-pocket-shirt/7M41433.html?dwvar_7M41433_color=960&cgid=m-clothing-tops-shirts",
    	"id": "lb",
    	"date": "Sun Jun 15 22:11:12 2014",
    	"name": ".pdp-main>.product-col-2>h1.product-name",
    	"nameAttr": "text",
    	"details": ".product-tabs div.scrollable",
    	"detailsAttr": "text",
    	"originalPrice": ".product-main-pricing>.product-price>span.product-standard-price-strike",
    	"originalPriceAttr": "text",
    	"price": ".product-main-pricing>.product-price>span.price-sales",
    	"priceAttr": "text",
    	"promotion": "div>.product-price>p.promo",
    	"promotionAttr": "text",
    	"swatches": "div>div>div.s7thumb",
    	"swatchesAttr": "style",
    	"sizes": ".swatches>.emptyswatch:not(.unselectable)>a.swatchanchor",
    	"sizesAttr": "text"
    },
    'Victorias Secret': {
    	"url": "https://www.victoriassecret.com/victorias-secret-sport/all-bottoms/tennis-short-vs-sport?ProductID=188108&CatalogueType=OLS",
    	"id": "vs",
    	"date": "Sun Jun 15 22:11:12 2014",
    	"name": "h1:first",
    	"nameAttr": "text",
    	"details": ".description .full.trunc-on",
    	"detailsAttr": "text",	
    	"price": ".description .price",
    	"priceAttr": "text",
    	"swatches": ".product-image-group ul > li > img",
    	"swatchesAttr": "src",
    	"colorsImages": ".module.color img",
    	"colorsImages": "src",
    	"sizes": ".module.size > div label > span",
    	"sizesAttr": "text"
    },
    'Columbia': {
      	"url": "http://www.columbia.com/Men%27s-Coolest-Cool%E2%84%A2-Short-Sleeve-Top/AM6579,default,pd.html",
      	"id": "col",
      	"date": "Tue Jul  8 00:21:52 2014",
      	"name": "div>div>h1.product_title",
      	"nameAttr": "text",
      	"summary": "form>div>div.description",
      	"summaryAttr": "text",
      	"details": ".product-info-block>.product-info-left-col>div.pdpDetailsContent",
      	"detailsAttr": "text",
      	"price": "div>div>div.price-index",
      	"priceAttr": "text",
      	"colors": ".innerswatch>a",
      	"colorsAttr": "rel",
      	"colorsImages": ".innerswatch>a>img",
      	"colorsImagesAttr": "src",
      	"colorsNames": ".innerswatch>a>img",
      	"colorsNamesAttr": "alt",
      	"sizes": ".innersize",
      	"sizesAttr": "text"
      },
      'Nautica': {
      	"url": "http://www.nautica.com/performance-deck-polo-shirt/K41050.html?dwvar_K41050_color=018#uuid=cdth6iaagZLEcaaadal1cbzDbY",
      	"id": "nau",
      	"date": "Wed Jul  9 18:40:25 2014",
      	"container": ".pt_product-details>.full-width>div",
      	"containerAttr": "text",
      	"name": ".productBody>.product-col-2>h1.product-name",
      	"nameAttr": "text",
      	"summary": ".product-info-tabs-content>.tab-content>div.description-content",
      	"summaryAttr": "text",
      	"details": ".product-info-tabs-content>.tab-content>div.bulletDescription",
      	"detailsAttr": "text",
      	"originalPrice": ".product-col-2>.product-price>span.price-standard",
      	"originalPriceAttr": "text",
      	"price": ".product-col-2>.product-price>span.price-sales",
      	"priceAttr": "text",
      	"colors": ".swatches>.emptyswatch>a.swatchanchor",
      	"colorsAttr": "href",
      	"colorsImages": ".swatches>.emptyswatch>a.swatchanchor",
      	"colorsImagesAttr": "style",
      	"colorsNames": ".swatches>.emptyswatch>a.swatchanchor",
      	"colorsNamesAttr": "text",
      	"swatches": ".fluid-display-imagegroup>.display:imageitem:view:1500:K41050:pdp:container>img.display:imageitem:view:1500:K41050:pdp",
      	"swatchesAttr": "text",
      	"sizes": "#va-size>option:not(:first)",
      	"sizesAttr": "text"
      },
      'Elie Tahari': {
      	"url": "http://www.elietahari.com/en_US/everla-blouse/E41VD514.html?start=1&cgid=sale-women-blouses&dwvar_E41VD514_color=100&PathToProduct=sale-women-blouses",
      	"id": "eli",
      	"date": "Mon Jul 21 18:20:00 2014",
      	"container": ".pt_productdetails>div>div.productdetail",
      	"containerAttr": "text",
      	"name": ".floatright>.productdetailcolumn>h1.pdp-productname",
      	"nameAttr": "text",
      	"summary": ".product-tabs>.tab-content>p.longdesc",
      	"summaryAttr": "text",
      	"details": ".product-tabs>.tab-content>ul",
      	"detailsAttr": "text",
      	"originalPrice": ".pricing>.price>div.standardprice",
      	"originalPriceAttr": "text",
      	"price": ".pricing>.price>div.salesprice",
      	"priceAttr": "text",
      	"colors": ".swatches>.swatchesdisplay>li>a.swatchanchor",
      	"colorsAttr": "text",
      	"colorsImages": ".swatches>.swatchesdisplay>li",
      	"colorsImagesAttr": "style",
      	"colorsNames": ".swatches>.swatchesdisplay>li>a.swatchanchor",
      	"colorsNamesAttr": "text",
      	"sizes": ".swatches>.swatchesdisplay>li.emptyswatch>a",
      	"sizesAttr": "rel"
      },
      'JoS. A. Bank': {
      	"url": "http://www.josbank.com/menswear/shop/Product_11001_10050_337905",
      	"id": "jos",
      	"date": "Mon Jul 21 19:46:35 2014",
      	"container": "div>form>div.viewPane",
      	"containerAttr": "text",
      	"name": ".prodtabBody>.addInfo>h1.prodName",
      	"nameAttr": "text",
      	"details": ".info>.addInfo>p",
      	"detailsAttr": "text",
      	"originalPrice": "div>.cost>span.reg",
      	"originalPriceAttr": "usprice",
      	"price": "div>.cost>span.price",
      	"priceAttr": "usprice",
      	"colorsImages": "#NAVY",
      	"colorsImagesAttr": "src",
      	"colorsNames": "#NAVY",
      	"colorsNamesAttr": "title",
      	"sizes": ".spot>.selectColorBox>option",
      	"sizesAttr": "text"
      },
      'Bonobos': {
      	"url": "http://bonobos.com/pink-windowpane-tattersall-causal-shirt-for-men",
      	"id": "htt",
      	"date": "Tue Jul 29 22:20:36 2014",
      	"container": ".allows-full-width>div>div.container",
      	"containerAttr": "text",
      	"name": "div>.product-summary>h1",
      	"nameAttr": "text",
      	"summary": ".description>.summary>p",
      	"summaryAttr": "text",
      	"details": "section>.specs-table>dd",
      	"detailsAttr": "text",
      	"price": ".product-summary>p>span.price",
      	"priceAttr": "text",
      	"swatches": ".more-views-container>.more-views-thumbs>img",
      	"swatchesAttr": "src",
      	"sizes": ".dd-options>.Shirt>a.option",
      	"sizesAttr": "text"
      }
};

var productDetail = {
    debug: false,
    
    getDetails: function(company, sku, url, callback){
        var webProxyData = {u:url};
	    company = company.substring(0,1).toUpperCase() + company.substring(1);
	   
	   if (productDetailApi[company] != null && productDetailApi[company].usePhantomjs){
	          webProxyData["phantom"] = true;
	   }
        
        $.post("webProxy.php", webProxyData, function(results){	
            if (results == null){
                console.log("Got no data back from " + url);
            }else{
                productDetail.populateDetails(company, sku, url, results, callback);        
            }
        });
    },
  
    populateDetails: function(company, sku, url, data, callback, selectors){
        if (productDetail.debug) { ;debugger; }
        
        try{
            var product = {}; 
            data = $("<html>").html(data);
                   
            //company = company.replace(/[\s_&]/g,'');
            var s = productDetailApi[company]; // s for selectors
            var home = url.substring(0, url.indexOf("/", url.indexOf(".")));
            
            if(selectors != null){ 
                s = selectors;   
            }
            
            if(s == null){ 
                Messenger.error("Store ["+ company +"] is not in the API"); 
                return null;
            }
            
            if (sku != null){            
                product.sku = sku;
            }  
            
            if (url != null){
                product.url = url;                        
            }
            
            if (s.container != null){
                data = $(data).find(s.container).first(); 
            }                
            
            if (s.name != null){
                if (s.nameAttr == null || s.nameAttr == "text"){
                    product.name = $(data).find(s.name).first().text();
                }else{
                    product.name = $(data).find(s.name).first().attr(s.nameAttr);   
                }
            }
            
            if (s.summary != null){
                if (s.summaryAttr == null || s.summaryAttr == "text"){
                    product.summary = $(data).find(s.summary).first().text();
                }else{
                    product.summary = $(data).find(s.summary).first().attr(s.summaryAttr);   
                }
            }
            
            if (s.details != null && $(data).find(s.details).length > 0){                
                product.details = $(data).find(s.details).first().wrap("<div></div>").parent().find("*").replaceWith(function() {
                    return $('<' + this.nodeName + '>').append( $(this).html() );
                }).find("script").remove().end().html();                                
            }
            
            if (s.promotion != null){
                if (s.promotionAttr == null || s.promotionAttr == "text"){
                    product.promotion = $(data).find(s.promotion).first().text();   
                }else{
                    product.promotion = $(data).find(s.promotion).first().attr(s.promotionAttr);   
                }
            }
            
            if (s.promotionTwo != null){
                if (s.promotionTwoAttr == null || s.promotionTwoAttr == "text"){
                    product.promotionTwo = $(data).find(s.promotionTwo).first().find("*").remove().end().text();
                }else{
                    product.promotionTwo = $(data).find(s.promotionTwo).first().find("*").remove().end().attr(s.promotionTwoAttr);                
                }
            }
            
            if (s.originalPrice != null){
                if (s.originalPriceAttr == null || s.originalPriceAttr == "text"){
                    product.originalPrice = $(data).find(s.originalPrice).first().text().trim().replace("$","");
                }else{
                    product.originalPrice = $(data).find(s.originalPrice).first().attr(s.originalPriceAttr).trim().replace("$","");
                }            
            }
            
            if (s.price != null){
                if (s.priceAttr == null || s.priceAttr == "text"){
                    product.price = $(data).find(s.price).first().text().trim().replace("$","");
                }else{
                    product.price = $(data).find(s.price).first().attr(s.priceAttr).trim().replace("$","");
                }
            }
            
            if (s.priceCents != null){
                if (s.priceCentsAttr == null || s.priceCentsAttr == "text"){
                    product.price += "." + $(data).find(s.priceCents).first().text().trim().replace("$","");
                }else{
                    product.price += "." + $(data).find(s.priceCents).first().attr(s.priceCentsAttr).trim().replace("$","");
                }
            }
                                                
            product.colors = [];
            $(data).find(s.colors).each(function(){
                var name = null;
                var url = null;
                var img = null;
                
                if (s.colorsNamesAttr != null){
                    name = s.colorsNamesAttr == "text" ? $(this).text() : $(this).attr(s.colorsNamesAttr);
                }
                
                if (s.colorsAttr){
                    url = $(this).attr(s.colorsAttr);
                    url = storeApiHelper.getAbsoluteUrl(url, home);
                }
                
                if (s.colorsImagesAttr){  
                    var imgData;
                    
                    if (s.colorsImages == s.colors){
                        imgData = this;   
                    }else{
                        imgData = $(this).find(s.colorsImages);  
                    }
                                      
                    if (s.colorsImagesAttr.indexOf("style-") == 0){          
                        var attr = s.colorsImagesAttr.substring(6); // strip "style-"
                        img = $(imgData).css(attr);  
                        
                        if (img){              
                            img = img.substring(img.indexOf("(") + 1, img.indexOf(")")); // parse out the img src
                            img = img.replace(/[\"\']/g,''); // removes quotes
                        }
                    }else{
                        img = $(imgData).attr(s.colorsImagesAttr);
                    }
                                        
                    img = storeApiHelper.getAbsoluteUrl(img, home);
                }                                
    
                product.colors.push({
                    name: $.trim(name),
                    url: $.trim(url),
                    img: $.trim(img)
                });
            });
                                                
            product.swatches = [];
            $(data).find(s.swatches).each(function(){    
                var url = $(this).attr(s.swatchesAttr ? s.swatchesAttr : 'src');
                url = storeApiHelper.getAbsoluteUrl(url, home);                          
                product.swatches.push(url);
            });
                        
            product.sizes = [];
            $(data).find(s.sizes).each(function(){                                
                var size = s.sizesAttr == "text" ? $(this).text() : $(this).attr(s.sizesAttr);
                
                if (product.sizes.indexOf($.trim(size)) < 0){
                    product.sizes.push($.trim(size));
                }
            }); 
            //product.sizes.sort();  
            
            productDetail.cleanProduct(product); 
        
           if (callback != null && typeof callback == "function"){
               callback(product);
           }else{
               return product;
           }
           
        }catch(err){
            console.log("whoops ran into an error!");
            console.log(err.lineNumber + ": " + err.message);   
            Messenger.error(err.lineNumber + ": " + err.message);   
        }                      
    },
    
    cleanProduct: function (product){                          
        product.summary = productDetail.setEmptyToNull($.trim(product.summary));
        product.details = productDetail.setEmptyToNull($.trim(product.details));        
        product.promotion = productDetail.setEmptyToNull($.trim(product.promotion));
        product.promotionTwo = productDetail.setEmptyToNull($.trim(product.promotionTwo));
        product.originalPrice = productDetail.setEmptyToNull($.trim(product.originalPrice));
        product.price = productDetail.setEmptyToNull($.trim(product.price));                        
                                            
        product.colors = productDetail.removeNullOrEmptyItems(product.colors);        
        product.swatches = productDetail.removeNullOrEmptyItems(product.swatches);        
        product.sizes = productDetail.removeNullOrEmptyItems(product.sizes);        
        product.swatches = productDetail.removeNullOrEmptyItems(product.swatches);        
    },
    
    setEmptyToNull: function(val){
        return val == null || val.trim() == "" ? null : val;
    },
    
    removeNullOrEmptyItems: function(arr){
        if (arr == null || arr.length <= 0){
            return null;   
        }        
        
        for(var i=0; i < arr.length; i++){
            if (arr[i] == null || (typeof arr[i] == "string" && arr[i].trim() == "")){
                arr.splice(i, 1);
            }
        }   
        
        if (arr.length <= 0){
            return null;   
        }
        
        return arr;
    },
    
    getAbsoluteUrl: function(url, home){
        if ( (url.indexOf("//") >= 0 && url.indexOf("//") < 10) ||
             (url.indexOf("www.") >= 0 && url.indexOf("www.") < 15) ||
             (url.indexOf(".com/") >= 0 && url.indexOf(".com/") < 50) ||
             (url.indexOf(".net/") >= 0 && url.indexOf(".net/") < 50)){
                return url;
             }

        return home + url;
    }       
};
