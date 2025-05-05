import interviewService from '@/services/donation/interview';
import { defineStore } from 'pinia';

export const useInterviewStore = defineStore('interview', () => {
  const getInterviewStructure = async () => {
    try {
      const response = await interviewService.getInterviewStructure();
      return response;
    } catch (error) {
      console.error('Error al obtener entrevista: ', error);
      return null;
    }
  };

  const createInterviewAnswer = async (answer, donationId) => {
    try {
      const response = await interviewService.createInterviewAnswer(answer, donationId);
      return response;
    } catch (error) {
      console.error('Error al registrar respuestas de entrevista: ', error);
      return null;
    }
  };

  return {
    getInterviewStructure,
    createInterviewAnswer
  };
});
