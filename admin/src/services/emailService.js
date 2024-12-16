import axios from 'axios';

export const sendInviteEmail = async (email, password) => {
  const response = await axios.post('http://api.agencydirectory.com/send-invite', {
    email,
    password,
  });
  return response.data;
};
