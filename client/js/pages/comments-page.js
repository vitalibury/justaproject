import Post from "../post.js";
import utils from "../utils.js";
import modes from "../modes.js";
import PushNotifications from "../push-notification.js";
import { serverURL } from "../config/app-keys.js";
import notificationsList from "../notifications-list.js";

export default class PostComments extends Post {

  contentContainer = null;
  layout = null;
  commentFieldForm = null;
  notification = null;

  constructor() {
    super();
    this.notification = new PushNotifications();
    this.contentContainer = mainContent;
    this.commentFieldForm = commentField;
    modes['comments'] = this.renderPostCommentsPage;
  }

  renderPostCommentsPage = () => {
    utils.clearElementContent(this.contentContainer);
    utils.renderSpinner(this.contentContainer);
    utils.showElement(this.contentContainer);
    this.dataService.getPostWithComments(utils.getRouteParameter(1))
      .then((postWithComments) => {
        utils.clearElementContent(this.contentContainer);
        this.renderPostWithComments(postWithComments);
      })
      .catch(e => console.log(e));
  };


  renderPostWithComments = (postWithCommentsObj) => {
    const postsContainer = document.createElement('div');
    postsContainer.classList.add('posts-container');

    const post = this.createPost(postWithCommentsObj);
    post.classList.add('wide');
    post.append(this.createCommentField());

    const commentsContainer = document.createElement('div');
    commentsContainer.classList.add('post-comments');

    
    postsContainer.append(post);
    postsContainer.append(commentsContainer);
    this.contentContainer.append(postsContainer);
    this.renderPostComments(postWithCommentsObj.comments);
  };

  renderPost = (postObj) => {
    const post = this.createPost(postObj);
    post.classList.add('wide');
    this.contentContainer.append(post);
  };

  createCommentField = () => {
    const commentForm = document.createElement('form');
    commentForm.classList.add('comment-field-form');
    commentForm.innerHTML = this.commentFieldForm.innerHTML;
    return commentForm;
  };

  renderPostComments = (comments) => {
    console.log(comments)
    const commentsContainer = document.querySelector('.post-comments');
    utils.clearElementContent(commentsContainer);
    if(comments.length) {
      const commentsBlock = this.renderComments(comments);
      commentsContainer.append(commentsBlock);
    } else {
      commentsContainer.append("Комментариев пока нет.");
    }
  };

  renderComments = (comments) => {
    const commentsContainer =  document.createElement('div');
    comments.forEach(comment => {
      let innerComments;
      if(comment.answers) {
        innerComments = this.renderComments(comment.answers);
      }
      const commentBlock =  document.createElement('div');
      commentBlock.classList.add('comment-block')
      commentBlock.innerHTML = `
      <div class="comment-info">
        <img src="${serverURL}${comment.user.avatar}" class="post-avatar" alt="${comment.user.email}">
        <div class="comment-user"><b>${comment.user.email}</b></div>
        <div class="comment-date">${utils.convertDate(comment.date)}</div>
        <span class="material-icons delete-comment" data-comment-id="${comment._id}">
          delete_forever
        </span>
        </div>
        <div class="comment-content">
          ${comment.content}
        </div>
        <div class="comment-answer" data-for-comment="${comment._id}" data-level="${comment.level}" data-user-email="${comment.user.email}">
          Ответить
        </div>
      </div>
      `;
      if (innerComments) {
        commentBlock.append(innerComments);
      }
      commentsContainer.append(commentBlock);
    });
    return commentsContainer;
  };

  handleCommentSubmit = (e) => {
    const postId = utils.getRouteParameter(1);
    const commentField = e.elements[0];
    const commentValue = commentField.value;
    const answerValuesObject = commentField.commentObj;
    const commentObject = utils.createCommentObject(postId, commentValue, answerValuesObject);
    console.log(commentObject);
    if (!commentObject.content) {
      this.notification.showPushNotification(notificationsList.emptyCommentValue, "alert-warning");
      return;
    }
    e.reset();
    delete commentField.commentObj;
    this.dataService.createPostComment(commentObject)
      .then(comment => {
        return this.dataService.getPostComments(postId);
      })
      .then(comments => {
        this.renderPostComments(comments);
      })
      .catch(e => console.log(e));
  };

  handleCommentDeleteBtn = (e) => {
    const commentId = e.dataset.commentId;
    this.dataService.deletePostComment(commentId)
      .then(obj => {
        this.notification.showPushNotification(obj.message, "alert-warning");
        const postId = utils.getRouteParameter(1);
        return this.dataService.getPostComments(postId);
      })
      .then(comments => {
        console.log(comments);
        this.renderPostComments(comments);
      })
      .catch(e => console.log(e));
  };

  handleCommentAnswerBtn = (e) => {
    const commentField = document.querySelector('.comment-field');
    commentField.value = `${e.dataset.userEmail}, `;
    commentField.commentObj = Object.assign({}, e.dataset);
    delete commentField.commentObj.userEmail
    commentField.focus();
  };
};
