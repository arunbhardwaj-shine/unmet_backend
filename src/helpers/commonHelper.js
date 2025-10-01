import axios from "axios";
export const fetchUserData = async (accessToken) => {
  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response?.data || null;
  } catch (error) {
    console.error(
      'Failed to fetch user data:',
      error?.response?.data || error.message
    );
    return null;
  }
};

export const getUserEncryptedId = async (userid) => {
  try {
    const response = await axios.post('https://webinar.docintel.app/lmn/getEncryptionOrg/',{user_id: userid});
    return response?.data || null;
  } catch (error) {
    console.error(
      'Failed to fetch user data:',
      error?.response?.data || error.message
    );
    return null;
  }
};

export const shareArticle = async (payload) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://webinar.docintel.app/lmn/api/Webservice/share_article_doc",
      data: payload,
    });
    return response?.data || null;
  } catch (error) {
    console.error(
      'Failed to fetch user data:',
      error?.response?.data || error.message
    );
    return null;
  }
};