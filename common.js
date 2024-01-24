const API_BASE_URL = "http://20.50.141.134:8011/";
const API_ENDPOINTS = {
    NEW_CONTENT_REQUEST: "_api/CaseMgt/NewContentRequest",
    NEW_CONTENT_REVIEW: "_api/CaseMgt/NewContentReview",
    REVIEW_CONTENT_REQUEST: "_api/CaseMgt/ReviewContentRequest",
    CREATOR_QUEUE: "_api/CaseMgt/CreatorQueue",
    REVIEWER_QUEUE: "_api/CaseMgt/ReviewerQueue",
    GET_ACTIVE_SUBSIDIARIES: "_api/UserMgt/GetActiveSubsidiaries",
    GET_ALL_SUBSIDIARIES: "_api/UserMgt/GetAllSubsidiaries",
    GET_DEPARTMENTS: "_api/UserMgt/GetDepartments",
    RETRIEVE_CONTENT: "_api/Content/RetrieveContent",
    GET_CONTENT_BY_ID: "_api/Content/GetContentbyId",
    TOP_15_CONTENT: "_api/Content/Top15",
    RECENTLY_UPDATED_CONTENT: "_api/Content/RecentlyUpdated",
    UPLOAD_DOCUMENTS: "_api/CaseMgt/UploadDocuments",
    CREATE_NEW_CONTENT: "_api/CaseMgt/CreateNewContent",
    GET_ALL_USERS: "_api/UserMgt/GetAllUserv2",
    GET_SINGLE_USERS: "_api/UserMgt/GetUserProfilebyUserName",
};

const API_TOKEN = "AxSWpRT1KOmNyJGHoE/PDAZZCustodianKMS123";

function makeApiCall(endpoint, method, requestData, successCallback, errorCallback) {
  var settings = {
      "url": API_BASE_URL + endpoint,
      "method": method,
      "timeout": 0,
      "headers": {
          "Content-Type": "application/json",
          "token": API_TOKEN
      },
      "data": JSON.stringify(requestData),
  };

  $.ajax(settings)
      .done(function (response) {
          if (successCallback) {
              successCallback(response);
          }
      })
      .fail(function (xhr, status, error) {
          if (errorCallback) {
              errorCallback(xhr, status, error);
          }
      });
}



const menu =[
    {
        header: "general"
    },
    {
        name: 'home',
        url:'/dashboard.html',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10.8186 2.30297C10.5258 2.07526 10.3794 1.9614 10.2178 1.91763C10.0752 1.87902 9.92484 1.87902 9.78221 1.91763C9.62057 1.9614 9.47418 2.07526 9.18141 2.30297L3.52949 6.6989C3.15168 6.99275 2.96278 7.13968 2.82669 7.32368C2.70614 7.48667 2.61633 7.67029 2.56169 7.86551C2.5 8.0859 2.5 8.32521 2.5 8.80384V14.833C2.5 15.7664 2.5 16.2331 2.68166 16.5896C2.84144 16.9032 3.09641 17.1582 3.41002 17.318C3.76654 17.4996 4.23325 17.4996 5.16667 17.4996H6.83333C7.06669 17.4996 7.18337 17.4996 7.2725 17.4542C7.3509 17.4143 7.41464 17.3505 7.45459 17.2721C7.5 17.183 7.5 17.0663 7.5 16.833V11.333C7.5 10.8662 7.5 10.6329 7.59083 10.4546C7.67072 10.2978 7.79821 10.1703 7.95501 10.0904C8.13327 9.99962 8.36662 9.99962 8.83333 9.99962H11.1667C11.6334 9.99962 11.8667 9.99962 12.045 10.0904C12.2018 10.1703 12.3293 10.2978 12.4092 10.4546C12.5 10.6329 12.5 10.8662 12.5 11.333V16.833C12.5 17.0663 12.5 17.183 12.5454 17.2721C12.5854 17.3505 12.6491 17.4143 12.7275 17.4542C12.8166 17.4996 12.9333 17.4996 13.1667 17.4996H14.8333C15.7668 17.4996 16.2335 17.4996 16.59 17.318C16.9036 17.1582 17.1586 16.9032 17.3183 16.5896C17.5 16.2331 17.5 15.7664 17.5 14.833V8.80384C17.5 8.32521 17.5 8.0859 17.4383 7.86551C17.3837 7.67029 17.2939 7.48667 17.1733 7.32368C17.0372 7.13968 16.8483 6.99275 16.4705 6.69891L10.8186 2.30297Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>` 
    },
    {
        name: 'recently updated',
        url:'/',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.9166 9.58333L17.2505 11.25L15.5833 9.58333M17.4542 10.8333C17.4845 10.5597 17.5 10.2817 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C12.3561 17.5 14.4584 16.4136 15.8333 14.7144M10 5.83333V10L12.5 11.6667" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
        name: 'categories',
        url:'/',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10.8337 5.83333L9.90404 3.9741C9.6365 3.439 9.50271 3.17144 9.30313 2.97597C9.12664 2.80311 8.91393 2.67164 8.68039 2.59109C8.4163 2.5 8.11716 2.5 7.5189 2.5H4.33366C3.40024 2.5 2.93353 2.5 2.57701 2.68166C2.2634 2.84144 2.00844 3.09641 1.84865 3.41002C1.66699 3.76654 1.66699 4.23325 1.66699 5.16667V5.83333M1.66699 5.83333H14.3337C15.7338 5.83333 16.4339 5.83333 16.9686 6.10582C17.439 6.3455 17.8215 6.72795 18.0612 7.19836C18.3337 7.73314 18.3337 8.4332 18.3337 9.83333V13.5C18.3337 14.9001 18.3337 15.6002 18.0612 16.135C17.8215 16.6054 17.439 16.9878 16.9686 17.2275C16.4339 17.5 15.7338 17.5 14.3337 17.5H5.66699C4.26686 17.5 3.5668 17.5 3.03202 17.2275C2.56161 16.9878 2.17916 16.6054 1.93948 16.135C1.66699 15.6002 1.66699 14.9001 1.66699 13.5V5.83333Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
        name: 'FAC',
        url:'/',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8.33333 7.0852C8.48016 6.6678 8.76998 6.31584 9.15144 6.09165C9.53291 5.86745 9.98141 5.7855 10.4175 5.86031C10.8536 5.93511 11.2492 6.16184 11.5341 6.50034C11.8191 6.83884 11.975 7.26726 11.9744 7.70973C11.9744 8.9588 10.1008 9.58333 10.1008 9.58333M10.1249 12.0833H10.1333M8.25 16L9.46667 17.6222C9.6476 17.8635 9.73807 17.9841 9.84897 18.0272C9.94611 18.065 10.0539 18.065 10.151 18.0272C10.2619 17.9841 10.3524 17.8635 10.5333 17.6222L11.75 16C11.9943 15.6743 12.1164 15.5114 12.2654 15.3871C12.4641 15.2213 12.6986 15.104 12.9504 15.0446C13.1393 15 13.3429 15 13.75 15C14.9149 15 15.4973 15 15.9567 14.8097C16.5693 14.556 17.056 14.0693 17.3097 13.4567C17.5 12.9973 17.5 12.4149 17.5 11.25V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V11.25C2.5 12.4149 2.5 12.9973 2.6903 13.4567C2.94404 14.0693 3.43072 14.556 4.04329 14.8097C4.50272 15 5.08515 15 6.25 15C6.65715 15 6.86072 15 7.04959 15.0446C7.30141 15.104 7.53593 15.2213 7.73458 15.3871C7.88357 15.5114 8.00571 15.6743 8.25 16Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
        header: "personal"
    },
    {
        name: 'bookmarks',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4.16699 6.5C4.16699 5.09987 4.16699 4.3998 4.43948 3.86502C4.67916 3.39462 5.06161 3.01217 5.53202 2.77248C6.0668 2.5 6.76686 2.5 8.16699 2.5H11.8337C13.2338 2.5 13.9339 2.5 14.4686 2.77248C14.939 3.01217 15.3215 3.39462 15.5612 3.86502C15.8337 4.3998 15.8337 5.09987 15.8337 6.5V17.5L10.0003 14.1667L4.16699 17.5V6.5Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
        children:[
            {
                name:'bookmark Child',
                url:"",
                icon:""
            }
        ]
    },
    {
        name: 'update request',
        url:'./updaterequest.html',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8.74928 11.2501L17.4993 2.50014M8.85559 11.5235L11.0457 17.1552C11.2386 17.6513 11.3351 17.8994 11.4741 17.9718C11.5946 18.0346 11.7381 18.0347 11.8587 17.972C11.9978 17.8998 12.0946 17.6518 12.2881 17.1559L17.78 3.08281C17.9547 2.63516 18.0421 2.41133 17.9943 2.26831C17.9528 2.1441 17.8553 2.04663 17.7311 2.00514C17.5881 1.95736 17.3643 2.0447 16.9166 2.21939L2.84349 7.71134C2.34759 7.90486 2.09965 8.00163 2.02739 8.14071C1.96475 8.26129 1.96483 8.40483 2.02761 8.52533C2.10004 8.66433 2.3481 8.7608 2.84422 8.95373L8.47589 11.1438C8.5766 11.183 8.62695 11.2026 8.66935 11.2328C8.70693 11.2596 8.7398 11.2925 8.7666 11.3301C8.79685 11.3725 8.81643 11.4228 8.85559 11.5235Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
        name: 'settings',
        url:'./settings.html',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" class="group-hover:stroke-white">
        <path d="M7.82888 16.1429L8.31591 17.2383C8.4607 17.5644 8.69698 17.8414 8.9961 18.0358C9.29522 18.2303 9.64434 18.3337 10.0011 18.3337C10.3579 18.3337 10.707 18.2303 11.0061 18.0358C11.3052 17.8414 11.5415 17.5644 11.6863 17.2383L12.1733 16.1429C12.3467 15.7542 12.6383 15.4302 13.0067 15.217C13.3773 15.0032 13.8061 14.9121 14.2317 14.9568L15.4233 15.0837C15.778 15.1212 16.136 15.055 16.4539 14.8931C16.7717 14.7312 17.0358 14.4806 17.2141 14.1716C17.3925 13.8628 17.4776 13.5089 17.4588 13.1527C17.4401 12.7966 17.3184 12.4535 17.1085 12.1651L16.4029 11.1957C16.1517 10.8479 16.0175 10.4293 16.0196 10.0003C16.0195 9.57248 16.155 9.15562 16.4067 8.80959L17.1122 7.84014C17.3221 7.55179 17.4438 7.20872 17.4625 6.85255C17.4813 6.49639 17.3962 6.14244 17.2178 5.83366C17.0395 5.52469 16.7754 5.27407 16.4576 5.11218C16.1397 4.9503 15.7817 4.8841 15.427 4.92162L14.2354 5.04847C13.8098 5.09317 13.381 5.00209 13.0104 4.78829C12.6413 4.57387 12.3496 4.24812 12.177 3.85773L11.6863 2.76236C11.5415 2.4363 11.3052 2.15925 11.0061 1.96482C10.707 1.77039 10.3579 1.66693 10.0011 1.66699C9.64434 1.66693 9.29522 1.77039 8.9961 1.96482C8.69698 2.15925 8.4607 2.4363 8.31591 2.76236L7.82888 3.85773C7.65632 4.24812 7.3646 4.57387 6.99554 4.78829C6.62489 5.00209 6.1961 5.09317 5.77054 5.04847L4.57517 4.92162C4.22045 4.8841 3.86246 4.9503 3.5446 5.11218C3.22675 5.27407 2.96269 5.52469 2.78443 5.83366C2.60595 6.14244 2.52092 6.49639 2.53965 6.85255C2.55839 7.20872 2.68009 7.55179 2.88999 7.84014L3.59554 8.80959C3.84716 9.15562 3.98266 9.57248 3.98258 10.0003C3.98266 10.4282 3.84716 10.845 3.59554 11.1911L2.88999 12.1605C2.68009 12.4489 2.55839 12.7919 2.53965 13.1481C2.52092 13.5043 2.60595 13.8582 2.78443 14.167C2.96286 14.4758 3.22696 14.7263 3.54476 14.8882C3.86257 15.05 4.22047 15.1163 4.57517 15.079L5.76684 14.9522C6.1924 14.9075 6.62119 14.9986 6.99184 15.2124C7.36228 15.4262 7.65535 15.752 7.82888 16.1429Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9.99961 12.5003C11.3803 12.5003 12.4996 11.381 12.4996 10.0003C12.4996 8.61961 11.3803 7.50033 9.99961 7.50033C8.6189 7.50033 7.49961 8.61961 7.49961 10.0003C7.49961 11.381 8.6189 12.5003 9.99961 12.5003Z" stroke="#606060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
]


const contentData ={
    "Result": [
      {
        "ContentId": 6,
        "RefNo": "11f61540-c1d2-4681-8f50-105d57848cfc",
        "Title": "Insurance claims management - General Insurance",
        "Description": "General Insurance claims management",
        "SubsidiaryId": 2,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-29T16:03:31.95",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-29T16:03:37.567",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Document",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      },
      {
        "ContentId": 7,
        "RefNo": "030d389b-64a1-41c2-a1e7-684a73abe634",
        "Title": "General Insurance Importance",
        "Description": "Importance of General Insurance claims management",
        "SubsidiaryId": 2,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-29T16:17:35.037",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-29T16:18:35.147",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Document",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      },
      {
        "ContentId": 8,
        "RefNo": "21f61540-c1d2-4681-8f50-105d57848cfd",
        "Title": "Insurance as a business",
        "Description": "Describe insurance as a business",
        "SubsidiaryId": 3,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-29T16:03:31.95",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-29T16:03:37.567",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Video",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      },
      {
        "ContentId": 9,
        "RefNo": "730d389b-64a1-41c2-a1e7-684a73abe623",
        "Title": "General Insurance Importance",
        "Description": "Importance of General Insurance claims management",
        "SubsidiaryId": 2,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-30T16:17:35.037",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-31T16:18:35.147",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Image",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      },
      {
        "ContentId": 11,
        "RefNo": "12f61540-c1d2-4681-8f50-105d57848cfc",
        "Title": "Property Development Management",
        "Description": "Property Development Management in Nigeria is a great business.",
        "SubsidiaryId": 3,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-29T16:03:31.95",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-29T16:03:37.567",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Article",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      },
      {
        "ContentId": 13,
        "RefNo": "130d389b-64a1-41c2-a1e7-684a73abe634",
        "Title": "SOP on how to develop business plan",
        "Description": "Effective SOP on how to develop business plan",
        "SubsidiaryId": 2,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-29T16:17:35.037",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-09-29T16:18:35.147",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Document",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      },
      {
        "ContentId": 14,
        "RefNo": "14f61540-c1d2-4681-8f50-105d57848cfd",
        "Title": "Insurance as a business",
        "Description": "Describe insurance as a business in Nigeria",
        "SubsidiaryId": 3,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-29T16:03:31.95",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-29T16:03:37.567",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Video",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      },
      {
        "ContentId": 15,
        "RefNo": "150d389b-64a1-41c2-a1e7-684a73abe623",
        "Title": "General Insurance Importance v2",
        "Description": "Importance of General Insurance claims management-version 2",
        "SubsidiaryId": 2,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-08-30T16:17:35.037",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-31T16:18:35.147",
        "Classification": "General",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Image",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
      }
    ],
    "ResponseCode": 100
}

const sigledata = {
    "Result": {
        "ContentId": 7,
        "RefNo": "030d389b-64a1-41c2-a1e7-684a73abe634",
        "Title": "General Insurance Importance",
        "Description": "Importance of General Insurance claims management",
        "SubsidiaryId": 2,
        "Uploadeby": "fruser@nsia.com.ng",
        "Created": "2023-10-29T16:17:35.037",
        "Modifiedby": "sharepoint@nsia.com.ng",
        "Modified": "2023-10-29T16:18:35.147",
        "Classification": "Private",
        "Status": "Published",
        "Archive": false,
        "ContentBody": "<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>",
        "ContentType": "Document",
        "DeptId": 1,
        "DelayPublication": true,
        "PublicationDate": "2023-10-30T00:00:00"
    },
    "Versions": [
        {
            "VersionId": 18,
            "ContentId": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "CurrentInfo": "Subject:General Insurance Importance\nDescription:Importance of General Insurance claims management\nContent Body:<p>Background:- The document is for management of claims for general business</p><p>Main Information:- claims information </p>\nContent Type:Document\nStatus:Published\nClassification:Private",
            "Created": "2023-10-29T16:18:35.23",
            "Createdby": "fruser@nsia.com.ng",
            "Reviewedby": "sharepoint@nsia.com.ng",
            "DateReviewed": "2023-10-29T16:18:35.147"
        }
    ],
    "ContentDocuments": [
        {
            "FileName": "030d389b-64a1-41c2-a1e7-684a73abe634_Claim2.pdf"
        },
        {
            "FileName": "030d389b-64a1-41c2-a1e7-684a73abe634_Claim3.pdf"
        }
    ],
    "Activities": [
        {
            "ID": 88,
            "Username": "fruser@nsia.com.ng",
            "IPAddress": "192.12.12.12",
            "ActionPerformed": "New Content",
            "DateModified": "2023-10-29T16:17:35.077",
            "RefNo": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "Comment": "New Content",
            "RelatedPage": "New Content",
            "LogType": "New Content"
        },
        {
            "ID": 89,
            "Username": "sharepoint@nsia.com.ng",
            "IPAddress": "12.13.14.12",
            "ActionPerformed": "Review Content",
            "DateModified": "2023-10-29T16:18:35.157",
            "RefNo": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "Comment": "Approved okay",
            "RelatedPage": "Review Content",
            "LogType": "Review Content"
        },
        {
            "ID": 90,
            "Username": "sharepoint@nsia.com.ng",
            "IPAddress": "12.12.31.12",
            "ActionPerformed": "Search",
            "DateModified": "2023-10-29T16:18:49.323",
            "RefNo": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "Comment": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "RelatedPage": "Search",
            "LogType": "Search"
        },
        {
            "ID": 92,
            "Username": "sharepoint@nsia.com.ng",
            "IPAddress": "12.12.31.12",
            "ActionPerformed": "Search",
            "DateModified": "2023-10-29T16:19:27.2",
            "RefNo": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "Comment": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "RelatedPage": "Search",
            "LogType": "Search"
        },
        {
            "ID": 93,
            "Username": "sharepoint@nsia.com.ng",
            "IPAddress": "12.12.31.12",
            "ActionPerformed": "Search",
            "DateModified": "2023-10-29T16:51:11.583",
            "RefNo": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "Comment": "030d389b-64a1-41c2-a1e7-684a73abe634",
            "RelatedPage": "Search",
            "LogType": "Search"
        }
    ],
    "ResponseCode": 100
}

const updaterequest={
  "Result": [
      {
          "ContentId": 22,
          "RefNo": "47db5a92-5022-4e93-9e6a-641651308441",
          "Title": "New Employee Onboarding",
          "Description": "New Employee Onboarding: This has to do with new staff registration and familiarity with the organization",
          "SubsidiaryId": 2,
          "Uploadeby": "dmsuser1@custodianplc.com.ng",
          "Created": "2023-12-29T12:24:15.623",
          "Reviewer": "dmsuser2@custodianplc.com.ng",
          "Modified": null,
          "Classification": "Private",
          "Status": "Submitted",
          "Archive": false,
          "ContentBody": "<p>Background:- This is a document prepared by the wprkforce team for new employee understanding of the organizational regualtions.</p><p>Main Information:- claims information </p>",
          "ContentType": "Document",
          "DeptId": 1,
          "RequestStatus": "Request is submitted",
          "DelayPublication": true,
          "PublicationDate": "2023-10-30T00:00:00",
          "Collaborator1": null,
          "Collaborator2": null,
          "Collaborator3": null,
          "Collaborator4": null,
          "Collaborator5": null,
          "Collaborate": null,
          "CollaborateStatus": null,
          "IsLocked": null,
          "CurrentStatus": "Open"
      },
      {
          "ContentId": 23,
          "RefNo": "6367fba8-e98a-4b19-81ca-1a1de74cfc93",
          "Title": "Staff Loan",
          "Description": "Staff Loan: THis is designed for employees for have short term loans for their immediate use.",
          "SubsidiaryId": 2,
          "Uploadeby": "dmsuser1@custodianplc.com.ng",
          "Created": "2023-12-29T12:26:31.747",
          "Reviewer": "dmsuser2@custodianplc.com.ng",
          "Modified": null,
          "Classification": "Private",
          "Status": "Submitted",
          "Archive": false,
          "ContentBody": "<p>Background:- This contains oinformation on how employee can access and utilize the staff loan package for al employees in the group of companies.</p",
          "ContentType": "Document",
          "DeptId": 1,
          "RequestStatus": "Request is submitted",
          "DelayPublication": true,
          "PublicationDate": "2023-10-30T00:00:00",
          "Collaborator1": null,
          "Collaborator2": null,
          "Collaborator3": null,
          "Collaborator4": null,
          "Collaborator5": null,
          "Collaborate": null,
          "CollaborateStatus": null,
          "IsLocked": null,
          "CurrentStatus": "Open"
      }
  ],
  "ResponseCode": 100
}


const Subsidiaries = [
    { name: "Tech Innovators Ltd", id: 1 },
    { name: "Eco Solutions Inc", id: 2 },
    { name: "Global Logistics Co", id: 3 },
    { name: "Healthcare Innovations", id: 4 },
    { name: "Financial Dynamics Ltd", id: 5 },
    { name: "Infinite Energy Corp", id: 6 },
    { name: "Smart Manufacturing Inc", id: 7 },
    { name: "Creative Media Solutions", id: 8 },
    { name: "Food Harmony Ltd", id: 9 },
    { name: "Urban Development Corp", id: 10 },
];

const Departments = [
    { name: "Human Resources", id: 1 },
    { name: "Marketing", id: 2 },
    { name: "Finance", id: 3 },
    { name: "Research and Development", id: 4 },
    { name: "Customer Support", id: 5 },
    { name: "Information Technology", id: 6 },
    { name: "Operations", id: 7 },
    { name: "Sales", id: 8 },
    { name: "Legal", id: 9 },
    { name: "Quality Assurance", id: 10 },
];

const SubsidiaryDepartmentRelationships = [
  {id:1, subId: 1, deptId: 1 },
  {id:2, subId: 3, deptId: 1 },
  {id:3, subId: 5, deptId: 1 },
  {id:4, subId: 2, deptId: 2 },
  {id:5, subId: 4, deptId: 2 },
  {id:6, subId: 6, deptId: 2 },
];

const ContentTypes = [
    { name: "Document", id: 1 },
    { name: "Video", id: 2 },
    { name: "Image", id: 3 },
    { name: "Article", id: 4 },
];

function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);

    const elapsedMilliseconds = now - date;
    const seconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (months >= 1) {
        return rtf.format(-months, 'month') + ' ago';
    } else if (days >= 1) {
        return rtf.format(-days, 'day') + ' ago';
    } else if (hours >= 1) {
        return rtf.format(-hours, 'hour') + ' ago';
    } else if (minutes >= 1) {
        return rtf.format(-minutes, 'minute') + ' ago';
    } else {
        return rtf.format(-seconds, 'second') + ' ago';
    }
}

