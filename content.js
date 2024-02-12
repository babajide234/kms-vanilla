
var quill;
$(document).ready(function () {

    loadSidebar();
    renderContent(contentData.Result);
    getSubsidiary();
    getDepartment();

    createNewContent()
    window.addEventListener('beforeunload', function () {
        localStorage.removeItem('newContentId');
    });

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike','link', 'image'],        // toggled buttons
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];
    quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow',
        placeholder: '',
    });

    $("#article, #image, #video, #document").addClass('hidden');
    $("#article").removeClass('hidden');

    $("#contentType").change(function () {
        var selectedValue = $(this).val();
        $("#article, #image, #video,#document").addClass('hidden');
        $("#" + selectedValue).removeClass('hidden');
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

    populateDropdown(Subsidiaries, 'organization');
    populateDropdown(ContentTypes, 'type');
    populateDropdown(Departments, 'department');
    
    let filterObject = {};

    $('.dropdown').each(function () {
        const $button = $(this).find('[data-tag]');
        const $dropdown = $(this).find('[data-dropdown]');
    
        let currentSelectedValue = ""; 


        $button.click(function (e) {
            e.stopPropagation(); 
            $dropdown.toggleClass('hidden');
        });

        $dropdown.find('[data-sub]').click(function () {
            const selectedValue = $(this).data('sub');

            // Check if the selected value is already the current selected value
            if (filterObject[$button.data('tag')] === selectedValue) {
                // If it is the same value, remove the selection
                filterObject[$button.data('tag')] = ""; // Clear the selected value from filterObject
                $button.find('.text').text($button.data('tag')); // Clear the button text
                $(this).removeClass('bg-primary text-white'); // Remove the styling from the selected option
            } else {
                // Update the filter object
                filterObject[$button.data('tag')] = selectedValue;


                filterContent(filterObject);

                currentSelectedValue = selectedValue; 
                // Update the current selected value
                
                $button.find('.text').text(selectedValue);
                $dropdown.addClass('hidden');

                $dropdown.find('[data-sub]').removeClass('bg-primary text-white');
                $(this).addClass('bg-primary text-white');

                if ($(this).attr('data-sub')) {
                    $button.removeClass('text-[#606060] border border-solid border-[#606060]').addClass('bg-primary text-white');
                } else {
                    // If data-sub attribute is not present, you can add an else statement to handle that case
                }
            }
        });


        $(document).click(function () {
            $dropdown.addClass('hidden');
        });
    });
    
    filterContent('all');
    markActiveTag('all');

    $('.media-upload-container').on('dragover', function (e) {
        e.preventDefault();
        $(this).removeClass('border-gray-200').addClass('border-primary');
    });

    $('.media-upload-container').on('dragleave', function () {
        $(this).removeClass('border-primary').addClass('border-gray-200');
    });

    $('.media-upload-container').on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass('border-primary').addClass('border-gray-200');

        var files = e.originalEvent.dataTransfer.files;
        handleFiles(files, $(this));
        
    });

    $('.media-upload-container').on('click', function () {
        $(this).find('input[type=file]').click();
    });

    $('input[type=file]').on('change', function () {
        var files = this.files;
        handleFiles(files, $(this).closest('.media-upload-container'));
    });    

    // $('#submitButton').on('click', function() {
    //     SubmitContent();
    // });
})

function SubmitContent() {
        // Get values from input, select, and file elements
        var description = $('#descriptioninput').val();
        var contentType = $('#contentType').val();
        var content = quill.getContents();
        var classification = $('#classificationselect').val();
        var subsidiary = $('#subsidiaryselect').val();
        var department = $('#departmentselect').val();
        var IPAddress = '127.0.0.1:5500'
        var RefNo = getNewContentId();
        console.log(RefNo);

        // Validate the fields
        if (description.trim() === '') {
            showError('Description is required.');
        } else if (RefNo === null) {
            showError('RefNo is required.');
        } else if (contentType.trim() === '') {
            showError('Content Type is required.');
        } else if (classification.trim() === '') {
            showError('Classification is required.');
        } else if (subsidiary.trim() === '') {
            showError('Subsidiary is required.');
        } else if (department.trim() === '') {
            showError('Department is required.');
        } else {
            let data= {
                "DeptId": department,
                "SubsidiaryId": subsidiary,
                "AccessType": classification,
                "Uploadedby": $('#emailAddy').val(),
                "BriefDescription": description,
                "Subject": $('#txtTitle').val().toLowerCase(),
                "ContentType": contentType,
                "ContentBody": content,
                "Status": $('#statusselect').val(),
                "IPAddress": IPAddress,
                "RefNo": RefNo,
                "DelayPublication": '',
                "PublicationDate": $('#txtPublicationDate').val(),
                "Archive": false
            }
            let Docdata = {
                "DeptId": department,
                "SubsidiaryId": subsidiary,
                "AccessType": classification,
                "Uploadedby": $('#emailAddy').val(),
                "BriefDescription": description,
                "Subject": $('#txtTitle').val().toLowerCase(),
                "ContentType": contentType,
                "Status": $('#statusselect').val(),
                "IPAddress": IPAddress,
                "RefNo": RefNo,
                "DelayPublication": '',
                "PublicationDate": $('#txtPublicationDate').val(),
                "Archive": false
            }

            console.log(data);
            console.log(Docdata);
            // makeApiCall(API_ENDPOINTS.NEW_CONTENT_REQUEST, "POST", contentType === "article"? data : Docdata , function (response) {
            //     // Handle successful content creation
            //     console.log(response)
            //     const createdContentId = response.ResponseMessage;
            //     showSuccess("success sent ");
            //     redirectToWithDelay("/dashboard.html", 4000);

            // }, function (xhr, status, error) {
            //     console.error("Error Submiting content:", status, error);
            //     // Handle error as needed
            // });
            // Your code to submit the form or perform other actions
            // For example: $.ajax({ method: 'POST', url: 'your_api_url', data: data, success: function(response) { /* Handle success */ }, error: function(error) { /* Handle error */ } });
}
}

function ValidateUser() {
    // Check localStorage for the token
    const userToken = localStorage.getItem('userToken');

    // If token is not available, set a global isLoggedIn state to false
    if (!userToken) {
        // Assuming you have a global variable named isLoggedIn
        isLoggedIn = false;
    } else {
        // Token is available, set isLoggedIn to true or perform additional validation
        isLoggedIn = true;
    }

    // Return true if logged in, or false otherwise
    return isLoggedIn;
}

function PublicationDate() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    // let currentDate = `${day}-${month}-${year}`;

    var mthval;
    console.log(month);
    console.log(month.toString().length);

    mthval = month.toString().length === 1 ? "0" + month : month;

    let currentDate = `${year}-${mthval}-${day}`;
    
    if ($('#publicationSelect').val() === "No") {
        $('#txtPublicationDate').val(currentDate);
        $('#txtPublicationDate').prop("disabled", true);
    } else {
        $('#txtPublicationDate').val('');
        $('#txtPublicationDate').prop("disabled", false);
    }
}

function createNewContent() {
        // Add logic for preparing the requestData for creating new content if needed
        
        const newContentId = localStorage.getItem('newContentId');
        if(!newContentId){

            const requestData = {
                "UserName": "dmsuser1@custodianinsurance.com",
                "IPAddress":"127.0.0.1:5500"
            };
            
            makeApiCall(API_ENDPOINTS.CREATE_NEW_CONTENT, "POST", requestData, function (response) {
                // Handle successful content creation
                const createdContentId = response.ResponseMessage;

                // Save the created content ID to localStorage for future reference
                localStorage.setItem('newContentId', createdContentId);
            }, function (xhr, status, error) {
                console.error("Error creating new content:", status, error);
                // Handle error as needed
            });
        }else{
            // get the id from the local storage
            console.log("Content ID already present:", newContentId);

        }
}

function redirectToWithDelay(url, delayMillis) {
    setTimeout(function () {
        window.location.href = url;
    }, delayMillis);
}

// Example usage:
// Redirect to "https://example.com" after a delay of 2000 milliseconds (2 seconds)


// Example usage:

function getNewContentId() {
    return localStorage.getItem('newContentId');
}

function handleFiles(files, container) {
    var dataType = container.data('type');
    var stack = $('#' + dataType + 'Stack');

    // Append each file to the respective stack
    for (var i = 0; i < files.length; i++) {
        (function (file, index) { // Use a closure to capture the correct file
            var reader = new FileReader();

            reader.onload = function (e) {
                var mediaItem;

                if (file.type.startsWith('image/')) {
                    mediaItem = createImageItem(file, e.target.result, index);
                } else if (file.type.startsWith('video/')) {
                    mediaItem = createVideoItem(file, e.target.result, index);
                } else if (file.type.startsWith('application/pdf')) {
                    mediaItem = createPdfItem(e.target.result, file.name);
                } else {
                    mediaItem = createUnsupportedItem(file.type, file.name);
                }
                stack.prepend(mediaItem);

                // Upload the file after creating the media item
                uploadFileWithProgress(file, index);
            };

            reader.readAsDataURL(file);
        })(files[i], i);
    }
    stack.on('click', '.delete-icon', function () {
        $(this).closest('.media-item').remove();
    });
}

function createImageItem(file, imageUrl, index) {
    return $(`
        <div class="media-item relative group w-full h-40">
            <img class="object-fit-cover w-full h-full rounded" src="${imageUrl}" alt="Image ${index + 1}">
            <button class="delete-icon absolute top-3 right-3 bg-white text-gray-600 p-1 rounded-full opacity-0 group-hover:opacity-100" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="screen absolute w-full h-full bg-black/20 flex justify-center items-center p-10 top-0 left-0">                                    
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="progress-bar bg-blue-600 h-2.5 rounded-full" style="width: 0%"></div>
                </div>
            </div>
        </div>
    `);
}

function createVideoItem(file, videoUrl, index) {
    return $(`
        <div class="media-item relative group w-full h-40">            
            <video class="object-fit-cover w-full h-full rounded" controls><source src="${videoUrl}" type="${file.type}"></video>
            <button class="delete-icon absolute top-3 right-3 bg-white text-gray-600 p-1 rounded-full opacity-0 group-hover:opacity-100" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="screen absolute w-full h-full bg-black/20 flex justify-center items-center p-10 top-0 left-0">                                    
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="progress-bar bg-blue-600 h-2.5 rounded-full" style="width: 0%"></div>
                </div>
            </div>
        </div>
    `);
}

function createPdfItem(file, pdfUrl) {
    return $(`
        <div class="media-item relative group w-full h-40">
            <iframe src="${pdfUrl}" width="100%" height="100%"></iframe>
            <p>${file.name}</p>
            <div class="screen absolute w-full h-full bg-black/20 flex justify-center items-center p-10 top-0 left-0">                                    
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="progress-bar bg-blue-600 h-2.5 rounded-full" style="width: 0%"></div>
                </div>
            </div>
        </div>
    `);
}

function createUnsupportedItem(file) {
    return $(`
        <div class="media-item relative group w-full h-40">
            <p>Unsupported file type: ${file.type}</p>
            <p>${file.name}</p>
        </div>
    `);
}

function uploadFileWithProgress(file, index) {
    const uploadEndpoint = API_BASE_URL + API_ENDPOINTS.UPLOAD_DOCUMENTS;

    const formData = new FormData();
    formData.append('files', file);
    formData.append('fileName', getNewContentId() + "_" + file.name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadEndpoint, true);

    xhr.upload.addEventListener('progress', function (e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            // Update the progress bar based on the percentComplete value
            updateProgressBar(index, percentComplete);
        }
    });

    xhr.onload = function () { 
        if (xhr.status === 200) {
            // Successful upload
            const response = JSON.parse(xhr.responseText);
            // Handle the response as needed
        } else {
            // Error during upload
            console.error('Upload failed with status:', xhr.status);
            // Handle the error as needed
        }
    };

    xhr.onerror = function () {
        console.error('Error during upload');
        // Handle the error as needed
    };

    xhr.send(formData);
}

// Update the progress bar based on the upload progress
function updateProgressBar(index, percentComplete) {
    const progressBar = $('.media-item:eq(' + index + ') .progress-bar');
    progressBar.css('width', percentComplete + '%');
}

function showTab(tabName) {
    $('.tab-content').hide();
    $(`.${tabName}-tab`).show();
}

function showError(message) {
    $.toast({
        heading: 'Error',
        text: message,
        showHideTransition: 'fade',
        icon: 'error'
    });
}
function showSuccess(message) {
    $.toast({
        heading: 'Success',
        text: message,
        showHideTransition: 'fade',
        icon: 'success'
    });
}

function populateDropdown(data, dropdownId) {
    const dropdown = $(`#${dropdownId} [data-dropdown]`);
    data.forEach(item => {
        const button = `<button data-sub="${item.name}" class="py-1 hover:bg-gray-50 hover:text-primary text-left px-10 rounded-sm">${item.name}</button>`;
        dropdown.append(button);
    });
}

function renderContent(content) {
    const $dashboardContent = $('.dashboard-content');
    $dashboardContent.empty();
    console.log(content)
    content.forEach(item=>{

        $dashboardContent.append(`
            <div class=" w-full flex flex-col justify-between gap-2 border border-border border-solid bg-bgsecond/20 overflow-hidden rounded-lg p-2 group">
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
                            <a href="/article.html" class="capitalize font-semibold text-sm truncate hover:text-primary">${item.Title}</a>
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

function getSubsidiary() {
        const subsidiaries = Subsidiaries; 
        const selectElement = $('#subsidiaryselect');

        subsidiaries.forEach(subsidiary => {
            const optionElement = $(`<option value="${subsidiary.id}">${subsidiary.name}</option>`);

         
            selectElement.append(optionElement);
        });

}

function getDepartment() {
    const Department = Departments; 
    const selectElement = $('#departmentselect');
    // Populate options with subsidiaries
    Department.forEach(Dep => {
        const optionElement = $(`<option value="${Dep.id}">${Dep.name}</option>`);
        selectElement.append(optionElement);
    });
}     


function filterContent(filters) {
    let filteredContent = contentData.Result;


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

    renderContent(filteredContent);
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

function moretoggle(){
    $('.more').toggleClass('hidden');
    animateMore()
}
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





