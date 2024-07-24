const parent = document.getElementById("drop-list");
domo.get("/domo/users/v1?includeDetails=true&limit=200").then(function(data) {
  //username and id
  data.forEach((element) => {
    const username = document.createElement("option");
    username.value = element.id;
    username.textContent = element.displayName;
    parent.appendChild(username);
  });
});

$(document).ready(function(){
  $('.option-list').select2()
})

// getting current user name
const user = domo.env.userId;
let current_user;

domo.get(`/domo/users/v1/${user}?includeDetails=true`).then(function(data){
  current_user = data.displayName;
  //console.log(current_user)
});

const Requestbtn = document.getElementById("request-btn");
Requestbtn.addEventListener("click", () => {
  const Requester_name = document.getElementById("requester-name").value;
  
  const Request_amount = document.getElementById("request-amount").value;

  const Due_date = document.getElementById("due-date").value;

  const currency_symbol = document.getElementById("currency-symbol").value;

  const user_email = document.getElementById("email").value;

  const select_company = document.getElementById("select-company").value;

  const account = document.getElementById("account").value;

  const UserId = parent.value;
  const userName = parent.options[parent.selectedIndex].text;

  const body_content = `<p>Hi ${userName},</p>
  <p>${select_company} ${current_user} <b><i>${Request_amount} ${currency_symbol}</i></b> payment.</p>
  <p>You need to make a payment before <u>${Due_date}</u></p>
  <p style="margin-bottom: 0;">Thanks,</p><p>${current_user}</p>`;

  //const selectedUsers = [...parent.selectedOptions].map((each_user_id) => each_user_id.value);
  //console.log(selectedUsers)
  
  const startWorkflow = (alias, body) => {
    domo.post(`/domo/workflow/v1/models/${alias}/start`, body);

  };
  
    startWorkflow("send_email", { to: UserId, sub: `Payment Request from ${select_company} ${Requester_name}`,body: `${body_content}`,
    })

  // console.log(Request_amount)
  // console.log(Requester_name)
  // console.log(Due_date)
  // console.log(user_email)
  // console.log(currency_symbol)
  // console.log(account)
  // console.log(select_company)
  const finalData = {
    "content": {
      "requested_by":{
                    name: `${current_user}`,
                    user_id: `${user}`
                  },
      "requested_to":{
                    user_id: `${UserId}`,
                    name: `${userName}`,
                    user_email: `${user_email}`
                  },
      "contact_details":{
                    name:  `${Requester_name}`,
                    email: `${user_email}`
                  },
      "request_details":{
                    amount:{
                          currency: `${currency_symbol}`,
                          amount: `${Request_amount}`,
                          due_date: `${Due_date}`
                          }
                      },
                      company_name: `${select_company}`,
                     destination_account: `${account}`
        },
      }

domo.post(`/domo/datastores/v1/collections/Payment_Request/documents/`, finalData)
    .then((response) => {
      console.log("Payment Request Created:", response);
      alert("Payment request submitted successfully!");
    });
});
