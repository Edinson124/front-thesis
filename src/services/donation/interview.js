import { get, post } from '@/api';

const getInterviewStructure = async () => {
  try {
    const response = await get(`/interview-structure`);
    const questionsJson = JSON.parse(response.questions);
    return questionsJson;
  } catch (error) {
    console.error('Error al obtener entrevista: ', error);
    return null;
  }
};

const createInterviewAnswer = async (answer, donationId) => {
  try {
    // const answer = JSON.stringify(answerObject);
    const response = await post(`/interview-answer`, { answer, donationId });
    return response;
  } catch (error) {
    console.error('Error al registrar respuestas de entrevista: ', error);
    return null;
  }
};

export default {
  getInterviewStructure,
  createInterviewAnswer
};
