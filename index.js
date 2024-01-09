$(document).ready(function () {

        let location= window.location.pathname
        let currentSlide = 0;
        let filterObject = {};

        

        if(location === '/'){
            updateDots(currentSlide);

            let autoPlayInterval = startAutoPlay(currentSlide);

            $('.dot').click(function () {
                const dotIndex = $(this).index();
                showSlide(dotIndex);
            });
    
            // Handle arrow key navigation
            $(document).keydown(function (e) {
                if (e.keyCode === 37) {
                    prevSlide();
                    restartAutoPlay();
                } else if (e.keyCode === 39) {
                    currentSlide = nextSlide(currentSlide);
                    restartAutoPlay();
                }
            });
    
            // Handle swipe gestures for touch devices
            let startX;
            let endX;
            $('#slider').on('touchstart', function (e) {
                startX = e.touches[0].pageX;
            });
    
            $('#slider').on('touchmove', function (e) {
                endX = e.touches[0].pageX;
            });
    
            $('#slider').on('touchend', function () {
                const deltaX = endX - startX;
                if (deltaX > 50) {
                    currentSlide = prevSlide(currentSlide);
                } else if (deltaX < -50) {
                    currentSlide = nextSlide(currentSlide);
                }
                restartAutoPlay();
            });
    
            animateSlide(currentSlide);
        }else if(location === '/dashboard.html'){

            loadSidebar();
            renderContent(contentData.Result);
            
            populateDropdown(Subsidiaries, 'subsidiary');
            populateDropdown(ContentTypes, 'type');

            $('.dropdown').each(function () {
                const $button = $(this).find('[data-tag]');
                const $dropdown = $(this).find('[data-dropdown]');
                const dropdownId = $(this).attr('id');
    
                if ($button.data('tag') === 'all') {
                    console.log('all btns');
                    filterObject = {}; // Reset the filterObject
                    filterContent(filterObject,'dashboard');
                    handleSubsidiaryFilter(filterObject);
                }
                
                
                let currentSelectedValue = ""; 
    
    
                $button.click(function (e) {
                    e.stopPropagation(); 
                    console.log(' btns clicked')
                    $dropdown.toggleClass('hidden');
                });
    
    
                $dropdown.find('[data-sub]').click(function () {
                    const selectedName = $(this).data('sub');
                    let selectedValue ='';
                    console.log('sub btn clicked');
                    if($button.data('tag') === 'ContentType'){
                        selectedValue = $(this).data('sub');
                    }else{
                        selectedValue = $(this).data('value');
                    }
    
                    // Check if the selected value is already the current selected value
                    if (filterObject[$button.data('tag')] === selectedValue) {
                        // If it is the same value, remove the selection
                        console.log(filterObject);
                        
                        // Clear the selected value from filterObject
                        filterObject[$button.data('tag')] = ""; 
                        console.log(dropdownId);
                        // Clear the button text
                        $button.find('.text').text(dropdownId); 
                        
                        // Remove the styling from the selected option
                        $button.addClass('text-[#606060] border border-solid border-[#606060]').removeClass('bg-primary text-white');
                        filterContent({},'dashboard');
                        handleSubsidiaryFilter(filterObject);
                    } else {
                        // Update the filter object
                        filterObject[$button.data('tag')] = selectedValue;
                        
                        filterContent(filterObject,'dashboard');
                        handleSubsidiaryFilter(filterObject);

                        currentSelectedValue = selectedValue; 
                        $button.find('.text').text(selectedName);
                        $dropdown.addClass('hidden');
    
                        $dropdown.find('[data-sub]').removeClass('bg-primary text-white');
                        $button.addClass('text-[#606060] border border-solid border-[#606060]').removeClass('bg-primary text-white');
                        $(this).addClass('bg-primary text-white');
    
                        if ($(this).attr('data-sub')) {
                            $button.removeClass('text-[#606060] border border-solid border-[#606060]').addClass('bg-primary text-white');
                        } else {
                            // If data-sub attribute is not present, you can add an else statement to handle that case
                        }
                    }
                    if ($button.data('tag') === 'all') {
                        console.log('all btns');
                        filterObject = {}; // Reset the filterObject
                        filterContent({},'dashboard');
                        handleSubsidiaryFilter(filterObject);
                    }
                });
    
    
                $(document).click(function () {
                    $dropdown.addClass('hidden');
                });
            });

            $('nav a').click(function (e) {
                e.preventDefault();
                const route = $(this).attr('href').substring(1);
                loadContent(route);
            });

            $('#sidebar .dropdown-toggle').click(function () {
                const $dropdownContent = $(this).siblings('.dropdown-content');
                $dropdownContent.toggleClass('h-0 h-fit');
            });

            $('#searchInput').on('input', function () {
                const searchText = $(this).val().toLowerCase();
                filterContentBySearch(searchText);
            });

      
            handleSubsidiaryFilter(filterObject);

            filterContent('all');
            markActiveTag('all');
            
            const defaultTab = 'email';
            $(`.tab-btn[data-tab="${defaultTab}"]`).removeClass('text-textsub').addClass('text-text')
            showTab('sharemodal', defaultTab);

            $('.tab-btn').click(function () {
                const tabName = $(this).data('tab');
                showTab('sharemodal',tabName);

                $('.tab-btn').removeClass('text-text').addClass('text-textsub');
                $(this).removeClass('text-textsub').addClass('text-text');
            });

            $(document).on('click', '.toggle-btn', function() {
                console.log('clicked toggle')
                const section = $(this).closest('.collapsible-section');
                const content = section.find('.collapsible-content');
                const icon = $(this).find('.toggle-icon');

                content.toggleClass('hidden');
                icon.toggleClass(' rotate-90  '); 
                
                
            });
        }else if(location === '/article.html'){
            
            loadSidebar();

            displayContent()

            $('.dock-toggle').click(function(){
                const $dock = $('.document-dock');
                $dock.toggleClass('hidden');

                $('.rotate-svg').toggleClass(' rotate-180 ');
                $('.article-header').toggleClass(' border-b');

            })
 
            const defaultTab = 'remarks';
            $(`#dock .tab-btn[data-tab="${defaultTab}"]`).removeClass('text-textsub').addClass('text-text');
            showTab('dock',defaultTab);
        
            const defaultShareTab = 'email';
            $(`#sharemodal .tab-btn[data-tab="${defaultShareTab}"]`).removeClass('text-textsub').addClass('text-text');
            showTab('sharemodal',defaultShareTab);

            $('.tab-btn').click(function () {
                const containerId = $(this).closest('.tab-container').attr('id'); // Assuming tab buttons are within a container
                const tabName = $(this).data('tab');
                showTab(containerId, tabName);
            
                $(this).siblings('.tab-btn').removeClass('text-text').addClass('text-textsub');
                $(this).removeClass('text-textsub').addClass('text-text');
            });

           
            $('#likeForm').click(function(){
                console.log('likeform clicked')
                $(this).toggleClass('text-primary');
            })

            $('.star').on('click', function () {
                const clickedStar = $(this);
                const rating = clickedStar.index() + 1;

                // Set the rating value
                $('#rating-value').text(rating);

                // Highlight the selected stars
                clickedStar.prevAll().addBack().addClass('text-yellow-400');
                clickedStar.nextAll().removeClass('text-yellow-400');
            });
            
            
        }else if(location === '/updaterequest.html' ){
            loadSidebar();
            populateTable(updaterequest.Result);

            populateDropdown(Subsidiaries, 'organization');
            populateDropdown(ContentTypes, 'type');
            populateDropdown(Departments, 'department');

            $('.dropdown').each(function () {
                const $button = $(this).find('[data-tag]');
                const $dropdown = $(this).find('[data-dropdown]');
                const dropdownId = $(this).attr('id');
                console.log('dropdown opened')

                if ($button.data('tag') === 'all') {
                    console.log('all btns');
                    filterObject = {}; // Reset the filterObject
                    filterContent(filterObject,'request');
                    handleSubsidiaryFilter(filterObject);
                }
                
                
                let currentSelectedValue = ""; 
    
    
                $button.click(function (e) {
                    e.stopPropagation(); 
                    console.log(' btns clicked')
                    $dropdown.toggleClass('hidden');
                });
    
    
                $dropdown.find('[data-sub]').click(function () {
                    const selectedName = $(this).data('sub');
                    let selectedValue ='';
    
                    if($button.data('tag') === 'ContentType'){
                        selectedValue = $(this).data('sub');
                    }else{
                        selectedValue = $(this).data('value');
                    }
    
                    // Check if the selected value is already the current selected value
                    if (filterObject[$button.data('tag')] === selectedValue) {
                        // If it is the same value, remove the selection
                        console.log(filterObject);
                        
                        // Clear the selected value from filterObject
                        filterObject[$button.data('tag')] = ""; 
                        console.log(dropdownId);
                        // Clear the button text
                        $button.find('.text').text(dropdownId); 
                        
                        // Remove the styling from the selected option
                        $button.addClass('text-[#606060] border border-solid border-[#606060]').removeClass('bg-primary text-white');
                        filterContent({},'request');
                        handleSubsidiaryFilter(filterObject);
                    } else {
                        // Update the filter object
                        filterObject[$button.data('tag')] = selectedValue;
                        
                        filterContent(filterObject,'request');
                        handleSubsidiaryFilter(filterObject);

                        currentSelectedValue = selectedValue; 
                        $button.find('.text').text(selectedName);
                        $dropdown.addClass('hidden');
    
                        $dropdown.find('[data-sub]').removeClass('bg-primary text-white');
                        $button.addClass('text-[#606060] border border-solid border-[#606060]').removeClass('bg-primary text-white');
                        $(this).addClass('bg-primary text-white');
    
                        if ($(this).attr('data-sub')) {
                            $button.removeClass('text-[#606060] border border-solid border-[#606060]').addClass('bg-primary text-white');
                        } else {
                            // If data-sub attribute is not present, you can add an else statement to handle that case
                        }
                    }
                    if ($button.data('tag') === 'all') {
                        console.log('all btns');
                        filterObject = {}; // Reset the filterObject
                        filterContent({},'request');
                        handleSubsidiaryFilter(filterObject);
                    }
                });
    
    
                $(document).click(function () {
                    $dropdown.addClass('hidden');
                });
            });

            $('nav a').click(function (e) {
                e.preventDefault();
                const route = $(this).attr('href').substring(1);
                loadContent(route);
            });

            $('#sidebar .dropdown-toggle').click(function () {
                const $dropdownContent = $(this).siblings('.dropdown-content');
                $dropdownContent.toggleClass('h-0 h-fit');
            });

            $(document).on('click', '.request', function() {
                const $requestId = $(this).data('id')
                console.log($requestId);
                modal()
                renderMoreContent($requestId,'request')
            });


            $('#searchInput').on('input', function () {
                const searchText = $(this).val().toLowerCase();
                filterContentBySearch(searchText);
            });


        }

        
});


function animateSlide(index) {
    gsap.timeline()
        .from( '.slide', {
            opacity: 0, 
            y:"-100%",
            duration:0.5,
        }).to(
            '.slide',{
                opacity: 1, 
                y:0,
                duration: 0.5
            }
        )
        
}

function restartAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = startAutoPlay();
}

function showSlide(index) {
    console.log(index)
    $('.slide').removeClass('hidden').addClass('hidden');
    $('.slide').eq(index).removeClass('hidden');
    updateDots(index);
    animateSlide(index);

}

function updateDots(index) {
    $('.dot').removeClass('bg-gray-100 bg-gray-100/40');
    $('.dot').not(':eq(' + index + ')').addClass('bg-gray-100/40');
    $('.dot').eq(index).addClass('bg-gray-100');
}


function nextSlide(currentSlide) {
    let nextIndex = (currentSlide + 1) % $('.slide').length;
    showSlide(nextIndex);
    return nextIndex;
}

function prevSlide(currentSlide) {
    let prevIndex = (currentSlide - 1 + $('.slide').length) % $('.slide').length;
    showSlide(prevIndex);
    return prevIndex;
}

function startAutoPlay(currentSlide) {
    return setInterval(function () {
        currentSlide = nextSlide(currentSlide);
    }, 3000); // Change 5000 to the desired interval in milliseconds (e.g., 5000 for 5 seconds)
}


// dashboard functions
function loadSidebar() {
    const $nav = $('#sidebar');
    console.log(menu);

    menu.forEach(item => {
        if (item.header) {
            $nav.append(`<h2 class="uppercase mb-5 text-sm font-semibold mx-5 text-gray-500">${item.header}</h2>`);
        } else {
            if (item.children) {
                // Dropdown item
                $nav.append(`<div class="flex flex-col">
                                <div class=" dropdown-toggle flex justify-between items-center text-[#606060] text-md px-5 py-2 hover:bg-red-800 hover:text-white hover:cursor-pointer w-11/12 rounded-e-md mb-3 capitalize font-normal">
                                    <span class="flex items-center "><i class=" mr-3 text-md">${item.icon}</i><span>${item.name}</span> </span>  <i class=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg></i>
                                </div>
                                <div class="  dropdown-content px-5 flex flex-col h-0 overflow-hidden transition-all duration-500 ease-in-out">
                                    ${item.children.map(child => `<a href="${child.url}" class="px-5 py-2 hover:bg-red-800 hover:text-white w-11/12 rounded-e-md mb-3 capitalize font-normal">${child.name}</a>`).join('')}
                                </div>
                            </div>`);
            } else {
                // Regular item without dropdown
                $nav.append(`<a href="${item.url}" class="flex items-center group text-[#606060] text-md px-5 py-2 hover:bg-red-800 hover:text-white hover:cursor-pointer w-11/12 rounded-e-md mb-3 capitalize font-normal">
                                <i class=" mr-3 text-md">${item.icon}</i><span>${item.name}</span>
                            </a>`);
            }
        }
    });
}

function showTab(containerId, tabName) {
    const $container = $(`#${containerId}`);
    const $tabContent = $container.find(`.tab-content.${tabName}-tab`);
    $container.find('.tab-content').hide();
    $tabContent.show();
}

function moretoggle(){
    $('.more').toggleClass('hidden');
    animateMore()
    renderMoreContent()
}

function handleSubsidiaryFilter(filterObject) {
    if (filterObject && filterObject.SubsidiaryId) {
        const selectedSubsidiaryId = filterObject.SubsidiaryId;
        const departmentsForSubsidiary = getDepartmentsForSubsidiary(selectedSubsidiaryId);
        populateDropdown(departmentsForSubsidiary, 'department');
    }
}

function getDepartmentsForSubsidiary(subId) {

    const relationshipsForSubsidiary = SubsidiaryDepartmentRelationships.filter(relationship => {
        return relationship.subId === subId;
    });

    // Extract department IDs from the relationships
    const departmentIds = relationshipsForSubsidiary.map(relationship => relationship.deptId);

    // Map department IDs to department objects
    const departmentsForSubsidiary = Departments.filter(department => {
        return departmentIds.includes(department.id);
    });

    return departmentsForSubsidiary;
}

function populateDropdown(data, dropdownId) {
    const dropdown = $(`#${dropdownId} [data-dropdown]`);
    data.forEach(item => {
        const button = `<button data-sub="${item.name}" data-value="${item.id}" class=" capitalize py-1 hover:bg-gray-50 hover:text-primary text-left px-5 rounded-sm">${item.name}</button>`;
        dropdown.append(button);
    });
}

function renderContent(content) {
    const $dashboardContent = $('.dashboard-content');
    $dashboardContent.empty();
    console.log(content)

    content.forEach(item=>{

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
                    <p class=" text-textsub text-md">
                        ${item.Description}
                    </p>
                    <div class="flex  items-center">
                        <div class=" px-[20px] py-[5px] bg-[#F9F5F5] rounded-full text-xs capitalize text-primary">${item.ContentType}</div>
                    </div>
            </div>
        `)
    })
}

function renderMoreContent(id,type){

    const $moreContiner = $('.more-content');

    $moreContiner.empty();


    if(type === 'request'){
        const data = updaterequest.Result;
        const request = data.find(item => item.ContentId === id);
        $('.more-title').empty();
        $('.more-title').append(`${request.Title}`);

        $moreContiner.append(`
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex flex-col gap-[15px] ">
                    <h2 class=" text-[15px] font-semibold">Decription</h2>
                    <p class=" text-[#808080] text-sm">
                        ${request.Description}
                    </p>
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Category</h2>
                    <p class=" text-sm text-primary font-semibold">${request.ContentType}</p>
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Subsidiary</h2>
                    
                    ${getSubsidiary(request.SubsidiaryId)}
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Department</h2>
                    <p class="">${getDepartment(request.DeptId)}</p>
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Attachment</h2>
                    <div class="w-[200px]  p-2.5 bg-white rounded border border-solid border-red-800 justify-start items-center gap-2 inline-flex">
                        <div class="text-center text-white text-xs font-bold bg-red-500 p-1 rounded">PDF</div>
                        <div class=" flex-col justify-start items-start gap-2 flex">
                            <div class="self-stretch h-7 flex-col justify-start items-start flex">
                                <h2 class="self-stretch text-zinc-600 text-xs font-normal leading-none">Tech design requirements.pdf</h2>
                                <p class="self-stretch text-zinc-500 text-xs font-normal leading-none">200 KB</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Attachment</h2>
                    <p class=" px-5 py-1 rounded-full text-yellow-800 ${request.Status === "Submitted" && "bg-yellow-400/20"}">${request.Status}</p>
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Created by</h2>
                    <p class=" px-5 py-1 rounded-full ">${request.Created}</p>
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Updated by</h2>
                    <p class=" px-5 py-1 rounded-full ">${request.Reviewer}</p>
                </div>
                <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                    <h2 class=" text-[15px] text-[#606060]">Date updated</h2>
                    <p class=" px-5 py-1 rounded-full ">${request.PublicationDate}</p>
                </div>
        `); 
    }else {
        const data = sigledata.Result;
        const versions = sigledata.Versions;
        $('.more-title').empty();

        $('.more-title').append(`${data.Title}`);

        $moreContiner.append(`
                    <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex flex-col gap-[15px] ">
                        <h2 class=" text-[15px] font-semibold">Decription</h2>
                        <p class=" text-[#808080] text-sm">
                            ${data.Description}
                        </p>
                    </div>
                    <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                        <h2 class=" text-[15px] text-[#606060]">Category</h2>
                        <p class="">${data.Description}</p>
                    </div>
                    <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                        <h2 class=" text-[15px] text-[#606060]">Subsidiary</h2>
                        
                        ${getSubsidiary(data.SubsidiaryId)}
                    </div>
                    <div class="py-5 px-5 border-solid border-b border-[#DBDBDB] flex justify-between items-center ">
                        <h2 class=" text-[15px] text-[#606060]">Department</h2>
                        <p class="">${getDepartment(data.DeptId)}</p>
                    </div>
            
                    <div class="border-solid border-b border-[#DBDBDB] flex gap-5 flex-col justify-between items-center collapsible-section">
                        <div class="w-full py-5 px-5 hover:bg-gray-200 hover:cursor-pointer flex justify-between items-center toggle-btn">
                            <h2 class="text-[15px] text-[#606060]">Documents</h2>
                            <span class="text-gray-400 text-xl font-bold p-2 toggle-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        </div>
                            
                        <div class=" collapsible-content p-5 w-full hidden h-fit overflow-hidden">
                            <ul class="w-full flex flex-col gap-2">
                                ${generateDocumentList(sigledata.ContentDocuments)}
                            </ul>
                        </div>
                    </div>
                    <div class="border-solid border-b border-[#DBDBDB] flex gap-5 flex-col justify-between items-center collapsible-section">
                        <div class="w-full py-5 px-5 hover:bg-gray-200 hover:cursor-pointer flex justify-between items-center toggle-btn">
                            <h2 class="text-[15px] text-[#606060]">Version History</h2>
                            <span class="text-gray-400 text-xl font-bold p-2 toggle-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        </div>
                            
                        <div class=" collapsible-content p-5 w-full hidden h-fit overflow-hidden">
                            <ul class="w-full flex flex-col gap-2">
                                ${renderVariations(versions)}
                            </ul>
                        </div>
                    </div>
                
    
        `);    
    }
}

function generateDocumentList(contentDocuments) {
    return contentDocuments.map(item => `<li class=" flex items-center gap-3 p-2.5 border-solid border border-primary rounded text-primary font-bold text-[10px] ">
        <img class="w-4 h-5" src="./img/pdf.jpg" alt="doc type"/>
        <span>${item.FileName}</span>
    </li>`).join('');
}

function renderVariations(variations){
    return variations.map(item=>`
        <div class="border-solid border border-primary rounded p-2.5">
            <p class="text-xs"><span class="mr-4 text-gray-600 font-bold">Reviwed By:</span>${item.Reviewedby}</p>
            <p class="text-xs"><span class="mr-4 text-gray-600 font-bold">Created By:</span>${item.Createdby}</p>
            <p class="text-xs"><span class="mr-4 text-gray-600 font-bold">Date Reviewed :</span>${item.DateReviewed}</p>
        </div>
    `)
}

function getSubsidiary(selectedId) {
    const subsidiaries = Subsidiaries; // Assuming Subsidiaries is an array of subsidiary objects
    const selectElement = $('<select name="" id="" class=" p-2 rounded bg-"></select>');

    subsidiaries.forEach(subsidiary => {
        const optionElement = $(`<option value="${subsidiary.id}">${subsidiary.name}</option>`);

        // Check if the subsidiary's ID matches the selectedId
        if (subsidiary.id === selectedId) {
            optionElement.prop('selected', true);
        }

        selectElement.append(optionElement);
    });

    return selectElement.prop('outerHTML'); // Return the outerHTML string
}
function getDepartment(selectedId) {
    const Department = Departments; // Assuming Subsidiaries is an array of subsidiary objects
    const selectElement = $('<select name="" id="" class=" p-2 rounded bg-"></select>');

    Department.forEach(Dep => {
        const optionElement = $(`<option value="${Dep.id}">${Dep.name}</option>`);

        if (Dep.id === selectedId) {
            optionElement.prop('selected', true);
        }

        selectElement.append(optionElement);
    });

    return selectElement.prop('outerHTML'); // Return the outerHTML string
}     

function filterContent(filters,location) {
    let filteredContent = ''
    console.log('just clicked')
    if (location == 'request'){
        console.log('request')
        filteredContent=updaterequest.Result;
    }else{
        console.log('dashboard')
        filteredContent=contentData.Result;
    }


    // Apply filters based on other criteria (SubsidiaryId, DeptId, ContentType)
    if (filters.SubsidiaryId && filters.SubsidiaryId !== 'all') {
        filteredContent = filteredContent.filter(item => {
            return item.SubsidiaryId === parseInt(filters.SubsidiaryId);
        });
    }

    if (filters.DeptId && filters.DeptId !== 'all') {
        filteredContent = filteredContent.filter(item => {
            return item.DeptId === parseInt(filters.DeptId);
        });
    }

    if (filters.ContentType && filters.ContentType !== 'all') {
        filteredContent = filteredContent.filter(item => {
            return item.ContentType.toLowerCase() === filters.ContentType.toLowerCase();
        });
    }

    if (location == 'request'){
        populateTable(filteredContent)
    }else{
        renderContent(filteredContent);
    }
}

function isEmptyObject(obj) {
for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        return false;
    }
}
return true;
}

function filterContentBySearch(searchText) {
    const filteredContent = contentData.Result.filter(item => {
        return item.Title.toLowerCase().includes(searchText) || item.Description.toLowerCase().includes(searchText);
    });

    renderContent(filteredContent);
}

function markActiveTag(activeTag) {
    $('button[data-tag]').removeClass('bg-primary text-white');
    $(`button[data-tag="${activeTag}"]`).addClass('bg-primary text-white');
}

function loadContent(route) {
// Load content based on the selected route
switch (route) {
    case 'dashboard':
        $('#content').html('<h2>This is the Dashboard!</h2><p>Some dashboard content...</p>');
        break;
    case 'settings':
        $('#content').html('<h2>Settings Page</h2><p>Configure your settings here...</p>');
        break;
    default:
        $('#content').html('<h2>Page Not Found</h2>');
}
}

function modal(id){
console.log(id)
moretoggle()
}


function sharetoggle(){
$('.share').toggleClass('hidden');
}



function displayContent(){
    var displayDescription = document.getElementById('display-description');
    var displayContent = document.getElementById('display-content');
    displayDescription.innerHTML = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
    displayContent.innerHTML = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
}

function populateTable(data){
    const $requestContent = $('.requestTable');
    $requestContent.empty();
    $content= data

    $content.forEach(item=>{
        $requestContent.append(
            `<div data-id="${item.ContentId}" class="request grid grid-cols-5 hover:cursor-pointer hover:bg-gray-50 border-b border-solid border-gray-200">
                <div class=" w-full  py-[16px] px-[24px] text-sm">${item.Title}</div>
                <div class=" w-full  py-[16px] px-[24px] text-sm">
                    <div class="w-20 h-6 px-5 py-1 bg-neutral-100 rounded-3xl justify-center items-center gap-2.5 flex text-red-950 text-xs font-normal">
                        ${item.ContentType}
                    </div>
                </div>
                <div class=" w-full py-[16px] px-[24px] text-sm">
                    <p class="">
                        ${item.Description}
                    </p>
                </div>
                <div class=" w-full  py-[16px] px-[24px] text-sm">
                    <div class="w-full  p-2.5 bg-white rounded border border-solid border-red-800 justify-start items-center gap-2 inline-flex">
                        <div class="text-center text-white text-xs font-bold bg-red-500 p-1 rounded">PDF</div>
                        <div class=" flex-col justify-start items-start gap-2 flex">
                            <div class="self-stretch h-7 flex-col justify-start items-start flex">
                                <h2 class="self-stretch text-zinc-600 text-xs font-normal leading-none">Tech design requirements.pdf</h2>
                                <p class="self-stretch text-zinc-500 text-xs font-normal leading-none">200 KB</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=" w-full   py-[16px] px-[24px] text-sm">
                    <div class="w-20 h-6 px-5 py-1 bg-amber-100 rounded-3xl justify-center items-center gap-2.5 flex text-amber-600 text-xs font-normal  leading-none">
                        <div class="">${item.Status}</div>
                    </div>
                </div>
            </div>
        `
        )
    })
}






function animateMore(index) {
    gsap.timeline()
    .from( '.more', {
        opacity: 0, 
        duration:0.5,
    }).to(
        '.more',{
            opacity: 1, 
            duration: 0.5
        }
    ).from('.more-modal',{
        x:'100%',
        duration: 0.3
    }).to('.more-modal',{
        x:0,
        duration: 0.3
    })
}
