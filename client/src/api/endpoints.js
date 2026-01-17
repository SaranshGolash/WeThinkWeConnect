export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    THOUGHTS: {
      GET_FEED: '/thoughts',
      CREATE: '/thoughts',
      EXTEND: (id) => `/thoughts/${id}/extend`, // Dynamic endpoint example
    },
    USERS: {
      PROFILE: '/users/profile',
      DASHBOARD: '/users/dashboard',
      PUBLIC_PROFILE: (username) => `/users/${username}`,
    },
    // Socket events aren't HTTP endpoints, but you can list event names here if you want
    SOCKET: {
      CONNECT: 'connect',
      JOIN_ROOM: 'join_room',
      ECHO_ATTEMPT: 'echo_attempt',
    }
  };