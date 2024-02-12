$(document).ready(function () {

        let location= window.location.pathname
        let currentSlide = 0;
        let filterObject = {};

        console.log(location);
        
        if (location === '/'){
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

            const notificationBtn = $('#notification-btn');

            loadSidebar();
            renderContent(contentData.Result);
            getNotifications()
            // getSubContents()
            notificationBtn.on('click', function() {
                $('#notification-dropdown').toggleClass('hidden');
            });
            
            // $(document).on('click', function(e) {
            //     if (!$(e.target).notificationBtn) {
            //         $('#notification-dropdown').addClass('hidden');
            //     }
            // });
            let content = [];
            MyDropdownComponent.initializeDynamicDropdown('#dropdownContainer', [
                { id: 'ContentType', label: 'Content Type', values: ContentTypes },
                { id: 'SubsidiaryId', label: 'Subsidiary', values: Subsidiaries }
                // Add more filters as needed
            ], function (filters) {
                console.log(filters);
                content = contentData.Result;

                if(filters.SubsidiaryId){
                    content = getSubContents(filters.SubsidiaryId)
                }
                filterContent(content, filters, 'SubsidiaryId', '');
                handleSubsidiaryFilter(filterObject);
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

            const searchParams = new URLSearchParams(window.location.search);
            const param = searchParams.get('refNo')
            console.log(param);
            const [ContentId, UserName] = param.split("_");

            shareData.ContentId = ContentId;
            shareData.UserName = UserName;

            if (param != null) {
                getSingleContent(param);
            }

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
            
            // Use event delegation for dynamic content
            $(document).on('click', '.gallery-item', function () {
                var imageUrl = $(this).data('image');
                $('#modalImage').attr('src', imageUrl);
                $('#galleryModal').toggleClass('hidden');
            });

            $('.close').on('click', function () {
                $('#galleryModal').toggleClass('hidden');
            });

            // Close modal on outside click
            $(window).on('click', function (e) {
                if (e.target.id === 'galleryModal') {
                    $('#galleryModal').toggleClass('hidden');
                }
            });

            $('#dropdown-button').on('click', function() {
                $('#dropdown-menu').toggleClass('hidden');
            });

            // Event handler for the search input
            $("#search-input").on("input", function() {
                const searchInput = $(this).val().trim().toLowerCase();
    
                // Clear existing content
                $("#dropdown-content").empty();
            
                // Filter users based on search input using the stored response data
                if (userData && userData.ResponseCode === 100) {
                    const filteredUsers = userData.Result.filter(user => user.UserFullName.toLowerCase().includes(searchInput));
            
                    // Append filtered users to the dropdown
                    filteredUsers.forEach(user => {
                        $("#dropdown-content").append(`
                            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md" data-sharedfor="${user.EmailAddress}">${user.UserFullName}</a>
                        `);
                    });
                }
            });

            $(document).on("click", "#dropdown-content a", function(event) {
                event.preventDefault();
                const selectedUserName = $(this).data('sharedfor');           
                $('#dropdown-menu').toggleClass('hidden');
                
                // Assign an object to shareDate
                shareData.user = selectedUserName;
            

                console.log("Selected user:", selectedUserName);
            });

            $("#sharepermision").on("change", function() {
                const selectedOption = $(this).val();
                shareData.viewOption = selectedOption;
                console.log(shareData)
            });
            
            // Event listener for the date input
            $("#setdate").on("change", function() {
                const selectedDate = $(this).val();
                shareData.expirationDate = selectedDate;
                console.log(shareData)
            });

        }else if(location === '/updaterequest.html' ){
            loadSidebar();
            populateTable(updaterequest.Result);
            initializeRequestDataTable(updaterequest.Result);

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
                        // handleSubsidiaryFilter(filterObject);
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


        }else if(location === '/manageusers.html' ){
            loadSidebar();
            
            console.log("manage user");

            $('#searchInput').on('input', function () {
                const searchText = $(this).val().toLowerCase();
                filterContentBySearch(searchText);
            });

            getUsers(function (userData) {
                // Now you have access to the user data, you can do something with it.
                console.log(userData);
                // Initialize DataTable with the received data
                initializeDataTable(userData);
            });
            

            $('#myTable tbody').on('click', 'tr', function () {
                if (table.row(this).data()) {
                    $(this).toggleClass('selected');
                }
            });
            


        }
   
});

function moresingleToggle(email){
    console.log(email)
    $('.more').toggleClass('hidden');
    animateMore()
    getSingleUser(email,renderSingleUser);

}

function renderSingleUser(data) {
    // Assuming data is an object with user information
    // Replace the property names with the actual properties from your data object

    // Full Name
    $('#fullNameValue').text(data.UserFullName || "");

    // Email
    $('#emailValue').text(data.EmailAddress || "");

    // Department
    $('#departmentValue').text(data.DeptId || "");

    // Role
    $('#roleValue').text(data.RoleID || "");

    // Last Log In
    $('#lastLogInValue').text(data.LastLoginDate || "");

    // 2FA
    $('#2faValue').text(data.SomeProperty || ""); // Replace "SomeProperty" with the actual property you want to display

    // Date Joined
    $('#dateJoinedValue').text(data.Created || "");

    // Invited By
    $('#invitedByValue').text(data.Createdby || "");
}


// Function to get users asynchronously
function getUsers(callback) {
    const requestData = {
        "UserName": "dmsuser1@custodianinsurance.com",
        "IPAddress": "127.0.0.1:5500"
    };

    makeApiCall(API_ENDPOINTS.GET_ALL_USERS, "POST", requestData, function (response) {
        console.log(response);
        if (callback && typeof callback === 'function') {
            callback(response.UserInfo);
        }
    }, function (xhr, status, error) {
        console.error("Error getting users:", status, error);
        // Handle error as needed
    });
}

function getSingleUser(email, callback) {
    const requestData = {
        "UserName": email,
        "IPAddress": "127.0.0.1:5500"
    };

    makeApiCall(API_ENDPOINTS.GET_SINGLE_USERS, "POST", requestData, function (response) {
        console.log(response);
        if (callback && typeof callback === 'function') {
            callback(response.Result);
        }
    }, function (xhr, status, error) {
        console.error("Error getting users:", status, error);
        // Handle error as needed
    });
}

// Function to initialize DataTable
function initializeDataTable(data) {
    $('#myTable').DataTable({
        single: false,
        data: data,
        columns: [
            { data: 'UserFullName', title: 'Name' },
            { data: 'EmailAddress', title: 'Email' },
            { data: 'Role', title: 'Role' },
            { data: 'LastLogin', title: 'Last Log in' },
            { 
                data: 'IsActive',
                title: '2FA',
                render: function (data, type, row) {
                    return data ? '<span class="">Enabled</span>' : '<span class="">Disabled</span>'; // Assuming IsActive is a boolean
                }
            },
            {
                data: null,
                title: '', // Empty title for the last column
                render: function (data, type, row) {
                    return `
                        <div class="flex gap-5">
                            <button onclick="changeUserRoleToggle()" class=" py-1 px-1 w-[90px] rounded-md text-primary text-xs font-semibold bg-gray-200 ">Change role</button>
                            <div class="flex dropdown items-center relative">
                                <button onClick="moresingleToggle('${row.EmailAddress}')" class=" min-w-5 min-h-5 p-1 rounded hover:bg-gray-100 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </button>
                                <div data-dropdown class=" hidden absolute p-2.5 flex flex-col rounded border-solid border border-gray-100 w-[150px] min right-0 bg-white">
                                    <button onclick="" class="  text-gray-600   ">User Details</button>
                                </div>
                            </div>
                        </div>
                    `
                }
            }
        ],
        dom: 'lBfrtip',
        buttons: [
            'copy', 'excel', 'pdf'
        ],
        initComplete: function () {
            $('#myTable thead tr').addClass('bg-primary/20');
        }
    });
}


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

// start: slider controls 

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

// end: slider controls 


// start: dashboard functions
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
// end: dashboard functions

// tab 
function showTab(containerId, tabName) {
    const $container = $(`#${containerId}`);
    const $tabContent = $container.find(`.tab-content.${tabName}-tab`);
    $container.find('.tab-content').hide();
    $tabContent.show();
}

// toggle modal functions
function moretoggle(){
    $('.more').toggleClass('hidden');
    animateMore()
    renderMoreContent()
}

function invitetoggle(){
    $('.invite').toggleClass('hidden');
    animateMore()
}
function changeUserRoleToggle(){
    $('.role').toggleClass('hidden');
    animateMore()
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
                    <p class=" text-textsub text-xs">
                        ${item.Description}
                    </p>
                    <div class="flex justify-between  items-center">
                        <div class="  bg-[#F9F5F5] rounded-full text-xs capitalize text-primary">${item.ContentType}</div>
                        <button class="bookmark-btn text-gray-300" onclick="bookMark(this,${item.ContentId},'${item.Title}')">
                            <span class="sr-only">bookmark</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                                <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
            </div>
    `)
    })
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
                                     <a href="${url}" class="capitalize font-semibold text-sm truncate hover:text-primary">${item.Title}</a>
                                </div>
                                <button onClick={modal(${"'" + item.RefNo + "'"})} class=" py-2 px-2 hover:bg-[#F5F5F5] rounded-full flex items-center justify-center">
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
                                 <div class=" bg-[#F4E6E6] rounded-md p-[10px] flex items-center justify-center mr-2  ">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M4.16699 6.5C4.16699 5.09987 4.16699 4.3998 4.43948 3.86502C4.67916 3.39462 5.06161 3.01217 5.53202 2.77248C6.0668 2.5 6.76686 2.5 8.16699 2.5H11.8337C13.2338 2.5 13.9339 2.5 14.4686 2.77248C14.939 3.01217 15.3215 3.39462 15.5612 3.86502C15.8337 4.3998 15.8337 5.09987 15.8337 6.5V17.5L10.0003 14.1667L4.16699 17.5V6.5Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                    </div>
                            </div>
                    </div>
                `)
    });
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



function filterContent(originalData, filters, keyToFilter, location) {
    let filteredContent = [...originalData]; // Copy the original data

    console.log('just clicked');

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


    // Add more conditions for other filters as needed

    if (location === 'request') {
        populateTable(filteredContent);
    } else {
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
    console.log("openSHare")
    getActiveUser()
    $('.share').toggleClass('hidden');
}

function bookmarktoggle(){
    $('.bookmark').toggleClass('hidden');
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




let filterObject = {};

// Global namespace for your components
const MyDropdownComponent = (function () {

    function initializeDynamicDropdown(containerSelector, filters, callback) {
        const $container = $(containerSelector);

        filters.forEach(filter => {
            const dropdownHTML = `
                <div class="dropdown relative" id="${filter.id}">
                    <button data-tag="${filter.id}" class="text-[#606060] group text-md md:text-md border border-solid border-[#606060] rounded-full py-[10px] px-[20px] flex gap-3 items-center">
                        <span class="text max-w-[150px] truncate">${filter.label}</span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="#606060" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </button>
                    <div data-dropdown class="hidden w-[271px] px-5 py-[15px] bg-white flex flex-col text-sm text-[#3F3F3F] gap-[10px] shadow-md absolute top-[3rem] left-0 z-[100] rounded-lg">
                        ${filter.values.map(value => `<button data-sub="${value.name}" data-value="${value.id}" class="py-1 hover:bg-gray-50 rounded-sm">${value.name}</button>`).join('')}
                    </div>
                </div>
                <div class="border-solid border-l-2 py-5 border-gray-300"></div>
            `;

            $container.append(dropdownHTML);

            // Initialize dropdown functionality
            initializeDropdown(`${containerSelector} [data-tag="${filter.id}"]`, `${containerSelector} [data-dropdown]`, filter.id, filter.values, callback);
        });
            // Add a "Clear" button
            const clearButtonHTML = `
            <button class="text-[#606060] group text-md md:text-md border border-solid border-[#606060] rounded-full py-[10px] px-[20px] flex gap-3 items-center clear-button">
                <span class="text max-w-[150px] truncate">Clear All</span>
            </button>
        `;
        $container.append(clearButtonHTML);

        // Handle click event for the "Clear" button
        $('.clear-button').click(function () {
            // Clear all filters
            
            console.log("clear btn");

            // close all dropdowns
            $('.dropdown [data-dropdown]').addClass('hidden');
            
            filterObject = {};

            // Update UI for each dropdown
            $('.dropdown [data-tag]').each(function () {
                const tag = $(this).data('tag');
                const $button = $(`${containerSelector} [data-tag="${tag}"]`);
                $button.find('.text').text(tag);
                $button.removeClass('bg-primary text-white').addClass('text-[#606060] border border-solid border-[#606060]');
            });
            
            if (callback && typeof callback === 'function') {
                callback(filterObject);
            }
        });
    }

    function initializeDropdown(buttonSelector, dropdownSelector, tag, values, callback) {
        const $button = $(buttonSelector);
        const $dropdown = $button.siblings('[data-dropdown]'); // Use siblings to target the adjacent sibling with data-dropdown
        const $dropdownId = $(this).attr('id');

        let currentSelectedValue = "";

        function closeOtherDropdowns() {
            // Close all other dropdowns
            $(`${buttonSelector}:not([data-tag="${tag}"])`).each(function () {
                const otherDropdown = $(this).attr('data-tag');
                $(`${containerSelector} [data-dropdown][data-sub="${otherDropdown}"]`).addClass('hidden');
            });
        }

        $button.click(function (e) {
            e.stopPropagation();
            // Close other dropdowns before toggling the clicked one
            closeOtherDropdowns();
            $dropdown.toggleClass('hidden');
        });
        
        $dropdown.find('[data-sub]').click(function () {
            const selectedName = $(this).data('sub');
            const selectedValue = tag === 'ContentType' ? $(this).data('sub') : $(this).data('value');

            if (filterObject[tag] === selectedValue) {
                filterObject[tag] = "";
                $button.find('.text').text(tag);
                $button.addClass('text-[#606060] border border-solid border-[#606060]').removeClass('bg-primary text-white');
                // filterContent({}, 'request');
                // handleSubsidiaryFilter(filterObject);

            } else {
                filterObject[tag] = selectedValue;
                // filterContent(filterObject, 'request');
                // handleSubsidiaryFilter(filterObject);

                currentSelectedValue = selectedValue;
                $button.find('.text').text(selectedName);
                $dropdown.addClass('hidden');

                $dropdown.find('[data-sub]').removeClass('bg-primary text-white');
                $button.addClass('text-[#606060] border border-solid border-[#606060]').removeClass('bg-primary text-white');
                $(this).addClass('bg-primary text-white');

                if ($(this).attr('data-sub')) {
                    $button.removeClass('text-[#606060] border border-solid border-[#606060]').addClass('bg-primary text-white');
                }
            }

            if (tag === 'all') {
                filterObject = {};
                filterContent({}, 'request');
                handleSubsidiaryFilter(filterObject);
            }

            // Call the callback function with the updated filterObject
            if (callback && typeof callback === 'function') {
                callback(filterObject);
            }
        });

        $(document).click(function () {
            // Close the dropdown when clicking outside
            $dropdown.addClass('hidden');
        });
    }

    // Expose functions or properties as needed
    return {
        initializeDynamicDropdown: initializeDynamicDropdown
        // Add other functions or properties here if needed
    };

})();



// single content functions and gallery start

function getSingleContent(id) 
{
    const [ContentId, UserName] = id.split("_");

    const requestData = {
        "ContentId":ContentId,
        "UserName": UserName.toLowerCase(),
        "IPAddress": "127.0.0.1:5500"
    };

    makeApiCall(
        API_ENDPOINTS.GET_CONTENT_BY_ID,
        "POST",
        requestData,
        handleSuccess,
        handleFailure
    );

    function handleSuccess(response) {
        console.log(response);

        if (response.ResponseCode === 100) {
            updatePageContent(response);
        }
    }

    function handleFailure(xhr, status, error) {
        console.error("Error getting content:", status, error);
        // Handle error as needed
    }

}

function updatePageContent(content) {
    var result = content.Result
    $('#txtDescription').text(result.Description);
    $('#txtTitle').text(result.Title);
    // $('#editor').html(quill.clipboard.dangerouslyPasteHTML(0, content.ContentBody));
    $('#PreviousComments').append(PreviousComment(content.Reviews));
    $('#ddlDocuments').html(generateDocumentList(content.ContentDocuments));

    const formattedValue = calculateAverageRating(content.Reviews).toFixed(1);

    $('#rating-value').text(formattedValue);
    const starElements = document.querySelectorAll('.rating span');

    // Dynamically change the color of stars based on the score
    $('.rating span').each((index, star) => {
        $(star).toggleClass('text-yellow-400', index < formattedValue);
    });

    const contentContainer = document.getElementById('display-content');


    if (isNonArticleContentType(result.ContentType)) {
        // Display non-article content HTML
        
        shareData.ContentType = result.ContentType;

        if (result.ContentType === 'Image') {
            const imageGallery = generateImageGallery(content.ContentDocuments);
            contentContainer.innerHTML = imageGallery;
        } else if (result.ContentType === 'Video') {
            const videoGallery = generateVideoGallery(content.ContentDocuments);
            contentContainer.innerHTML = videoGallery;
        } else if (result.ContentType === 'Document') {
            contentContainer.innerHTML = `${result.ContentBody}`;
        }
    } else {
        // Display article HTML
        contentContainer.innerHTML = `${result.ContentBody}`;
    }
}

function isNonArticleContentType(contentType) {
console.log("contentType: ",contentType)
return ["Image", "Document", "Video"].includes(contentType);
}

function PreviousComment(reviews) {
    if (reviews.length === 0) {
        return '<p>No reviews available.</p>';
    }

    const commentElements = reviews.map(review => createCommentElement(review));
    const commentsHtml = commentElements.join('');
    return commentsHtml;
}

function createCommentElement(review) {
return `
    <div class="flex flex-col gap-2 w-full">
        <p class="text-sm text-[#606060] text-justify text-xs">
            ${review.Comment}
        </p>
        <div class=" w-full flex items-center justify-between">
            <span class=" inline-flex text-primary capitalize text-ellipsis overflow-hidden text-[10px] w-24 break-words">${review.Reviewer}</span>
            <span class=" inline-flex text-text text-xs">${formatDate(review.ReviewDate)}</span>
        </div>
    </div>
`;
}

function formatDate(timestamp) {
const date = new Date(timestamp);
return date.toLocaleDateString();
}

function generateDocumentList(contentDocuments) {
if (contentDocuments.length === 0) {
    return '<p class=" text-md text-primary text-center capitalize">No documents.</p>';
}

return contentDocuments.map(document => createDocumentLink(document)).join('');
}

function createDocumentLink(document) {
return `
    <a href="${document.FileName}" class="text-xs text-gray-300 group py-2 px-2 border border-solid border-gray-300 rounded-md hover:border-primary flex justify-between items-center">
        <span class="group-hover:text-primary">
            ${document.FileName}
        </span>
        <span class="group-hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        </span>
    </a>
`;
}

function generateImageGallery(images) {
    if (!images || images.length === 0) {

        return '<p>No images available.</p>';
    }
    console.log(images)
    return `
        <div class="spotlight-group grid grid-cols-5 gap-2">
            ${images.map(image => `
                <div class=" flex items-center gallery-item hover:cursor-pointer border border-gray-200 rounded-lg overflow-hidden p-2" data-image="${image.FileName}">
                    <img src="${API_BASE_URL}Documents/SupportingDocs/${image.FileName}" alt="" class="spotlight object-cover">
                </div>
            `).join('')}
        </div>
    `;
}


function generateVideoGallery(videos) {
    return `
        <div class=" spotlight-group grid grid-cols-4 gap-2">
            ${videos.map((video, i) => `
                <div class="relative group w-full h-40">
                    <a class="spotlight" data-media="video"
                        data-src-mp4="${API_BASE_URL}Documents/SupportingDocs/${video.FileName}"
                        data-autoplay="true"
                        data-muted="true"
                        data-preload="true"
                        data-controls="true"
                        data-inline="false"
                    >
                        <div class=" relative group w-full h-full flex-col gap-5 hover:bg-gray-200 group cursor-pointer bg-gray-100 rounded-lg flex items-center justify-center p-5">
                            <span class=" p-5 rounded-full bg-gray-200 group-hover:bg-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg>                          
                            </span>
                            <span class=" text-[8px] w-full">${video.FileName}</span>
                            <button onclick="removeitem(${video.FileName})" class=" bg-gray-800 p-2.5 absolute group-hover:flex text-white hover:bg-gray-700 hover:cursor-pointer right-2 bottom-2 rounded-full hidden items-center justify-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
}


function calculateAverageRating(reviews) {
if (reviews.length === 0) {
    return 0; // Return 0 for an empty array or handle it as needed
}

const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
const averageRating = totalRating / reviews.length;

return averageRating;
}

function createPoster(videoUrl) {
    return new Promise((resolve) => {
        var video = document.createElement("video");
        video.src = videoUrl;

        // Listen for the 'loadedmetadata' event
        video.addEventListener('loadedmetadata', function() {
            var canvas = document.createElement("canvas");
            // Get dimensions of the parent container
            canvas.width = 400;
            canvas.height = 200;

            var context = canvas.getContext("2d");

            // Draw the video onto the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Clean up
            video.remove();

            // Return the canvas image as a data URL
            var imageData = canvas.toDataURL("image/jpeg");

            // Resolve the Promise with the image data
            resolve(imageData);
        });

        // Append the video to the body to trigger loading
        document.body.appendChild(video);
    });
}

// single content functions and gallery end



// notification functions
let NotificationCount = 0
function getNotifications() 
{

    const requestData = {
        "UserName": "dmsuser1@custodianinsurance.com",
        "IPAddress": "127.0.0.1:5500"
    };

    makeApiCall(
        API_ENDPOINTS.GET_ALL_NOTIFICATIONS,
        "POST",
        requestData,
        handleSuccess,
        handleFailure
    );

    function handleSuccess(response) {
        if (response.ResponseCode === 100) {
            console.log(response);
            response.Result.forEach(function(e){
                showToast('success', e.NotificationInfo)
            })
            console.log(response.Result.length)
            updateNotificationDropdown(response.Result)
            updateNotificationCount(response.Result.length)
        }
        
    }

    function handleFailure(xhr, status, error) {
        console.error("Error getting content:", status, error);
    }

}


function updateNotificationCount(count) {
    const note = $('.notification-count'); // assuming 'notification-count' is an ID
    if (count <= NotificationCount) {
        note.addClass('hidden');
    } else {
        note.removeClass('hidden');
        NotificationCount = count
        note.text(String(NotificationCount));
    }
}


function updateNotificationDropdown(notifications) {
    const dropdown = $('#notification-dropdown');
    dropdown.empty(); // Clear existing content

    notifications.forEach((notification, index) => {
      const notificationItem = $(`
        <div class="notification-item flex flex-col text-xs bg-gray-50 p-2.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-all ease-in-out">
          <div class="flex items-center justify-between">
            <span class="notification-title">${notification.NotificationInfo}</span>
            <span class="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            </span>
          </div>
          <div class="">
            <span class="notification-timestamp">${notification.Created}</span>
          </div>
        </div>
      `);

      // Attach onclick event to each dropdown item
      notificationItem.on('click', function() {
        dropdown.toggleClass('hidden')
        makeApiCallForNotification(notification.Id,notification.UserName); // Make API call or perform action
      });

      dropdown.append(notificationItem);
    });

    // Show the dropdown
    // dropdown.removeClass('hidden');
}

  // Mock function for making API call for a specific notification
  function makeApiCallForNotification(id,user) {
    // Replace this with your actual API call logic
    console.log(`API call for notification at index ${id}`);

    const requestData = {
        "UserName": user,
        "IPAddress": "127.0.0.1:5500"
    };

    makeApiCall(
        API_ENDPOINTS.REMOVE_SINGLE_NOTIFICATION,
        "POST",
        requestData,
        handleSuccess,
        handleFailure
    );

    function handleSuccess(response) {
        console.log(response);

        if (response.ResponseCode === 100) {
            getNotifications()
        }
    }

    function handleFailure(xhr, status, error) {
        console.error("Error getting content:", status, error);
        // Handle error as needed
    }
  }


  function bookMark(clickedBtn, id,title){
    
    bookmarktoggle()

    console.log(id)
    console.log(title)
    const btn = $(clickedBtn);
    const bookmarkModal = $('#bookmarkmodal'); // Ensure jQuery is included
    bookmarkModal.empty()
    // Append HTML with caution to avoid XSS vulnerabilities
    const message = `<p class="text-gray-500 text-center">Are you sure you want to remove <span class=" font-bold"> ${title}</span> from your personal bookmarks?</p>`;
    bookmarkModal.append(message);

    if(btn.hasClass('text-gray-300')){

        btn.removeClass('text-gray-300').addClass('text-primary')
    }else{
        btn.removeClass('text-primary').addClass('text-gray-300')
    }
  }



  function getSubContents(id) {

    const requestData = {
        "SubsidiaryId":id,
        "UserName": "dmsuser1@custodianinsurance.com",
        "IPAddress": "127.0.0.1:5500"
    };

    makeApiCall(
        API_ENDPOINTS.SUBSIDIARY_CONTENT,
        "POST",
        requestData,
        handleSuccess,
        handleFailure
    );

    function handleSuccess(response) {
        if (response.ResponseCode === 100) {
            console.log(response);
            return response.Result;
        }
        
    }

    function handleFailure(xhr, status, error) {
        console.error("Error getting content:", status, error);
    }

  }
  let userData = null;

  function getActiveUser() {

        const requestData = {
            "UserName": "dmsuser1@custodianinsurance.com",
            "IPAddress": "127.0.0.1:5500"
        };

        makeApiCall(
            API_ENDPOINTS.ACTIVE_USER,
            "POST",
            requestData,
            handleSuccess,
            handleFailure
        );

        function handleSuccess(response) {
            if (response.ResponseCode === 100) {
                // Clear existing content
                $("#dropdown-content").empty();
                userData = response;

                // Append each active user to the dropdown
                response.Result.forEach(user => {
                    $("#dropdown-content").append(`
                        <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">${user.UserFullName}</a>
                    `);
                });

            }
            
        }

        function handleFailure(xhr, status, error) {
            console.error("Error getting content:", status, error);
        }

  }

let shareData = {}; 
function shareContent() {
    // Check if shareData is null
    if (shareData !== null && Object.keys(shareData).length !== 0) {
        // If shareData is not null, use it in the request
        const requestData = {
            "UserName": shareData.UserName,
            "SharedWith": shareData.user,
            "Sharedby": shareData.UserName,
            "Permission": shareData.viewOption,
            "ContentType": shareData.ContentType,
            "ContentId": shareData.ContentId,
            "IPAddress": "127.0.0.1:5500",
        };

        makeApiCall(
            API_ENDPOINTS.SHARE_CONTENT,
            "POST",
            requestData,
            handleSuccess,
            handleFailure
        );
    } else {
        // If shareData is null, use default requestData
        
    }

    function handleSuccess(response) {
        if (response.ResponseCode === 100) {
            
        }   
    }

    function handleFailure(xhr, status, error) {
        console.error("Error getting content:", status, error);
    }
}




function removeItem(videoFileName) {
    // Get the element corresponding to the video file name
    const videoElement = document.querySelector(`[data-src-mp4*="${videoFileName}"]`);
    
    // Check if the element exists
    if (videoElement) {
        // Remove the parent container of the video element
        videoElement.parentElement.parentElement.remove(); // Assuming the parent of the video element is the parent container
        console.log(`Removed video: ${videoFileName}`);
    } else {
        console.log(`Video element not found: ${videoFileName}`);
    }
}


function initializeRequestDataTable(data) {
    $('#myTable').DataTable({
        single: false,
        data: data,
        columns: [
            { data: 'Title', title: 'Name' },
            { data: 'ContentType', title: 'Category' },
            { data: 'Description', title: 'Description' },
            { data: 'Description', title: 'Attachment', render:function (data,type,row){
                return `
                    <div class="w-full  p-2.5 bg-white rounded border border-solid border-red-800 justify-start items-center gap-2 inline-flex">
                        <div class="text-center text-white text-[10px] font-bold bg-red-500 p-1 rounded">PDF</div>
                        <div class=" flex-col justify-start items-start gap-2 flex">
                            <div class="self-stretch h-7 flex-col justify-start items-start flex">
                                <h2 class="self-stretch text-zinc-600 text-[10px] font-normal leading-none">Tech design requirements.pdf</h2>
                                <p class="self-stretch text-zinc-500 text-[10px] font-normal leading-none">200 KB</p>
                            </div>
                        </div>
                    </div>
                `
            } },
            { 
                data: 'Status',
                title: 'Status',
                render: function (data, type, row) {
                    if(data === "Submitted"){
                        // return '<span class=" py-2.5 px-5 bg-yellow-400/20 rounded-full text-yellow-500">Submitted</span>'
                        return '<span class=" py-2.5 px-5 bg-green-400/20 rounded-full text-green-500">Updated</span>'
                    }
                    if(data === "Updated"){
                    }
                }
            }
        ],
        dom: 'lBfrtip',
        buttons: [
            'copy', 'excel', 'pdf'
        ],
        initComplete: function () {
            $('#myTable thead tr').addClass('bg-primary/20');
        }
    });
}