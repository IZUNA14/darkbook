(() => {
  const STORAGE_KEY = 'darkbook-state-v1';

  const demoUsers = [
    {
      id: 'u-demo-1',
      fullName: 'Nyx Voss',
      username: 'nyxvoss',
      email: 'nyx@darkbook.test',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      bio: 'Architect of private signals. Building honest rooms in chaotic cities.',
      location: 'Berlin, DE',
      joined: '2024-01-15',
      privacy: { publicProfile: true, friendsOnlyPosts: true, hideActivity: false }
    },
    {
      id: 'u-demo-2',
      fullName: 'Vesper Vale',
      username: 'vesper',
      email: 'vesper@darkbook.test',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      bio: 'Night analyst. Strategy in motion.',
      location: 'Paris, FR',
      joined: '2023-10-03',
      privacy: { publicProfile: true, friendsOnlyPosts: true, hideActivity: false }
    },
    {
      id: 'u-demo-3',
      fullName: 'Mara Quinn',
      username: 'maraquinn',
      email: 'mara@darkbook.test',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
      cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      bio: 'Building calm among chaos.',
      location: 'London, UK',
      joined: '2023-07-01',
      privacy: { publicProfile: true, friendsOnlyPosts: true, hideActivity: false }
    }
  ];

  const defaultState = {
    auth: { userId: null },
    users: demoUsers,
    friends: [
      { id: 'f-1', userId: 'u-demo-1', friendId: 'u-demo-2', status: 'accepted' },
      { id: 'f-2', userId: 'u-demo-1', friendId: 'u-demo-3', status: 'accepted' }
    ],
    requests: [
      {
        id: 'r-1',
        senderId: 'u-demo-2',
        receiverId: 'u-demo-1',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ],
    notifications: [
      {
        id: 'n-1',
        userId: 'u-demo-1',
        type: 'friend_request',
        text: 'Vesper sent you a new friend request.',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'n-2',
        userId: 'u-demo-1',
        type: 'comment',
        text: 'Mara commented on your post.',
        read: false,
        createdAt: new Date().toISOString()
      }
    ],
    posts: [
      {
        id: 'p-1',
        authorId: 'u-demo-1',
        content: 'The city is loud. The signal is clearer after midnight.',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        likes: [{ id: 'l-1', userId: 'u-demo-2' }, { id: 'l-2', userId: 'u-demo-3' }],
        comments: [
          {
            id: 'c-1',
            authorId: 'u-demo-2',
            text: 'This is exactly it.',
            createdAt: new Date().toISOString()
          }
        ],
        media: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'],
        shares: 3,
        saved: false
      },
      {
        id: 'p-2',
        authorId: 'u-demo-2',
        content: 'Private rooms. Public masks. We are still learning how to be honest online.',
        visibility: 'friends',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        likes: [{ id: 'l-3', userId: 'u-demo-1' }],
        comments: [{ id: 'c-2', authorId: 'u-demo-1', text: 'That is the real signal.', createdAt: new Date().toISOString() }],
        media: [],
        shares: 1,
        saved: false
      }
    ],
    messages: [
      {
        id: 'm-1',
        conversationId: 'conv-1',
        senderId: 'u-demo-2',
        text: 'You ready for the next move?',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
      },
      {
        id: 'm-2',
        conversationId: 'conv-1',
        senderId: 'u-demo-1',
        text: 'Always. The city is listening.',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      }
    ],
    conversations: [
      { id: 'conv-1', participants: ['u-demo-1', 'u-demo-2'], lastMessageAt: new Date().toISOString() }
    ],
    stories: [
      { id: 's-1', userId: 'u-demo-2', media: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=500&q=80', text: 'Night drift', createdAt: new Date().toISOString() },
      { id: 's-2', userId: 'u-demo-3', media: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80', text: 'After hours', createdAt: new Date().toISOString() }
    ],
    groups: [
      { id: 'g-1', name: 'Night Shift', description: 'Late-hour strategy and after-dark ideas.', visibility: 'public' },
      { id: 'g-2', name: 'Signal House', description: 'Members-only circle for trust-first conversations.', visibility: 'private' }
    ],
    pages: [
      { id: 'pge-1', name: 'Night Circuit', description: 'Culture, motion, and signal tracking.', followers: 824 }
    ],
    ui: { currentSection: 'feed', feedSort: 'recent' }
  };

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      return { ...structuredClone(defaultState), ...parsed };
    } catch (error) {
      console.warn('State read failed:', error);
      return structuredClone(defaultState);
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function ensureUsersHaveProfiles() {
    const state = readState();
    if (!state.users || !state.users.length) {
      state.users = structuredClone(demoUsers);
    }
    if (!state.auth.userId && state.users[0]) {
      state.auth.userId = state.users[0].id;
    }
    saveState(state);
  }

  function normalizeUserId(id) {
    return id || 'u-demo-1';
  }

  function getCurrentUser() {
    const state = readState();
    const userId = normalizeUserId(state.auth.userId);
    return state.users.find((user) => user.id === userId) || state.users[0];
  }

  function setCurrentUser(userId) {
    const state = readState();
    state.auth.userId = userId;
    saveState(state);
  }

  function byId(collection, id) {
    return (collection || []).find((item) => item.id === id);
  }

  function formatTimeAgo(input) {
    const diff = Date.now() - new Date(input).getTime();
    const minutes = Math.max(1, Math.floor(diff / 60000));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }

  function showToast(message) {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    root.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2200);
  }

  function generateProfilePreview(user) {
    return {
      id: user.id,
      name: user.fullName,
      username: user.username,
      avatar: user.avatar,
      location: user.location || 'Unknown'
    };
  }

  function renderAuthScreen() {
    const authScreen = document.getElementById('auth-screen');
    const appShell = document.getElementById('app-shell');
    const currentUser = getCurrentUser();

    if (!currentUser) {
      authScreen.classList.remove('hidden');
      appShell.classList.add('hidden');
      return;
    }

    authScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
  }

  function renderTopbar() {
    const currentUser = getCurrentUser();
    const topAvatar = document.getElementById('top-avatar');
    const topName = document.getElementById('top-name');
    if (topAvatar) topAvatar.src = currentUser.avatar;
    if (topName) topName.textContent = currentUser.fullName.split(' ')[0];

    const composerAvatar = document.getElementById('composer-avatar');
    if (composerAvatar) composerAvatar.src = currentUser.avatar;

    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) profileAvatar.src = currentUser.avatar;

    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = currentUser.fullName;

    const profileHandle = document.getElementById('profile-handle');
    if (profileHandle) profileHandle.textContent = '@' + currentUser.username;

    const profileJoined = document.getElementById('profile-joined');
    if (profileJoined) profileJoined.textContent = currentUser.joined || 'recently';

    const profileLocation = document.getElementById('profile-location');
    if (profileLocation) profileLocation.textContent = currentUser.location || 'Unknown';

    const profileBio = document.getElementById('profile-bio');
    if (profileBio) profileBio.textContent = currentUser.bio || 'No bio added yet.';
  }

  function renderFeed() {
    const state = readState();
    const list = document.getElementById('posts-container');
    if (!list) return;

    const currentUser = getCurrentUser();
    const posts = [...state.posts].sort((a, b) => {
      const sort = state.ui.feedSort || 'recent';
      if (sort === 'top') {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (!posts.length) {
      list.innerHTML = '<div class="empty-state">No posts yet. Start the next story from the dark.</div>';
      return;
    }

    list.innerHTML = posts.map((post) => {
      const author = state.users.find((user) => user.id === post.authorId) || currentUser;
      const liked = (post.likes || []).some((like) => like.userId === currentUser.id);
      const commentCount = post.comments?.length || 0;
      const imageMarkup = (post.media || []).map((item) => {
        if (/\.(mp4|webm|ogg)$/i.test(item)) {
          return `<video controls src="${item}"></video>`;
        }
        return `<img src="${item}" alt="post media" />`;
      }).join('');

      return `
        <article class="post-card" data-post-id="${post.id}">
          <div class="post-top">
            <div class="post-author">
              <img src="${author.avatar}" alt="${author.fullName}" />
              <div class="meta">
                <strong>${author.fullName}</strong>
                <span>@${author.username} · ${formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            <button class="post-menu" data-action="post-menu" data-id="${post.id}">⋯</button>
          </div>
          <div class="post-body">${escapeHtml(post.content || '')}</div>
          ${(post.media && post.media.length) ? `<div class="post-media-grid">${imageMarkup}</div>` : ''}
          <div class="post-stats">
            <span>${(post.likes || []).length} likes</span>
            <span>${commentCount} comments</span>
            <span>${post.shares || 0} shares</span>
          </div>
          <div class="post-actions">
            <button class="action-btn ${liked ? 'active' : ''}" data-action="like-post" data-id="${post.id}">♥ Like</button>
            <button class="action-btn" data-action="comment-post" data-id="${post.id}">✎ Comment</button>
            <button class="action-btn" data-action="share-post" data-id="${post.id}">⤴ Share</button>
            <button class="action-btn" data-action="save-post" data-id="${post.id}">☆ Save</button>
            <button class="action-btn" data-action="report-post" data-id="${post.id}">⚑ Report</button>
          </div>
          <div class="comment-box">
            <div class="comment-row">
              <input type="text" data-comment-input="${post.id}" placeholder="Write a comment..." />
              <button class="primary-btn small" data-action="add-comment" data-id="${post.id}">Send</button>
            </div>
            <div class="comment-list">
              ${(post.comments || []).slice(0, 3).map((comment) => {
                const user = state.users.find((u) => u.id === comment.authorId) || currentUser;
                return `
                  <div class="comment"><strong>${user.fullName}</strong>${escapeHtml(comment.text)}</div>
                `;
              }).join('') || '<div class="comment">No comments yet.</div>'}
            </div>
          </div>
        </article>
      `;
    }).join('');

    const countNode = document.getElementById('post-count');
    if (countNode) countNode.textContent = `${posts.length} posts`;
  }

  function renderFriendRequests() {
    const state = readState();
    const currentUser = getCurrentUser();
    const requestsRoot = document.getElementById('friend-requests');
    const suggestionsRoot = document.getElementById('friend-suggestions');
    if (!requestsRoot || !suggestionsRoot) return;

    const incoming = state.requests.filter((request) => request.receiverId === currentUser.id && request.status === 'pending');
    const outgoing = state.requests.filter((request) => request.senderId === currentUser.id && request.status === 'pending');

    requestsRoot.innerHTML = incoming.length ? incoming.map((request) => {
      const sender = state.users.find((user) => user.id === request.senderId);
      return `
        <div class="request-item">
          <div class="request-meta">
            <div class="avatar">${sender.fullName[0]}</div>
            <div>
              <strong>${sender.fullName}</strong>
              <small>@${sender.username}</small>
            </div>
          </div>
          <div class="request-actions">
            <button class="primary-btn small" data-action="accept-request" data-id="${request.id}">Accept</button>
            <button class="ghost-btn small" data-action="reject-request" data-id="${request.id}">Reject</button>
          </div>
        </div>
      `;
    }).join('') : '<div class="empty-state">No incoming requests.</div>';

    const candidates = state.users.filter((user) => user.id !== currentUser.id).slice(0, 4);
    suggestionsRoot.innerHTML = candidates.map((user) => `
      <div class="request-item">
        <div class="request-meta">
          <div class="avatar">${user.fullName[0]}</div>
          <div>
            <strong>${user.fullName}</strong>
            <small>@${user.username}</small>
          </div>
        </div>
        <button class="ghost-btn small" data-action="send-request" data-id="${user.id}">Connect</button>
      </div>
    `).join('');

    const outgoingRoot = document.getElementById('outgoing-requests');
    if (outgoingRoot) {
      outgoingRoot.innerHTML = outgoing.length ? outgoing.map((request) => {
        const target = state.users.find((user) => user.id === request.receiverId);
        return `<div class="request-item"><div>${target.fullName}</div><button class="ghost-btn small" data-action="cancel-request" data-id="${request.id}">Cancel</button></div>`;
      }).join('') : '<div class="empty-state">No outgoing requests.</div>';
    }
  }

  function renderNotifications() {
    const list = document.getElementById('notifications-list');
    if (!list) return;
    const state = readState();
    const currentUser = getCurrentUser();
    const items = state.notifications.filter((n) => n.userId === currentUser.id);

    if (!items.length) {
      list.innerHTML = '<div class="empty-state">No notifications.</div>';
      return;
    }

    list.innerHTML = items.map((item) => `
      <div class="notification-item ${item.read ? '' : 'unread'}">
        <div>
          <strong>${item.type.toUpperCase()}</strong>
          <p>${item.text}</p>
        </div>
        <button class="ghost-btn small" data-action="mark-notification-read" data-id="${item.id}">${item.read ? 'Read' : 'Mark read'}</button>
      </div>
    `).join('');
  }

  function renderMessages() {
    const state = readState();
    const currentUser = getCurrentUser();
    const convoId = 'conv-1';
    const conversation = state.conversations.find((item) => item.id === convoId);
    if (!conversation) return;

    const partner = state.users.find((user) => user.id !== currentUser.id) || currentUser;
    const chatBody = document.querySelector('.chat-body');
    if (!chatBody) return;

    const messages = state.messages.filter((m) => m.conversationId === convoId);
    chatBody.innerHTML = messages.map((message) => {
      const isOutgoing = message.senderId === currentUser.id;
      return `<div class="message ${isOutgoing ? 'outgoing' : 'incoming'}">${escapeHtml(message.text)}</div>`;
    }).join('');

    const header = document.querySelector('.message-header strong');
    if (header) header.textContent = partner.fullName;
  }

  function renderSections() {
    const state = readState();
    document.querySelectorAll('.section').forEach((section) => {
      section.classList.toggle('active', section.id === `${state.ui.currentSection}-section`);
    });

    document.querySelectorAll('.nav-link').forEach((button) => {
      const route = button.getAttribute('data-route');
      button.classList.toggle('active', route === state.ui.currentSection);
    });
  }

  function bindNavigation() {
    document.querySelectorAll('[data-route]').forEach((button) => {
      button.addEventListener('click', () => {
        const route = button.getAttribute('data-route');
        const state = readState();
        state.ui.currentSection = route;
        saveState(state);
        renderSections();
      });
    });
  }

  function bindAuthForms() {
    document.querySelector('[data-auth-view]').addEventListener('click', () => {});

    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-auth-view');
        document.querySelectorAll('.tab-btn').forEach((tab) => tab.classList.toggle('active', tab === btn));
        document.querySelectorAll('.auth-form').forEach((form) => {
          form.classList.toggle('active', form.id === `${view}-form`);
        });
      });
    });

    document.getElementById('login-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const state = readState();

      const user = state.users.find((candidate) => candidate.email === email);
      if (!user || password.length < 4) {
        showToast('Invalid credentials.');
        return;
      }

      setCurrentUser(user.id);
      renderAuthScreen();
      render();
      showToast('Welcome back to darkbook.');
    });

    document.getElementById('register-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const fullName = document.getElementById('register-name').value.trim();
      const username = document.getElementById('register-username').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;

      if (!fullName || !username || !email || password.length < 6) {
        showToast('Please complete all fields with a valid password.');
        return;
      }

      const state = readState();
      const taken = state.users.some((user) => user.username.toLowerCase() === username.toLowerCase() || user.email.toLowerCase() === email.toLowerCase());
      if (taken) {
        showToast('A user with that email or username already exists.');
        return;
      }

      const newUser = {
        id: createId('u'),
        fullName,
        username,
        email,
        avatar: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80',
        cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
        bio: 'New to darkbook. Ready to build connections.',
        location: 'Unknown',
        joined: new Date().toISOString().slice(0, 10),
        privacy: { publicProfile: true, friendsOnlyPosts: true, hideActivity: false }
      };

      state.users.push(newUser);
      state.auth.userId = newUser.id;
      saveState(state);
      renderAuthScreen();
      render();
      showToast('Account created. Welcome to darkbook.');
    });

    document.getElementById('reset-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('reset-email').value.trim();
      if (!email) {
        showToast('Enter your recovery email.');
        return;
      }
      showToast('Recovery email sent.');
    });

    document.querySelector('[data-action="show-reset"]').addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelectorAll('.auth-form').forEach((form) => form.classList.remove('active'));
      document.getElementById('reset-form').classList.add('active');
    });

    document.querySelector('[data-action="demo-login"]').addEventListener('click', () => {
      const state = readState();
      const demoUser = state.users[0];
      setCurrentUser(demoUser.id);
      renderAuthScreen();
      render();
      showToast(`Logged in as ${demoUser.fullName}.`);
    });
  }

  function bindGlobalActions() {
    document.getElementById('logout-button').addEventListener('click', () => {
      const state = readState();
      state.auth.userId = null;
      saveState(state);
      renderAuthScreen();
      render();
      showToast('Logged out.');
    });

    document.querySelector('[data-action="toggle-notifications"]').addEventListener('click', () => {
      const state = readState();
      state.ui.currentSection = 'notifications';
      saveState(state);
      renderSections();
    });

    document.querySelector('[data-action="open-messenger"]').addEventListener('click', () => {
      const state = readState();
      state.ui.currentSection = 'messages';
      saveState(state);
      renderSections();
    });

    document.querySelector('[data-action="open-create-post"]').addEventListener('click', () => {
      document.getElementById('post-input').focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelector('[data-action="open-profile"]').addEventListener('click', () => {
      const state = readState();
      state.ui.currentSection = 'profile';
      saveState(state);
      renderSections();
    });

    document.getElementById('publish-post').addEventListener('click', () => {
      const content = document.getElementById('post-input').value.trim();
      const visibility = document.getElementById('post-visibility').value;
      const mediaFiles = document.getElementById('post-image-upload').files.length ? Array.from(document.getElementById('post-image-upload').files) : [];
      const videoFiles = document.getElementById('post-video-upload').files.length ? [document.getElementById('post-video-upload').files[0]] : [];

      if (!content && !mediaFiles.length && !videoFiles.length) {
        showToast('Write something or add media before publishing.');
        return;
      }

      const state = readState();
      const currentUser = getCurrentUser();
      const media = [];

      for (const file of [...mediaFiles, ...videoFiles]) {
        const url = URL.createObjectURL(file);
        media.push(url);
      }

      const newPost = {
        id: createId('p'),
        authorId: currentUser.id,
        content,
        visibility,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        media,
        shares: 0,
        saved: false
      };

      state.posts.unshift(newPost);
      saveState(state);
      document.getElementById('post-input').value = '';
      document.getElementById('post-image-upload').value = '';
      document.getElementById('post-video-upload').value = '';
      document.getElementById('media-preview').innerHTML = '';
      render();
      showToast('Published to your feed.');
    });

    document.getElementById('global-search').addEventListener('input', (event) => {
      const value = event.target.value.toLowerCase();
      const state = readState();
      if (!value) {
        renderFeed();
        return;
      }

      const filtered = state.posts.filter((post) => {
        const author = state.users.find((user) => user.id === post.authorId);
        return (post.content || '').toLowerCase().includes(value) || (author?.fullName || '').toLowerCase().includes(value);
      });
      const list = document.getElementById('posts-container');
      list.innerHTML = filtered.length ? filtered.map((post) => {
        const author = state.users.find((user) => user.id === post.authorId);
        return `<div class="post-card"><div class="post-top"><div class="post-author"><img src="${author.avatar}" /><div class="meta"><strong>${author.fullName}</strong><span>@${author.username}</span></div></div></div><div class="post-body">${escapeHtml(post.content)}</div></div>`;
      }).join('') : '<div class="empty-state">No search matches.</div>';
    });

    document.querySelectorAll('.sort-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const state = readState();
        state.ui.feedSort = button.getAttribute('data-feed-sort');
        saveState(state);
        document.querySelectorAll('.sort-btn').forEach((btn) => btn.classList.toggle('active', btn === button));
        renderFeed();
      });
    });

    document.addEventListener('click', (event) => {
      const actionNode = event.target.closest('[data-action]');
      if (!actionNode) return;
      const action = actionNode.getAttribute('data-action');
      const id = actionNode.getAttribute('data-id');

      switch (action) {
        case 'like-post': {
          const state = readState();
          const post = state.posts.find((item) => item.id === id);
          if (!post) return;
          const currentUser = getCurrentUser();
          const exists = (post.likes || []).some((like) => like.userId === currentUser.id);
          if (exists) {
            post.likes = (post.likes || []).filter((like) => like.userId !== currentUser.id);
          } else {
            post.likes = [...(post.likes || []), { id: createId('l'), userId: currentUser.id }];
          }
          saveState(state);
          renderFeed();
          break;
        }
        case 'add-comment': {
          const input = document.querySelector(`[data-comment-input="${id}"]`);
          const value = input?.value.trim();
          if (!value) return;
          const state = readState();
          const post = state.posts.find((item) => item.id === id);
          post.comments = post.comments || [];
          post.comments.push({
            id: createId('c'),
            authorId: getCurrentUser().id,
            text: value,
            createdAt: new Date().toISOString()
          });
          saveState(state);
          input.value = '';
          renderFeed();
          break;
        }
        case 'share-post': {
          const state = readState();
          const post = state.posts.find((item) => item.id === id);
          if (!post) return;
          post.shares = (post.shares || 0) + 1;
          saveState(state);
          renderFeed();
          showToast('Post shared.');
          break;
        }
        case 'save-post': {
          const state = readState();
          const post = state.posts.find((item) => item.id === id);
          if (!post) return;
          post.saved = !post.saved;
          saveState(state);
          renderFeed();
          showToast(post.saved ? 'Saved to your bookmarks.' : 'Removed from bookmarks.');
          break;
        }
        case 'report-post': {
          showToast('Post reported to moderation.');
          break;
        }
        case 'accept-request': {
          const state = readState();
          const request = state.requests.find((item) => item.id === id);
          if (request) {
            request.status = 'accepted';
            state.friends.push({ id: createId('f'), userId: request.receiverId, friendId: request.senderId, status: 'accepted' });
            state.notifications.push({ id: createId('n'), userId: request.receiverId, type: 'friend_accepted', text: 'Friend request accepted.', read: false, createdAt: new Date().toISOString() });
            saveState(state);
            renderFriendRequests();
            renderNotifications();
            showToast('Friend request accepted.');
          }
          break;
        }
        case 'reject-request': {
          const state = readState();
          state.requests = state.requests.filter((item) => item.id !== id);
          saveState(state);
          renderFriendRequests();
          showToast('Friend request rejected.');
          break;
        }
        case 'send-request': {
          const state = readState();
          const currentUser = getCurrentUser();
          const already = state.requests.some((request) => request.senderId === currentUser.id && request.receiverId === id || request.receiverId === currentUser.id && request.senderId === id);
          if (already) {
            showToast('Request already sent.');
            return;
          }
          state.requests.push({ id: createId('r'), senderId: currentUser.id, receiverId: id, status: 'pending', createdAt: new Date().toISOString() });
          state.notifications.push({ id: createId('n'), userId: id, type: 'friend_request', text: `${currentUser.fullName} sent you a friend request.`, read: false, createdAt: new Date().toISOString() });
          saveState(state);
          renderFriendRequests();
          renderNotifications();
          showToast('Friend request sent.');
          break;
        }
        case 'mark-notification-read': {
          const state = readState();
          const item = state.notifications.find((n) => n.id === id);
          if (item) item.read = true;
          saveState(state);
          renderNotifications();
          break;
        }
        case 'mark-all-read': {
          const state = readState();
          state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
          saveState(state);
          renderNotifications();
          showToast('All notifications marked as read.');
          break;
        }
        case 'post-menu': {
          showToast('Post controls are available in the full app flow.');
          break;
        }
      }
    });

    document.querySelector('[data-action="mark-all-read"]').addEventListener('click', () => {
      const state = readState();
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      saveState(state);
      renderNotifications();
    });

    document.querySelector('#message-input + .primary-btn')?.addEventListener('click', () => {
      const input = document.getElementById('message-input');
      const text = input.value.trim();
      if (!text) return;
      const state = readState();
      state.messages.push({
        id: createId('m'),
        conversationId: 'conv-1',
        senderId: getCurrentUser().id,
        text,
        createdAt: new Date().toISOString()
      });
      saveState(state);
      input.value = '';
      renderMessages();
      showToast('Message sent.');
    });
  }

  function render() {
    ensureUsersHaveProfiles();
    renderAuthScreen();
    renderTopbar();
    renderSections();
    renderFeed();
    renderFriendRequests();
    renderNotifications();
    renderMessages();
  }

  function init() {
    const currentUser = getCurrentUser();
    if (currentUser) {
      renderAuthScreen();
    }
    bindNavigation();
    bindAuthForms();
    bindGlobalActions();
    render();

    document.getElementById('media-preview').innerHTML = '';
    document.getElementById('post-image-upload').addEventListener('change', (event) => {
      const preview = document.getElementById('media-preview');
      const files = Array.from(event.target.files || []);
      preview.innerHTML = files.map((file) => {
        const url = URL.createObjectURL(file);
        return `<div class="preview-item"><img src="${url}" alt="preview" /></div>`;
      }).join('');
    });

    document.getElementById('post-video-upload').addEventListener('change', (event) => {
      const preview = document.getElementById('media-preview');
      const file = event.target.files?.[0];
      if (!file) return;
      preview.innerHTML = `<div class="preview-item"><video src="${URL.createObjectURL(file)}" controls></video></div>`;
    });
  }

  function escapeHtml(string) {
    return String(string || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  window.darkbook = {
    init,
    render,
    showToast,
    getCurrentUser,
    readState,
    saveState,
    escapeHtml,
    createId
  };

  document.addEventListener('DOMContentLoaded', init);
})();
