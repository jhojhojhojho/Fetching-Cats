window.addEventListener("DOMContentLoaded", (event) => {
  //get the picture
  const catPic = document.querySelector(".cat-pic");
  const catPicBtn = document.getElementById("new-pic");
  const catPicLoader = document.querySelector(".loader");
  const catPicError = document.querySelector(".error");
  const getCatImg = async () => {
    try {
      const res = await fetch("/kitten/image");
      //fetch is used to get the image from the backend
      if (!res.ok) {
        const json = await res.json();
        throw json;
      }
      const json = await res.json();
      //this is making the image into a readable object.
      //receives the data, unpacks it and converts into js data
      //we need to await it because it's not supposed to happen in an instant
      catPic.src = json.src;
      //referencing the source and then keying into the json object which has the source.
      //setting the source (unknown in the html) to equal what's in the backend
    } catch (err) {
      catPicError.innerHTML = err.message;
      //when console.logging "err", message comes from there.
    }
  };
  catPicBtn.addEventListener("click", async () => {
    //we await so that the "Loading" actually waits
    catPicLoader.innerHTML = "Not so fast...";
    await getCatImg();
    catPicLoader.innerHTML = "";
  });

  //upvote
  const catUpVote = document.getElementById("upvote");
  const catDownVote = document.getElementById("downvote");
  const catScore = document.querySelector(".score");
  const upVote = async () => {
    try {
      const res = await fetch("/kitten/upvote", {
        method: "PATCH",
        //no need for body or headers since we're updating something that already exists
      });
      if (!res.ok) {
        const json = await res.json();
        throw json;
      }
      const json = await res.json();
      catScore.innerHTML = json.score;
    } catch (err) {}
  };
  catUpVote.addEventListener("click", () => {
    upVote();
  });
  //we don't need access to the event to do anything in this case

  //downvote
  const downVote = async () => {
    try {
      const res = await fetch("/kitten/downvote", {
        method: "PATCH",
      });
      if (!res.ok) {
        const json = await res.json();
        throw json;
      }
      const json = await res.json();
      catScore.innerHTML = json.score;
    } catch (err) {}
  };
  catDownVote.addEventListener("click", () => {
    downVote();
  });

  //Create comment
  const catForm = document.querySelector(".comment-form");

  const catComments = async (event) => {
    event.preventDefault();
    //form's default is to refresh

    const form = new FormData(catForm);
    const comment = form.get("user-comment");
    //form.get is a method of formData which returns the first value associated with a key within the formData object
    //"comment" is a key in body object that has a value(find in the index.js)

    const res = await fetch("/kitten/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    const json = await res.json();
    //return is an array of comments for the given picture
    _catComments(json.comments);
    //gives us the array that is inside of an object so we need to access the key
    //not too sure about this one

    //trying to make the comment section set to empty once i update a button 
    // let innerComment = document.createElement("div");
    // console.log(innerComment);
    // catForm.appendChild(innerComment);
    // innerComment.innerHTML = "";
  };

  catForm.addEventListener("submit", (event) => {
    catComments(event);
  });





  //Helper
  const catDiv = document.querySelector(".comments");
  //biggest box where the comments are going to live

  const _catComments = function (array) {
    catDiv.innerHTML = "";
    //resetting the comment section

    array.forEach((el, i) => {
      //index is the unique id
      const catDeleteBtn = document.createElement("button");
      //place inside the loop to create the button at each iteration
      catDeleteBtn.setAttribute("id", i);
      //name of attribute and setting the attribute to i
      let commentBlock = document.createElement("div");
      //smaller box where each comment and button live
      let commentEle = document.createElement("p");
      commentEle.innerHTML = el;
      catDeleteBtn.innerHTML = "delete";
      commentBlock.appendChild(commentEle);
      commentBlock.appendChild(catDeleteBtn);
      catDiv.appendChild(commentBlock);
      //big box inside smaller box
    });
  };





  //delete
  const deleteComment = async (event) => {
    const res = await fetch(`/kitten/comments/${event.target.id}`, {
      //event.target to access attributes of the div we created
      //event delegation: with event.target, we don't have to set up an individual click handler on each button
      //at the param give me the id
      //we erased :id fo "/kitten/comments/:id" which was a place holder
      method: "DELETE",
    });
    const json = await res.json();
    _catComments(json.comments);
    //returns array minus the deleted items
  };
  catDiv.addEventListener("click", (event) => {
    deleteComment(event);
    //event is giving us access to target.id
  });
  //alternative, we don't have to keep track of the events
  //catDiv.addEventListener('click', deleteComment);
});
