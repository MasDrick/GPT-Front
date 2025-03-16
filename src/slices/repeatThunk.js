// // slices/chatThunk.js
// import { addMessage } from './chatHistorySlice';
// import axios from 'axios';

// export const repeatMessageThunk =
//   ({ apiUrl, userPrompt, activeBrain }) =>
//   async (dispatch) => {
//     dispatch(addMessage({ type: 'user', text: userPrompt }));

//     try {
//       const response = await axios.post(apiUrl);
//       const {
//         response: botResponse,
//         image_url: imageUrl,
//         used_prompt: used_prompt,
//       } = response.data;

//       // console.log(response.data);

//       dispatch(
//         addMessage({
//           type: 'bot',
//           text: botResponse || '',
//           image: imageUrl || '',
//           apiUrl: apiUrl || '',
//           activeBrain: activeBrain || '',
//           used_prompt: used_prompt || '',
//           userPrompt: userPrompt || '',
//         }),
//       );
//     } catch (error) {
//       console.error('Ошибка при получении ответа:', error);
//       dispatch(
//         addMessage({
//           type: 'bot',
//           text: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
//         }),
//       );
//     }
//   };
