// frontend validatioan!
const username = document.getElementById("username");
const userComment = document.getElementById("user-comment");
//let username = document.getElementById("username");
//let userComment = document.getElementById("user-comment");
const sendData = document.getElementById("send-data");
const serverResponse = document.getElementById("server-response");
const usersComments = document.getElementById("users-comments");

function UserCommentAdd(username, comment, element) {
  const commentEl = document.createElement("p");
  commentEl.innerHTML = `<b>${username}</b><br>${comment}`;
  element.appendChild(commentEl);
}

sendData.addEventListener("click", async (event) => {
  event.preventDefault(); // Prevents form reloading
  const usernameValue = username.value.trim();
  const userCommentValue = userComment.value.trim();

  if (!usernameValue || usernameValue.length > 32) {
     alert("Insira um username de até 32 caracteres! (Enter a username of up 32 characters!)");
     return; // Stops function execution after executing "alert()"
     };
  if (!userCommentValue || userCommentValue.length > 32) {
     alert("Por favor, insira um comentário de até 32 caracteres! a(Please enter a comment of up to 32 charecters!)");
     return;
     };

  const userDataValues = new URLSearchParams();
  userDataValues.append("username", usernameValue);
  userDataValues.append("comment", userCommentValue);

  try {
      //const response = await fetch("http://127.0.0.1:8001/server_api/scripts/endpointAPI", {
      const response = await fetch("http://192.168.0.9:8001/server_api/scripts/endpointAPI", {
      //const response = await fetch("192.168.0.3:8001/server_api/scripts/endpointAPI", {
      //const response = await fetch("/server_api/scripts/endpointAPI", {
        method: "POST",
        headers: {
         "Content-Type": "application/x-www-form-urlencoded"
        },
        body: userDataValues.toString()
      });

    const APIresponse = await response.json();

    if (response.ok && APIresponse.status === "success") {
       serverResponse.innerHTML = APIresponse.message;
       UserCommentAdd(APIresponse.username, APIresponse.comment, usersComments);
    } else {
      serverResponse.innerHTML = APIresponse.message;
    }

  } catch (error) {
    serverResponse.innerHTML = "Error! server connect failed or username already exists );";
    console.log(error);
    };
});

async function loadComments() {
  try {
    const response = await fetch("http://192.168.0.9:8001/server_api/scripts/list_comments");
    const data = await response.json();
    if (data.status !== "success") {
       console.log(response, data);
       return
    }
    usersComments.innerHTML = "";
    data.message.forEach(comment_username => {
      UserCommentAdd(comment_username.username, comment_username.comment, usersComments);
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComments()
  setInterval(loadComments, 2000)
})
