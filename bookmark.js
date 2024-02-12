function bookMark(clickedBtn, id,title){
    
    bookmarktoggle()

    const btn = $(clickedBtn);
    if(btn.hasClass('text-gray-300')){

        btn.removeClass('text-gray-300').addClass('text-primary')
    }else{
        btn.removeClass('text-primary').addClass('text-gray-300')
    }
  }

  function renderBookmarkContent(content) {
    const $dashboardContent = $('.dashboard-content');
    $dashboardContent.empty();
    content.forEach(item => {

        var param = item.RefNo + "_" + $('#emailAddy').val();
        var url = "article.aspx?refNo=" + param;
        $dashboardContent.append(`
        <div class=" hover:border-primary transition-all ease-in-out duration-300 w-full flex flex-col justify-between gap-2 border border-border border-solid bg-bgsecond/20 overflow-hidden rounded-lg p-2 group">
                <div class="flex items-center justify-between gap-3">
                    <div class=" flex items-center truncate overflow-hidden">
                        <div class=" bg-[#F4E6E6] rounded-md p-[10px] flex items-center justify-center mr-2  ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M11.6663 9.16675H6.66634M8.33301 12.5001H6.66634M13.333 5.83341H6.66634M16.6663 5.66675V14.3334C16.6663 15.7335 16.6663 16.4336 16.3939 16.9684C16.1542 17.4388 15.7717 17.8212 15.3013 18.0609C14.7665 18.3334 14.0665 18.3334 12.6663 18.3334H7.33301C5.93288 18.3334 5.23281 18.3334 4.69803 18.0609C4.22763 17.8212 3.84517 17.4388 3.60549 16.9684C3.33301 16.4336 3.33301 15.7335 3.33301 14.3334V5.66675C3.33301 4.26662 3.33301 3.56655 3.60549 3.03177C3.84517 2.56137 4.22763 2.17892 4.69803 1.93923C5.23281 1.66675 5.93288 1.66675 7.33301 1.66675H12.6663C14.0665 1.66675 14.7665 1.66675 15.3013 1.93923C15.7717 2.17892 16.1542 2.56137 16.3939 3.03177C16.6663 3.56655 16.6663 4.26662 16.6663 5.66675Z" stroke="url(#paint0_linear_592_305)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <defs>
                                    <linearGradient id="paint0_linear_592_305" x1="9.99967" y1="1.66675" x2="9.99967" y2="18.3334" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#BF0000" stop-opacity="0.68"/>
                                    <stop offset="1" stop-color="#900000"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <a href="article.html" class="capitalize font-semibold text-sm truncate hover:text-primary">${item.Title}</a>
                    </div>
                    <button onClick={modal(${item.ContentId})} class=" py-2 px-2 hover:bg-[#F5F5F5] rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" stroke-textsub">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="19" cy="12" r="1"/>
                            <circle cx="5" cy="12" r="1"/>
                        </svg>
                    </button>
                </div>
                <p class=" text-textsub text-xs">
                    ${item.Description}
                </p>
                <div class="flex justify-between  items-center">
                    <div class="  bg-[#F9F5F5] rounded-full text-xs capitalize text-primary">${item.ContentType}</div>
                    <button class="bookmark-btn text-gray-300" onclick="bookMark(this,${item.ContentId},${item.Title})">
                        <span class="sr-only">bookmark</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
        </div>
`)
    });
}


function bookmarktoggle(){
    $('.bookmark').toggleClass('hidden');
}